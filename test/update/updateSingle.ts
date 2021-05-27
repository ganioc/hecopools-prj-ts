

import { strict as assert } from "assert";
import { ethers } from "ethers";
import { Connection } from "typeorm";
import { DefiApp } from "../../src/entity/DefiApp";
import { Pair } from "../../src/entity/Pair";
import { DelayMs } from "../../src/utils";
import { existPair, getPairContract, getTokenDecimals, getTokenName, getTokenSymbol, getTokenTotalSupply, isAbandoned } from "./common";
import { update } from "./updateback";


export async function handleSingle(connection: Connection, contractAddr: string, appName: string): Promise<boolean | Pair> {
    //console.log('handleSingle contract: ', contractAddr)
    console.log('defiApp name: ', appName)
    await DelayMs(Math.random()*2000)
    // get defiApp instance
    let upApp = await connection
        .getRepository(DefiApp)
        .findOne(appName);
    assert(upApp, 'DefiApp not found: ' + appName)

    let bExists = await existPair(connection, contractAddr, upApp)
    if (bExists === true) {
        console.log('Exists')
        return false
    }

    const pairContract = getPairContract(contractAddr);

    let pair = new Pair();
    pair.address = contractAddr;

    //console.log('pair.address: ', pair.address)
    // return true
    try {
        pair.token0 = await pairContract.token0()
    } catch (e) {
        return false
    }

    console.log('pair.token0:', pair.token0)
    if (isAbandoned(pair.token0)) {
        return false;
    }
    try {
        pair.token1 = await pairContract.token1()
    } catch (e) {
        return false
    }
    console.log('pair.token1:', pair.token1)
    if (isAbandoned(pair.token1)) {
        return false;
    }

    if (!(pair.token0Name = await getTokenName(pair.token0))) {
        return false
    };
    //console.log('pair.token0Name:', pair.token0Name)
    if (!(pair.token1Name = await getTokenName(pair.token1))) {
        return false
    }

    if (!(pair.token0Symbol = await getTokenSymbol(pair.token0))) {
        return false
    }
    //console.log('pair.token1Name:', pair.token1Name)
    if (!(pair.token1Symbol = await getTokenSymbol(pair.token1))) {
        return false
    }

    if (!(pair.token0Decimals = parseInt(await getTokenDecimals(pair.token0)))) {
        return false
    }
    //console.log('pair.token0Decimals:', pair.token0Decimals)
    if (!(pair.token1Decimals = parseInt(await getTokenDecimals(pair.token1)))) {
        return false
    }
    //console.log('pair.token1Decimals:', pair.token1Decimals)

    if (!(pair.token0TotalSupply = await getTokenTotalSupply(pair.token0))) {
        return false
    }
    //console.log('pair.token0TotalSupply', pair.token0TotalSupply.toString())
    if (!(pair.token1TotalSupply = await getTokenTotalSupply(pair.token1))) {
        return false;
    }
    //console.log('pair.token1TotalSupply', pair.token1TotalSupply.toString())

    pair.update = new Date().getTime();
    pair.defiApp = upApp;

    let pairSave = await connection
        .getRepository(Pair)
        .save(pair)

    assert(pairSave, 'save pair failed')
    console.log('Saved.')

    return pair;
}

export async function updateSingleByIndex(connection: Connection, name: string, index: number, contract: ethers.Contract) {
    console.log('job index: ', index)
    let pairAddr = await contract.allPairs(index);

    assert(pairAddr, 'Unknow pair address ' + index)
    console.log('pairAddr:', pairAddr)
    return handleSingle(connection, pairAddr, name)

}