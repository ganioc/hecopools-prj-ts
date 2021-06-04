import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Price } from "./Price";


@Entity({name: 'price-anchor'})
export class Anchor{
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    poolName: string;

    @Index()
    @Column()
    token0Symbol: string; // symbol

    @Index()
    @Column()
    token1Symbol: string;

    @OneToMany(() => Price, price => price.anchor, { cascade: true })
    prices: Price[]

}