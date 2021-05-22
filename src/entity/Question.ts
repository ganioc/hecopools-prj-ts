import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";

@Entity()
export class Question{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;

    @Column()
    text:string;

    @ManyToMany(type=>Category, category=> category.questions, {cascade:true})
    @JoinTable()
    categories: Category[];
}