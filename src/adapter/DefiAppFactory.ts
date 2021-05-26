import { Connection } from "typeorm";
import { DefiApp } from "../entity/DefiApp";
import { SmartContract } from "../entity/SmartContract";
import { IfDefiAppOption } from "./DefiApp";


export async function createDefiApp(connection: Connection, option: IfDefiAppOption): Promise<void> {
    let app = new DefiApp();
    app.name = option.name;
    app.desc = option.desc;
    app.url = option.url;

    let resultApp = await connection.manager.save(app);
    console.log(resultApp);

    for (let contract of option.contracts) {
        let contract0 = new SmartContract();
        contract0.address = contract.address
        contract0.desc = contract.desc
        contract0.name = contract.name
        contract0.defiApp = resultApp

        let resultContract0 = await connection.manager.save(contract0);

        console.log(resultContract0);
    }
}

export async function readDefiApp(connection: Connection, option: IfDefiAppOption): Promise<void> {
    const appDepository = connection.getRepository(DefiApp)

    let app = await appDepository.findOne({
        relations: ['contracts'],
        where: { name: option.name }
    });

    console.log(app)

}
