import { getConnection } from "typeorm";
import { Anchor } from "../../entity/Anchor";
import { Price } from "../../entity/Price";

export async function getAnchor(poolname: string, symbol0: string, symbol1: string) {
    // find the anchor
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
    console.log("\nsavePrice()", symbol0, symbol1,price)
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

// Query Pair price 

export async function queryPairPriceByPage(poolname:string, symbol0:string, symbol1:string, index:number, pageSize:number){
    console.log("queryPairPriceByPage", poolname)
    let connection = getConnection();

    // get Anchor
    let anchor = await getAnchor(poolname,symbol0,symbol1);
    if(!anchor){
        return null;
    }

    // get Prices
    return  connection.getRepository(Price)
        .createQueryBuilder("price")
        .leftJoinAndSelect("price.anchor","anchor")
        .where({
            anchor: anchor
        })
        .skip(index)
        .take(pageSize)
        .getMany();

}
export async function queryPairPriceByTime(poolname:string, symbol0:string, symbol1:string, start:number, end:number){
    console.log("queryPairPriceByTime", poolname)
    let connection = getConnection();

    // get Anchor
    let anchor = await getAnchor(poolname,symbol0,symbol1);
    if(!anchor){
        return null;
    }

    // get Prices
    return  connection.getRepository(Price)
        .createQueryBuilder("price")
        .leftJoinAndSelect("price.anchor","anchor")
        .where({
            anchor: anchor
        })
        .andWhere("price.timestamp > :start",{start:start})
        .andWhere("price.timestamp < :end", {end:end})
        .getMany();

}
