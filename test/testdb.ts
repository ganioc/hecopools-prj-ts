
import "reflect-metadata";
import {createConnection, EntityManager, getConnection} from "typeorm";
import {User} from "../src/entity/User";
import { DelayMs} from "../src/utils"


async function main(){
    console.log('Start project testdb')
    const connection = await createConnection();

    // console.log(connection);
    let result = await connection.manager.find(User);
    console.log(result)

    result.forEach((user)=>{
        console.log(user.name)
    })
    const manager : EntityManager = getConnection().manager;

    console.log(await manager.findOne(User))

    await DelayMs(2000);
    await connection.close();
    console.log('---- End ----')
}

main()
// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));


