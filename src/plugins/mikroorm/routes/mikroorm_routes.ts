import Router from "koa-router"
import { Author, Book } from '../entities/index';
import { MikroORM,EntityManager } from '@mikro-orm/sqlite';
export let globalEntityManager : EntityManager;

let getRouter = async (viewVars: any) => {
    
    const orm = await MikroORM.init();
    globalEntityManager = orm.em
    const em:EntityManager = globalEntityManager.fork();

    const router = new Router();
    router.get('/mikroorm', async (ctx) => {

        const author = new Author('Jon Snow');
        const book = new Book("Biobraphy", author);

        // FIX: Error: write EIO — em.persist([book]).flush() returns a Promise that
        // previously had no await or catch (floating Promise). In Node >= 15, an
        // unhandled rejected Promise fires 'unhandledRejection' and crashes the process.
        // An unexpected crash interrupts any active HTTP streams, and attempting to write
        // to those now-closed sockets produces EIO in concurrent handlers.
        // Now awaited and caught locally so a database failure does not bring down the server.
        try {
            await em.persist([book]).flush();
        } catch (error) {
            console.error('mikroorm flush error:', error)
        }

        try {

            ctx.body = {
                status: 'success',
                data: await em.findAll(Book, {
                    populate: ['author'],
                    limit: 20,
                })
            }
        } catch (error) {
            console.error(error)
        }
    })


    return router
}


export default getRouter

