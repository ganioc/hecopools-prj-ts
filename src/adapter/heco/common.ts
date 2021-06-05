// This file is about query the Heco Chain
import { ethers } from "ethers";
import { Connection, EntityTarget, getConnection } from "typeorm";
import { Pair } from "../../entity/Pair";
import { Pool } from "../../entity/Pool";
import { SmartContract } from "../../entity/SmartContract";
import configJson from "../../../secret/config.json"
import { DelayMs } from "../../utils";
import {strict as assert} from "assert";
import MdexPairAbi from "../../config/IMdexPair.json"
import AbandonedList from '../../config/abandonToken.json'
import { getTokenDecimals, getTokenName, getTokenSymbol, getTokenTotalSupply } from "./contract/Token";
import { DefiApp } from "../../entity/DefiApp";
import { updateSingleByIndex } from "../cli/updateSingle";
import BigNumber from "bignumber.js"

require('custom-env').env()
    

let chainUrl = "";

if (process.env.WHEREAMI === 'Hongkong') {
    chainUrl = "https://http-mainnet-node.defibox.com";
} else if (process.env.WHEREAMI === 'USA') {
    chainUrl = "https://http-mainnet.hecochain.com"
}else{
    chainUrl = "https://http-mainnet-node.defibox.com"
}


const provider = new ethers.providers.JsonRpcProvider(chainUrl);
export const walletProvider = new ethers.Wallet(configJson.secret, provider)

export interface IfPariPrice{
    token0: string,
    token1: string,
    price0: number,
    price1: number,
    timestamp: number
}

export async function getTokenNameByAddr(tokenAddr: string) {
    return getTokenName(tokenAddr, walletProvider)
}

export async function getTokenSymbolByAddr(tokenAddr: string) {
    return getTokenSymbol(tokenAddr, walletProvider)
}

export async function getTokenDecimalsByAddr(tokenAddr: string) {
    return getTokenDecimals(tokenAddr, walletProvider)
}

export async function getTokenTotalSupplyByAddr(tokenAddr: string) {
    return getTokenTotalSupply(tokenAddr, walletProvider)
}


export async function getPair(symbol0: string, symbol1: string, poolname: string) {
    const conn = getConnection();

    const repos = conn.getRepository(Pair);

    const app = await conn
        .getRepository(DefiApp)
        .findOne(poolname)

    return repos
        .createQueryBuilder("pair")
        .leftJoinAndSelect("pair.defiApp", "defiApp")
        .where({
            token0Symbol: symbol0,
            token1Symbol: symbol1,
            defiApp: app
        })
        .getOne()
}

export function getClassName<Type>(target: EntityTarget<Type>): string {
    return target.toString().split(' ')[1]
}

export function getEntityByName<Type>(name: string): EntityTarget<Type> {
    let lowerCase = name.toLowerCase();

    if (lowerCase === 'defiapp') {
        return DefiApp;
    } else if (lowerCase === 'smartcontract') {
        return SmartContract;
    } else if (lowerCase === 'pool') {
        return Pool;
    } else if (lowerCase === 'pair') {
        return Pair;
    } else {
        throw new Error('Unknown: ' + name)
    }
}

export function isAbandoned(tokenAddr: string): boolean {
    let inAbandon = AbandonedList.abandoned.find((token) => {
        return token.address === tokenAddr
    })
    // console.log('inAbandon: ', inAbandon)
    if (inAbandon) {
        console.log('Abandoned, will not process ', tokenAddr)
        return true
    }

    return false;
}

export async function existPair(conn: Connection, pairAddr: string, app: DefiApp): Promise<boolean> {
    let pairFind = await conn
        .getRepository(Pair)
        .createQueryBuilder("pair")
        .leftJoinAndSelect("pair.defiApp", "defiApp")
        .where({
            address: pairAddr,
            defiApp: app
        })
        .getOne()

    if (pairFind) {
        return true
    } else {
        return false
    }
}
export function getPairContract(contractAddr: string) {
    return new ethers.Contract(contractAddr, MdexPairAbi.abi, walletProvider)
}

export async function updateBatchPair(connection: Connection, name: string, start: number, contract: ethers.Contract) {
    let result = await contract.allPairsLength();

    let pairsLength = parseInt(result.toString())
    console.log('pairs length: ', pairsLength)

    const steps = 10;

    for (let i = start; i < pairsLength; i = i + steps) {
        let jobs = []
        for (let j = 0; j < steps; j++) {
            jobs.push(updateSingleByIndex(connection, name, i + j, contract))
        }
        await Promise.all(jobs)
            .then((result0) => {
                for (let res of result0) {
                    // if(typeof res !== 'boolean'){
                    //     console.log(res)
                    // }else{
                    //     console.log(res)
                    // }
                    console.log(res)
                }
            })
            .catch((e) => {
                console.log(e)
            })
        await DelayMs(1000)
    }
}

// To Read Pair Price
export async function getPairPrice(symbol0: string, symbol1: string, poolname: string):Promise<IfPariPrice> {
    console.log('\ngetPairPrice()')
    const pair = await getPair(symbol0, symbol1, poolname)
    const contract = getPairContract(pair.address)

    let result = await contract.getReserves()
    // console.log(result)
    // console.log(result.reserve0.toString())
    // console.log(result.reserve1.toString())

    let amount0 = new BigNumber(result.reserve0.toString())
    console.log("amount0: ", amount0.toString())
    console.log("decimals", pair.token0Decimals)

    let amount1 = new BigNumber(result.reserve1.toString())
    console.log("amount1: ", amount1.toString())
    console.log("decimals", pair.token1Decimals)

    let price0 = amount1.div(amount0)
    //console.log("price0:", price0.toString())

    let price1 = amount0.div(amount1)
    //console.log("price1:", price1.toString())

    return {
        token0: pair.token0Symbol,
        token1: pair.token1Symbol,
        price0: price0.toNumber(),
        price1: price1.toNumber(),
        timestamp: new Date().getTime()
    }
}
