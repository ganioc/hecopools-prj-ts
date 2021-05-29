import { createConnection } from "typeorm";
import { DefiApp } from "../../src/entity/DefiApp";
import { Pair } from "../../src/entity/Pair";


async function main(){
    const conn = await createConnection();

    const repos = conn.getRepository(Pair);

    const app = await  conn
        .getRepository(DefiApp)
        .findOne('BXH')
    console.log(app)
    
    let pair = await repos 
        .createQueryBuilder("pair")
        .leftJoinAndSelect("pair.defiApp","defiApp")
        .where({
            // token0Symbol:'WHT',
            // token1Symbol: "USDT",
            token1Symbol: 'BXH',
            defiApp: app
        })
        .skip(0)
        .take(20)
        .getMany()
    console.log(pair)
}

main()