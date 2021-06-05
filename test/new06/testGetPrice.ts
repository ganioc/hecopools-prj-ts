import { createConnection } from "typeorm";
import { BACK2BXH_price, USDT2BXH_price } from "../../src/adapter/heco/getprice/BXH";
import { savePrice } from "../../src/adapter/db/db";
import { DelayMs } from "../../src/utils";
import { IfPariPrice } from "../../src/adapter/heco/common";
// import { BACK2BXH_price } from "../query/price/BXH";

const DELAY_PERIOD = 30000;

async function handleSavePrice(func:()=>Promise<IfPariPrice>,pool:string){
    let result = await func();
    console.log(result)

    if(result){
        // save price to db
        let result0 = await savePrice(pool, result.token0, result.token1, result.price0)

        console.log(result0)
    }
}

async function main() {
    await createConnection();

    async function func(){
        console.log("\n-----------------------------")

        // let result = await BACK2BXH_price();
        // console.log(result)

        // if(result){
        //     // save price to db
        //     let result0 = await savePrice("BXH", result.token0, result.token1, result.price0)

        //     console.log(result0)
        // }
        await handleSavePrice(BACK2BXH_price, "BXH")

        await DelayMs(DELAY_PERIOD);

        await handleSavePrice(USDT2BXH_price, "BXH")

        // result = await USDT2BXH_price();
        // console.log(result);

        // if(result){
        //     let result0 = await savePrice("BXH", result.token0, result.token1, result.price1)

        //     console.log(result0)
        // }

        await DelayMs(DELAY_PERIOD);

        await func();
    }

    await func();
}

main();

