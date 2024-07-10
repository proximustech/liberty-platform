import Router from "koa-router"

let getRouter = (viewVars: any) => {

    viewVars = {
        //second: "",
    }

    const router = new Router();
    router.get('/reactjs', async (ctx) => {
        try {
            return ctx.render('plugins/reactjs/views/reactjs', viewVars);
        } catch (error) {
            console.error(error)
        }
    })


    return router
}


export default getRouter

