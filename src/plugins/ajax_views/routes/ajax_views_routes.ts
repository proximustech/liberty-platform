import Router from "koa-router"

let viewVars ={

}
const router = new Router();

router.get('/ajax_views/content', async (ctx) => {
    try {
        return ctx.render('plugins/ajax_views/views/content', viewVars);
    } catch (error) {
        console.error(error)
    }
})
router.get('/ajax_views/detail', async (ctx) => {
    try {
        return ctx.render('plugins/ajax_views/views/detail', viewVars);
    } catch (error) {
        console.error(error)
    }
})

export default router
