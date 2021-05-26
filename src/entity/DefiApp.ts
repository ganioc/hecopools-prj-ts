import { SmartContract } from "./SmartContract";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";


@Entity()
export class DefiApp{
    @PrimaryColumn({unique: true})
    name:string;

    @Column()
    url:string;

    @Column()
    desc:string;

    @OneToMany(()=> SmartContract, contract => contract.defiApp, {
        cascade: true
    })
    contracts: SmartContract[]

}