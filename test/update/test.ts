import { Connection } from "typeorm";
import { handleSingle } from "./updateSingle";


export async function test(connection:Connection, addr:string, defiapp:string) {
    console.log('test')
    await handleSingle(connection, addr, defiapp )
}