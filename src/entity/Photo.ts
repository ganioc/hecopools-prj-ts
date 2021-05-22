import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
    })
    url: string;

    @ManyToOne(()=>User, user => user.photos)
    user: User;
}