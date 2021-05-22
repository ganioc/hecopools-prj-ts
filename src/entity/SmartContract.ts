import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { DefiApp } from "./DefiApp";


@Entity()
export class SmartContract {
    @PrimaryColumn({unique:true})
    address: string;

    @Column()
    desc: string;

    @Column()
    name: string;

    @ManyToOne(()=> DefiApp, defiApp => defiApp.contracts)
    defiApp: DefiApp;

    
}