import { ethers } from "ethers"
import { Connection, createConnection, getConnection } from "typeorm"
import { DefiApp } from "../../src/entity/DefiApp"
import { Pair } from "../../src/entity/Pair"
import configJson from "../../secret/config.json"
import MdexPairAbi from "../../src/config/IMdexPair.json"
import Abandoned from '../../src/config/abandonToken.json'
import {getTokenName as tokenGetTokenName, getTokenDecimals as tokenGetTokenDecimals, getTokenSymbol as tokenGetTokenSymbol, getTokenTotalSupply as tokenGetTokenTotalSupply} from '../../src/adapter/contract/Token'
import BigNumber from "bignumber.js"
import { updateSingleByIndex } from "./updateSingle"
import { DelayMs } from "../../src/utils"

require('custom-env').env()

let 
 chainUrl = "https://http-mainnet-node.defibox.com"

 if(process.env.WHEREAMI === 'Hongkong'){
    chainUrl = "https://http-mainnet-node.defibox.com";
}else if(process.env.WHEREAMI === 'USA'){
    chainUrl = "https://http-mainnet.hecochain.com"
}

// abroad url
// "https://http-mainnet.hecochain.com"


const provider = new ethers.providers.JsonRpcProvider(chainUrl);
export const walletProvider = new ethers.Wallet(configJson.secret, provider)


export async function existPair(connection: Connection, pairAddr: string, app: DefiApp): Promise<boolean> {
    let pairFind = await connection
        .getRepository(Pair)
        .findOne({
            address: pairAddr,
            defiApp: app
        })
    if (pairFind) {
        return true
    } else {
        return false
    }
}

export function getPairContract(contractAddr:string){
    return new ethers.Contract(contractAddr, MdexPairAbi.abi, walletProvider)
}

export function isAbandoned(tokenAddr:string):Boolean{
    let inAbandon = Abandoned.abandoned.find((token)=>{
        return token.address === tokenAddr
    })
    // console.log('inAbandon: ', inAbandon)
    if(inAbandon){
        console.log('Abandoned, will not process ', tokenAddr)
        return true
    }

    return false;
}

export async function getTokenName(tokenAddr:string){
    return tokenGetTokenName(tokenAddr, walletProvider)
}
export async function getTokenTotalSupply(tokenAddr:string) {
    return tokenGetTokenTotalSupply(tokenAddr, walletProvider)
}
export async function  getTokenDecimals(tokenAddr:string) {
    return tokenGetTokenDecimals(tokenAddr, walletProvider)
}
export async function getTokenSymbol(tokenAddr:string) {
    return tokenGetTokenSymbol(tokenAddr, walletProvider)
}

export async function getPairAddress(token0sym:string, token1sym:string, poolname:string):Promise<string>{
    const conn = getConnection();

    const repos = conn.getRepository(Pair);

    const app = await  conn
        .getRepository(DefiApp)
        .findOne(poolname)
    
    let pair = await repos 
        .createQueryBuilder("pair")
        .leftJoinAndSelect("pair.defiApp","defiApp")
        .where({
            token0Symbol: token0sym,
            token1Symbol: token1sym,
            defiApp: app
        })
        .getOne()
    return pair.address;
}

export async function getPair(symbol0: string, symbol1:string, poolname: string){
    const conn = getConnection();

    const repos = conn.getRepository(Pair);

    const app = await  conn
        .getRepository(DefiApp)
        .findOne(poolname)
    
    return repos 
        .createQueryBuilder("pair")
        .leftJoinAndSelect("pair.defiApp","defiApp")
        .where({
            token0Symbol: symbol0,
            token1Symbol: symbol1,
            defiApp: app
        })
        .getOne()
}
export async function getPairPrice(symbol0:string, symbol1:string, poolname:string) {
    console.log('getPairPrice()')
    const pair = await getPair(symbol0, symbol1, poolname)
    const contract  = getPairContract(pair.address)

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
    
    return{
        token0: pair.token0Symbol,
        token1: pair.token1Symbol,
        price0:price0.toNumber(),
        price1: price1.toNumber(),
        timestamp: new Date().getTime()
    }
}

export async function updateBatchPair(connection: Connection, name: string, start: number, contract:ethers.Contract){
    let result = await contract.allPairsLength();

    let pairsLength = parseInt(result.toString())
    console.log('pairs length: ', pairsLength)

    const steps = 10;

    for (let i = start; i < pairsLength; i = i + steps) {
        let jobs = []
        for(let j=0; j<steps; j++){
            jobs.push(updateSingleByIndex(connection, name, i+j, contract))
        }
        await Promise.all(jobs)
            .then((result0)=>{
                for(let res of result0){
                    // if(typeof res !== 'boolean'){
                    //     console.log(res)
                    // }else{
                    //     console.log(res)
                    // }
                    console.log(res)
                }
            })
            .catch((e)=>{
                console.log(e)
            })
        await DelayMs(1000)
    }
}