import Router from "koa-router"
import {dynamicViewsDefinition} from "../../../values/dynamic_views"
import {Third} from "../services/third_service"

const thirdService = new Third()


let viewVars ={
    pluginData:"",
    third:"",
    headerFile:"../../../html/header.html",
    footerFile:"../../../html/footer.html",
}
const router = new Router();
router.get('/dynamic_view_target', async (ctx) => {
    try {
        viewVars.third=thirdService.thirdMethod("3")
        if ("dynamic_view_target" in dynamicViewsDefinition) {
            if ("third" in dynamicViewsDefinition["dynamic_view_target"]) {
                // @ts-ignore
                for (let index = 0; index < dynamicViewsDefinition["dynamic_view_target"]["third"].length; index++) {
                    // @ts-ignore
                    viewVars.pluginData=await dynamicViewsDefinition["dynamic_view_target"]["third"][index].getPluginData(ctx,viewVars) 
                    
                }
            }            
        }
        return ctx.render('plugins/dynamic_view_target/views/third', viewVars);
    } catch (error) {
        console.error(error)
    }
})

export default router
