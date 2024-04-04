import Router from "koa-router"
import { DynamicViews } from "../../../services/dynamic_views_service";

let getRouter = (viewVars: any) => {
    const router = new Router();
    viewVars.modulesContent = "--"
    router.get('/', async (ctx) => {
        try {
            await DynamicViews.addViewVarContent("root","modulesContent",viewVars,ctx)
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
