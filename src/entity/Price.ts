import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'price'})
export class Price{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: number;

    @Column("varchar", { length: 100 })
    name: string;

    @Column()
    timestamp: number;
}

