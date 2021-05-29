
// USDT/BXH, 0x8611a52e8AC5E10651DF7C4b58F42536f0bd2e7E

import { BigNumber } from "bignumber.js";
import { Connection, createConnection, getConnection } from "typeorm"
import { getPairAddress, getPairContract } from "../update/common"


async function main(){
    const conn = await createConnection();
    
    console.log("Print pair info")
    let addr = await getPairAddress("BACK", "BXH", "BXH")
    // const contract = getPairContract("0x8611a52e8AC5E10651DF7C4b58F42536f0bd2e7E");

    const contract = getPairContract(addr);

    let result = await contract.getReserves()
    console.log(result)
    console.log(result.reserve0.toString())
    console.log(result.reserve1.toString())
    let bxhAmount = new BigNumber(result.reserve1.toString())
    console.log("bxhAmount: ", bxhAmount.toString())
    let usdtAmount = new BigNumber(result.reserve0.toString())
    console.log("usdtAmount: ", usdtAmount.toString())
    let bxhPrice = usdtAmount.div(bxhAmount)
    console.log("bxh price:", bxhPrice.toString())
    console.log("END")
}

main()