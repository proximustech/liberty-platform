import Router from "koa-router"
import {exposedMiddlewareTargets} from "../../../values/middlewares"

let viewVars ={
    third:"",
    headerFile:"../../../html/header.html",
    footerFile:"../../../html/footer.html",
}
const router = new Router();
router.get('/middleware_target', async (ctx) => {
    try {
        // @ts-ignore
        viewVars.third=exposedMiddlewareTargets["thirdService"].thirdMethod("3")
        return ctx.render('plugins/middleware_target/views/third', viewVars);
    } catch (error) {
        console.error(error)
    }
})

export default router
