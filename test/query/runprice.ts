import { createConnection } from "typeorm";
import { DelayMs } from "../../src/utils";
import { BACK2BXH_price, BACK2USDT_price, USDT2BXH_price } from "./price/BXH";
import { MDX2USDT_price } from "./price/MDEX";


async function main(){
    await createConnection();

    async function func(){
        console.log("\n----------------------")

        await DelayMs(1000);

        let result = await BACK2BXH_price();
        console.log(result);

        await DelayMs(1000);

        result = await MDX2USDT_price();
        console.log(result);

        await DelayMs(15000);

        result = await BACK2USDT_price();
        console.log(result);

        await DelayMs(15000);
        result = await USDT2BXH_price();
        console.log(result);

        // await DelayMs(15000);
        // result = await BAC();
        // console.log(result);

        await func();
    }

    await func();
}

main()