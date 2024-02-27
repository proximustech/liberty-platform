import Router from "koa-router"

let viewVars ={

}
const router = new Router();
router.get('/', async (ctx) => {
    try {
        return ctx.render('plugins/root/views/root', viewVars);
    } catch (error) {
        console.error(error)
    }
})

export default router
