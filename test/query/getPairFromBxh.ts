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
        .createQueryBuilder()
        .where({
            defiAPP:app,
            token0Symbol:'HUSD'
        })
        .getOne()
    console.log(pair)
}

main()