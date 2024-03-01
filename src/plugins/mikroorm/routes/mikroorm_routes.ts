import Router from "koa-router"
import { Author,Book } from '../entities/index';
import { globalEntityManager } from "../../../server";

const em = globalEntityManager.fork();

const router = new Router();
router.get('/mikroorm', async (ctx) => {

    const author = new Author('Jon Snow');
    const book = new Book("Biobraphy",author);
    em.persist([book]).flush()

    try {

        ctx.body = {
            status: 'success',
            data: await em.findAll(Book,{
                populate: ['author'],
                limit: 20,                
            })
        }
    } catch (error) {
        console.error(error)
    }
})

export default router
