import { getPairPrice } from "../../update/common";


export async function MDX2USDT_price() {
    return getPairPrice('MDX', 'USDT', 'MDEX')
}