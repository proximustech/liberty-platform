import Router from "koa-router"

let viewVars ={

}
const router = new Router();

router.get('/ajax_views/middle', async (ctx) => {
    try {
        return ctx.render('plugins/ajax_views/views/middle', viewVars);
    } catch (error) {
        console.error(error)
    }
})
router.get('/ajax_views/right', async (ctx) => {
    try {
        return ctx.render('plugins/ajax_views/views/right', viewVars);
    } catch (error) {
        console.error(error)
    }
})

export default router
