
import { Connection, createConnection } from "typeorm";
import { Price } from "../src/entity/Price";
import { DelayMs } from "../src/utils";


async function createPrices(conn: Connection){
    
    const name = 'acoin';
    const repos = conn.getRepository(Price)
    for(let i =0; i< 10; i++){
        let price = 100* Math.random() + 10;
        let priceObj = new Price();
        priceObj.value = price;
        // priceObj.name = name;
        priceObj.timestamp = new Date().getTime();

        await repos.manager.save(priceObj);
        console.log('write price: ', name, price)
        await DelayMs(200);
    }

}
async function readPrices(conn:Connection) {
    const repos = conn.getRepository(Price);
    let prices = await repos.findAndCount();
    console.log(prices)
}
async function deleteOldestPrice(conn:Connection){
    const repos = conn.getRepository(Price);
    let result = await repos
            .createQueryBuilder()
            .orderBy('timestamp', 'ASC')
            .getOne();
    console.log(result);
    let result1 = await repos 
            .createQueryBuilder()
            .delete()
            .where("id = :id", {id: result.id})
            .execute();
    console.log(result1)
}
async function main(){
    console.log('Start project testqueue')
    const connection = await createConnection();

    // await createPrices(connection);
    await readPrices(connection)
    //  deleteOldestPrice(connection)
}

main();
