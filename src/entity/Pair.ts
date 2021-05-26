
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { DefiApp } from "./DefiApp";

@Entity({ name: 'pair' })
export class Pair {
    @PrimaryColumn()
    address: string;

    @Column()
    token0: string; // address

    @Column()
    token1: string;

    @Column()
    token0Name: string; // name

    @Column()
    token1Name: string;

    @Column()
    token0Symbol: string; // symbol

    @Column()
    token1Symbol: string;

    @Column()
    token0Decimals: number; // decimals

    @Column()
    token1Decimals: number; // 

    @Column()
    token0TotalSupply: string; // total supply

    @Column()
    token1TotalSupply: string;

    @Column()
    update: number; // timestamp

    @ManyToOne(()=>DefiApp, defiApp=>defiApp.pairs)
    defiApp: DefiApp
}