import Router from "koa-router"
import { Second } from "../services/second_service"

const secondService = new Second()

let getRouter = (viewVars: any) => {

    viewVars = {
        second: "",
        headerFile: "../../../html/header.html",
        footerFile: "../../../html/footer.html",
    }

    const router = new Router();
    router.get('/basic_html', async (ctx) => {
        try {
            viewVars.second = secondService.secondMethod()
            return ctx.render('plugins/basic_html/views/second', viewVars);
        } catch (error) {
            console.error(error)
        }
    })


    return router
}


export default getRouter

