import assert from "assert";
import { ethers } from "ethers";
import { Connection } from "typeorm";
import configJson from "../../secret/config.json"
import { getTokenDecimals, getTokenName, getTokenSymbol, getTokenTotalSupply } from "../../src/adapter/contract/Token";
import MdexFactoryAbi from '../../src/config/IMdexFactory.json'
import MdexPairAbi from "../../src/config/IMdexPair.json"
import { DefiApp } from "../../src/entity/DefiApp";
import { Pair } from "../../src/entity/Pair";
import Abandoned from '../../src/config/abandonToken.json'
import { existPair } from './common'
import { handleSingle, updateSingleByIndex } from "./updateSingle";
import { DelayMs } from "../../src/utils";

const chainUrl = "https://http-mainnet.hecochain.com"
const provider = new ethers.providers.JsonRpcProvider(chainUrl);
let walletProvider = new ethers.Wallet(configJson.secret, provider)

const addrFactory = "0xb0b670fc1F7724119963018DB0BfA86aDb22d941"


export async function updatePair(connection: Connection, name: string) {
    console.log('update mdex pair')
    const contract = new ethers.Contract(addrFactory, MdexFactoryAbi.abi, walletProvider)
    let result = await contract.allPairsLength();

    let pairsLength = parseInt(result.toString())
    console.log('pairs length: ', pairsLength)

    // get defiApp BXH instance
    let mdexApp = await connection
        .getRepository(DefiApp)
        .findOne('MDEX');
    assert(mdexApp, 'DefiApp not found: MDEX')

    for (let i = 0; i < pairsLength; i++) {
        console.log('\nupdatePair No: ', i)
        let pairAddr = await contract.allPairs(i);

        assert(pairAddr, 'Not found pair address')
        console.log('Pair Addr: ', pairAddr)

        let bExists = await existPair(connection, pairAddr, mdexApp)
        if (bExists === true) {
            console.log('Exists')
            continue
        }

        const pairContract = new ethers.Contract(pairAddr, MdexPairAbi.abi, walletProvider);

        let token0Addr = await pairContract.token0();
        assert(token0Addr, 'Wrong token0')
        console.log('token0', token0Addr)


        let inAbandon = Abandoned.abandoned.find((token) => {
            return token.address === token0Addr
        })
        // console.log('inAbandon: ', inAbandon)
        if (inAbandon) {
            console.log('Will not process ', token0Addr)
            continue
        }

        let token0Symbol = await getTokenSymbol(token0Addr, walletProvider)
        assert(token0Symbol, 'Wrong symbol')
        console.log('symbol', token0Symbol)


        let token0Decimals = await getTokenDecimals(token0Addr, walletProvider)
        assert(token0Decimals, 'Wrong decimals')
        console.log('decimals', token0Decimals)

        let token0Name = await getTokenName(token0Addr, walletProvider);
        assert(token0Name, 'Wrong token name')
        console.log('token name:', token0Name)

        let token0TotalSupply = await getTokenTotalSupply(token0Addr, walletProvider);
        assert(token0TotalSupply, 'Wrong total supply')
        console.log('totalsupply', token0TotalSupply.toString())

        let token1Addr = await pairContract.token1();
        assert(token1Addr, 'Wrong token1')
        console.log('token1', token1Addr)


        inAbandon = Abandoned.abandoned.find((token) => {
            return token.address === token1Addr
        })
        // console.log('inAbandon: ', inAbandon)
        if (inAbandon) {
            console.log('Will not process ', token1Addr)
            continue
        }



        let token1Symbol = await getTokenSymbol(token1Addr, walletProvider)
        assert(token1Symbol, 'Wrong symbol')
        console.log('symbol', token1Symbol)

        let token1Decimals = await getTokenDecimals(token1Addr, walletProvider)
        assert(token1Decimals, 'Wrong decimals')
        console.log('decimals', token1Decimals)

        let token1Name = await getTokenName(token1Addr, walletProvider);
        assert(token1Name, 'Wrong token name')
        console.log('token name:', token1Name)

        let token1TotalSupply = await getTokenTotalSupply(token1Addr, walletProvider);
        assert(token1TotalSupply, 'Wrong total supply')
        console.log('totalsupply', token1TotalSupply.toString())

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
        pair.defiApp = mdexApp

        let pairSave = await connection
            .getRepository(Pair)
            .save(pair)

        assert(pairSave, 'save pair failed')
        console.log('Saved.')
    }
}

// handleSingle(connection: Connection, contractAddr: string, appName: string)
export async function updateBatchPair(connection: Connection, name: string, start: number) {
    console.log('\nbatch processing')

    console.log('update mdex pair')
    const contract = new ethers.Contract(addrFactory, MdexFactoryAbi.abi, walletProvider)
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
            .then((result)=>{
                for(let res of result){
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