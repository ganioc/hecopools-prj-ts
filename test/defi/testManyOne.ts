import { Connection, createConnection } from "typeorm";
import { Photo } from "../../src/entity/Photo";
import { User } from "../../src/entity/User";

async function toCreate(connection:Connection){
    const user = new User();
    user.name = 'Leo'
    await connection.manager.save(user)

    const photo1 = new Photo()
    photo1.url = 'me.jpeg'
    photo1.user = user;
    await connection.manager.save(photo1)

    const photo2 = new Photo()
    photo2.url = 'bears.jpge'
    photo2.user = user;
    await connection.manager.save(photo2)
}
async function toRead(connection:Connection){
    const photoRepos = connection.getRepository(Photo)
    const userRepos = connection.getRepository(User);

    let photos = await photoRepos.findAndCount();
    console.log(photos)

    let users = await userRepos.findAndCount();
    console.log(users)

    console.log('\ntest relation')
    const usersNew = await userRepos.find({
        relations:["photos"]
    })
    console.log(usersNew)
    for(let us of usersNew){
        console.log(us.photos)
    }
    console.log('')

    let photosNew = await photoRepos.find({
        relations: ["user"]
    })
    console.log(photosNew)
    for(let pho of photosNew){
        console.log(pho.user)
    }

    console.log('\nUse QueryBuilder')
    const usersQ = await connection
        .getRepository(User)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.photos', 'photo')
        .getMany();
    console.log(usersQ)
    console.log(usersQ[0])

    const photosQ = await connection
        .getRepository(Photo)
        .createQueryBuilder('photo')
        .leftJoinAndSelect('photo.user', 'user')
        .getMany();
    console.log(photosQ);
    console.log(photosQ[0])
    console.log(photosQ[1])

}
async function main(){
    const connection = await createConnection(); 

    // toCreate(connection)
    toRead(connection)
}

main()