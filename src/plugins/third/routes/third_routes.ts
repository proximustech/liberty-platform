import Router from "koa-router"
import {Third} from "../services/third_service"
import {ThirdMiddleware_1} from "../services/third_service_middleware_1"
import {ThirdMiddleware_2} from "../services/third_service_middleware_2"
// @ts-ignore
import {MiddlewareManager} from 'js-middleware';

const thirdService = new Third()
const middlewareManager = new MiddlewareManager(thirdService);
middlewareManager.use(new ThirdMiddleware_1())
middlewareManager.use(new ThirdMiddleware_2())

let viewVars ={
    third:"",
    headerFile:"../../../html/header.html",
    footerFile:"../../../html/footer.html",
}
const router = new Router();
router.get('/third_plugin', async (ctx) => {
    try {
        viewVars.third=thirdService.thirdMethod("3")
        return ctx.render('plugins/third/views/third', viewVars);
    } catch (error) {
        console.error(error)
    }
})

export default router
