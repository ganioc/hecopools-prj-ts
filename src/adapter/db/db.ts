import { getConnection } from "typeorm";
import { Anchor } from "../../entity/Anchor";
import { Price } from "../../entity/Price";


export async function getAnchor(poolname: string, symbol0: string, symbol1: string) {
    // find the anchor,
    const conn = getConnection();
    const reposAnchor = conn.getRepository(Anchor);

    let anchor = await reposAnchor
        .findOne({
            poolName: poolname,
            token0Symbol: symbol0,
            token1Symbol: symbol1
        })
    if (!anchor) {
        let tmpAnchor = new Anchor();
        tmpAnchor.poolName = poolname;
        tmpAnchor.token0Symbol = symbol0;
        tmpAnchor.token1Symbol = symbol1;
        anchor = await reposAnchor.save(tmpAnchor);

        if (!anchor) {
            console.error('save Anchor failed.')
            return null;
        }
    }
    return anchor;
}
export async function saveAnchorPrice(anchor:Anchor,  price: number) {
    const conn = getConnection();
    const reposPrice = conn.getRepository(Price);
    
    let mPrice = new Price();
    mPrice.anchor = anchor;
    mPrice.value =  price;
    mPrice.timestamp = new Date().getTime();

    return reposPrice.save(mPrice);
}
export async function savePrice(poolname: string, symbol0: string, symbol1: string, price: number) {
    // find the anchor,
    const conn = getConnection();
    const reposPrice = conn.getRepository(Price);

    let anchor = await getAnchor(poolname, symbol0, symbol1)

    if(!anchor){
        console.error('anchor, savePrice failed')
        return null;
    }
    let mPrice = new Price();
    mPrice.anchor = anchor;
    mPrice.value =  price;
    mPrice.timestamp = new Date().getTime();

    return reposPrice.save(mPrice);
}