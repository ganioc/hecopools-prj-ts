import { ethers } from "ethers";
import { Connection, createConnection } from "typeorm";
import { DefiApp } from "../../src/entity/DefiApp";
import V2FactoryAbi from "../../src/config/UniswapV2Factory.json"
import V2PairAbi from "../../src/config/IUniswapV2Pair.json"
import { getTokenDecimals, getTokenName, getTokenSymbol, getTokenTotalSupply } from "../../src/adapter/contract/Token";

import { strict as assert } from 'assert'

const addrFactory = "0xe0367ec2bd4Ba22B1593E4fEFcB91D29DE6C512a"


export async function updatePair(connection: Connection, walletProvider: ethers.Wallet) {
    const contract = new ethers.Contract(addrFactory, V2FactoryAbi.abi, walletProvider)
    let result = await contract.allPairsLength();

    let pairsLength = parseInt(result.toString())
    console.log('pairs length: ', pairsLength)

    result = await contract.allPairs(0);
    console.log('pair[0] ', result)

    const pairContract = new ethers.Contract(result, V2PairAbi.abi, walletProvider)

    result = await pairContract.factory();
    console.log('factory ', result)

    result = await pairContract.token0();
    assert(result, 'Read token0')
    console.log('token0 ', result)
    console.log(await getTokenSymbol(result, walletProvider))
    console.log(await getTokenDecimals(result, walletProvider))
    console.log(await getTokenName(result, walletProvider))
    console.log(await getTokenTotalSupply(result, walletProvider))
    result = await getTokenTotalSupply(result, walletProvider)
    console.log('total: ', result.toString())

    result = await pairContract.token1();
    console.log('token1 ', result)
    console.log(await getTokenSymbol(result, walletProvider))
    console.log(await getTokenDecimals(result, walletProvider))
    console.log(await getTokenName(result, walletProvider))
    result = await getTokenTotalSupply(result, walletProvider)
    console.log('total: ', result.toString())

    result = await pairContract.getReserves();
    console.log('getReserves ', result)
    console.log('reserve0: ', result.reserve0.toString())
    console.log('reserve1: ', result.reserve1.toString())

    // assert(undefined, "Not a number")
}
