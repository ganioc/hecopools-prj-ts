import { ethers } from "ethers";
import { Connection, EntityTarget } from "typeorm";
import { Pair } from "../../entity/Pair";
import { Pool } from "../../entity/Pool";
import { SmartContract } from "../../entity/SmartContract";
import configJson from "../../../secret/config.json"
import { DelayMs } from "../../utils";
import {strict as assert} from "assert";
import MdexPairAbi from "../../config/IMdexPair.json"
import AbandonedList from '../../config/abandonToken.json'
import { getTokenDecimals, getTokenName, getTokenSymbol, getTokenTotalSupply } from "../contract/Token";
import { DefiApp } from "../../entity/DefiApp";
import { updateSingleByIndex } from "./updateSingle";


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