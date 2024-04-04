import Router from "koa-router"
import { DynamicViews } from "../../../services/dynamic_views_service";
import { Third } from "../services/third_service"

const thirdService = new Third()

let getRouter = (viewVars: any) => {

    viewVars = {
        pluginData: "",
        third: "",
        headerFile: "../../../html/header.html",
        footerFile: "../../../html/footer.html",
    }

    const router = new Router();
    router.get('/dynamic_view_target', async (ctx) => {
        viewVars.third = thirdService.thirdMethod("3")
        await DynamicViews.addViewVarContent("dynamic_view_target","pluginData",viewVars,ctx)
        return ctx.render('plugins/dynamic_view_target/views/third', viewVars);
    })

    return router
}


export default getRouter

