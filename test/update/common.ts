import { ethers } from "ethers"
import { Connection } from "typeorm"
import { DefiApp } from "../../src/entity/DefiApp"
import { Pair } from "../../src/entity/Pair"
import configJson from "../../secret/config.json"
import MdexPairAbi from "../../src/config/IMdexPair.json"
import Abandoned from '../../src/config/abandonToken.json'
import {getTokenName as tokenGetTokenName, getTokenDecimals as tokenGetTokenDecimals, getTokenSymbol as tokenGetTokenSymbol, getTokenTotalSupply as tokenGetTokenTotalSupply} from '../../src/adapter/contract/Token'

const chainUrl = "https://http-mainnet.hecochain.com"
const provider = new ethers.providers.JsonRpcProvider(chainUrl);
let walletProvider = new ethers.Wallet(configJson.secret, provider)


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
