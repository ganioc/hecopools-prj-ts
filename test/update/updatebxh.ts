import { ethers } from "ethers";
import { Connection } from "typeorm";
import { DefiApp } from "../../src/entity/DefiApp";
import V2FactoryAbi from "../../src/config/UniswapV2Factory.json"
import V2PairAbi from "../../src/config/IUniswapV2Pair.json"
import { getTokenDecimals, getTokenName, getTokenSymbol, getTokenTotalSupply } from "../../src/adapter/contract/Token";
import configJson from "../../secret/config.json"
import { strict as assert } from 'assert'
import { Pair } from "../../src/entity/Pair";
import Abandoned from '../../src/config/abandonToken.json'
import { updateBatchPair } from "./common";

const chainUrl = "https://http-mainnet.hecochain.com"
const provider = new ethers.providers.JsonRpcProvider(chainUrl);
let walletProvider = new ethers.Wallet(configJson.secret, provider)


const addrFactory = "0xe0367ec2bd4Ba22B1593E4fEFcB91D29DE6C512a"


export function getBxhFactoryContract(){
    return new ethers.Contract(addrFactory, V2FactoryAbi.abi, walletProvider)
}

export async function updateBatchBXHPair(connection: Connection, name: string, start: number){
    console.log('\nbatch processing')
    console.log('update mdex pair')

    await updateBatchPair(connection, name, start, getBxhFactoryContract())
}

export async function updatePair(connection :Connection, name:string){
    const contract = new ethers.Contract(addrFactory, V2FactoryAbi.abi, walletProvider)
    let result = await contract.allPairsLength();

    let pairsLength = parseInt(result.toString())
    console.log('pairs length: ', pairsLength)

    // get defiApp BXH instance
    let bxhApp = await connection
        .getRepository(DefiApp)
        .findOne('BXH');
    assert(bxhApp, 'DefiApp not found: BXH' )

    for(let i = 0 ; i< pairsLength; i++){
        console.log('\nupdatePair No:',i)
        let pairAddr = await contract.allPairs(i);
        console.log(pairAddr)

        assert(pairAddr, 'Not found pair address')
        console.log('Pair Addr: ', pairAddr)

        // if already inserted continue
        let pairFind = await connection
            .getRepository(Pair)
            .findOne({
                address: pairAddr,
                defiApp: bxhApp
            })
        if(pairFind){
            console.log('Exists')
            continue
        }

        const pairContract = new ethers.Contract(pairAddr, V2PairAbi.abi, walletProvider);
        
        let token0Addr = await pairContract.token0();
        assert(token0Addr, 'Wrong token0')
        console.log('token0', token0Addr)

        let token0Symbol = await getTokenSymbol(token0Addr, walletProvider)
        assert(token0Symbol, 'Wrong symbol')
        console.log('symbol', token0Symbol)

        let inAbandon = Abandoned.abandoned.find((token)=>{
            return token.symbol === token0Symbol
        })
        // console.log('inAbandon: ', inAbandon)
        if(inAbandon){
            console.log('Will not process ', token0Symbol)
            continue
        }

        let token0Decimals = await getTokenDecimals(token0Addr, walletProvider)
        assert(token0Decimals, 'Wrong decimals')
        console.log('decimals', token0Decimals)

        let token0Name = await getTokenName(token0Addr, walletProvider);
        assert(token0Name, 'Wrong token name')
        console.log('token name', token0Name)

        let token0TotalSupply = await getTokenTotalSupply(token0Addr, walletProvider);
        assert(token0TotalSupply, 'Wrong total supply')
        console.log('totalsupply', token0TotalSupply)

        let token1Addr = await pairContract.token1();
        assert(token1Addr, 'Wrong token1')
        console.log('token1', token1Addr)

        let token1Symbol = await getTokenSymbol(token1Addr, walletProvider)
        assert(token1Symbol, 'Wrong symbol')
        console.log('symbol', token1Symbol)

        let token1Decimals = await getTokenDecimals(token1Addr, walletProvider)
        assert(token1Decimals, 'Wrong decimals')
        console.log('decimals', token1Decimals)

        let token1Name = await getTokenName(token1Addr, walletProvider);
        assert(token1Name, 'Wrong token name')
        console.log('token name', token1Name)

        let token1TotalSupply = await getTokenTotalSupply(token1Addr, walletProvider);
        assert(token1TotalSupply, 'Wrong total supply')
        console.log('totalsupply', token1TotalSupply)

        let pair = new Pair()
        pair.address = pairAddr;
        pair.token0 = token0Addr;
        pair.token1 = token1Addr;
        pair.token0Name = token0Name;
        pair.token1Name = token1Name;
        pair.token0Symbol = token0Symbol;
        pair.token1Symbol = token1Symbol;
        pair.token0Decimals = parseInt(token0Decimals);
        pair.token1Decimals = parseInt(token1Decimals);
        pair.token0TotalSupply = token0TotalSupply;
        pair.token1TotalSupply = token1TotalSupply;
        pair.update = new Date().getTime();
        pair.defiApp = bxhApp

        let pairSave = await connection
            .getRepository(Pair)
            .save(pair)
        
        assert(pairSave, 'save pair failed')
        console.log('Saved.')
    }
}
