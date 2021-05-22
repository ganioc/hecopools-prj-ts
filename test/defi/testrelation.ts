import { Connection, createConnection } from "typeorm";
import { Category} from "../../src/entity/Category"
import { Question} from '../../src/entity/Question'

async function toCreate(connection: Connection ) {
    const category1 = new Category();
    category1.name = 'animals';

    const category2 = new Category();
    category2.name = 'zoo';

    const question = new Question();
    question.title = '1st animal'
    question.text = 'Who are you?'
    question.categories = [category1, category2];
    await connection.manager.save(question)
}
async function toRead(connection: Connection){
    const cateRepos = connection.getRepository(Category)

    let result = await    cateRepos.findAndCount();
    console.log(result)
    
    const quesRepos = connection.getRepository(Question)
    let questions = await quesRepos.findAndCount()
    console.log(questions)
}

async function main(){
    const connection = await createConnection(); 

    toRead(connection)
}

main()