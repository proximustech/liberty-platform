import Router from "koa-router"
import {Second} from "../services/second_service"

const secondService = new Second()
let viewVars ={
    second:"",
    headerFile:"../../../html/header.html",
    footerFile:"../../../html/footer.html",
}
const router = new Router();
router.get('/second_plugin', async (ctx) => {
    try {
        viewVars.second=secondService.secondMethod()
        return ctx.render('plugins/second/views/second', viewVars);
    } catch (error) {
        console.error(error)
    }
})

export default router
