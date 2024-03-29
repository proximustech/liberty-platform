import Router from "koa-router"

let getRouter = (viewVars:any) => {
    const router = new Router();
    router.get('/', async (ctx) => {
        try {
            return ctx.render('plugins/root/views/root', viewVars);
        } catch (error) {
            console.error(error)
        }
    })
    router.get('/login', async (ctx) => {
        try {
            return ctx.render('plugins/root/views/login', viewVars);
        } catch (error) {
            console.error(error)
        }
    })

    return router
}


export default getRouter