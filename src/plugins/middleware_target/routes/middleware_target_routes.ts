import Router from "koa-router"
import { exposedMiddlewareTargets } from "../../../values/middlewares"


let getRouter = (viewVars: any) => {
    const router = new Router();
    router.get('/middleware_target', async (ctx) => {
        viewVars = {
            third: "",
            headerFile: "../../../html/header.html",
            footerFile: "../../../html/footer.html",
        }

        try {
            // @ts-ignore
            viewVars.third = exposedMiddlewareTargets["thirdService"].thirdMethod("3")
            return ctx.render('plugins/middleware_target/views/third', viewVars);
        } catch (error) {
            console.error(error)
        }
    })


    return router
}


export default getRouter

