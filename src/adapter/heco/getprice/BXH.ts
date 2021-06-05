import { getPairPrice } from "../common"


export async function BACK2BXH_price(){
    return getPairPrice('BACK', 'BXH', 'BXH')
}
export async function BACK2USDT_price(){
    return getPairPrice('BACK', 'USDT', 'BXH')
}
export async function HT2BXH_price(){
    return getPairPrice('HT', 'BXH', 'BXH')
}
export async function HT2USDT_price(){
    return getPairPrice('HT', 'USDT', 'BXH')
}
export async function USDT2BXH_price(){
    return getPairPrice('USDT', 'BXH', 'BXH')
}