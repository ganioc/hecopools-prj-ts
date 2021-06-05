import { createConnection } from "typeorm";
import { BACK2USDT_price, USDT2BXH_price } from "../../src/adapter/heco/getprice/BXH";
import { savePrice } from "../../src/adapter/db/db";
import { DelayMs } from "../../src/utils";
import { BACK2BXH_price } from "../query/price/BXH";

const DELAY_PERIOD = 10000;

async function main() {
    await createConnection();

    async function func(){
        console.log("\n-----------------------------")

        let result = await BACK2BXH_price();
        console.log(result)

        if(result){
            // save price to db
            let result0 = await savePrice("BXH", result.token0, result.token1, result.price0)

            console.log(result0)
        }
        // No use!
        // await DelayMs(DELAY_PERIOD);
        // result = await BACK2USDT_price();
        // console.log(result);

        await DelayMs(DELAY_PERIOD);
        result = await USDT2BXH_price();
        console.log(result);

        if(result){
            let result0 = await savePrice("BXH", result.token0, result.token1, result.price1)

            console.log(result0)
        }

        await DelayMs(DELAY_PERIOD);

        await func();
    }

    await func();
}

main();

