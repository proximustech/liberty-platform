import Router from "koa-router"

const router = new Router();
router.get('/test', async (ctx) => {
    try {
        ctx.body = {
            status: 'success',
            data: 'OK',
        }
    } catch (error) {
        console.error(error)
    }
})

export default router
