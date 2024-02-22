import Router from "koa-router"
import {Third} from "../services/third_service"

const thirdService = new Third()


let viewVars ={
    pluginData:"",
    third:"",
    headerFile:"../../../html/header.html",
    footerFile:"../../../html/footer.html",
}
const router = new Router();
router.get('/dynamic_view', async (ctx) => {
    try {
        viewVars.third=thirdService.thirdMethod("3")
        viewVars.pluginData=await thirdService.getPluginData(ctx,viewVars)
        return ctx.render('plugins/dynamic_view/views/third', viewVars);
    } catch (error) {
        console.error(error)
    }
})

export default router
