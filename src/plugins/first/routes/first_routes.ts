import Router from "koa-router"
import {First} from "../services/first_service"

const firstService = new First()

const router = new Router();
router.get('/first_plugin', async (ctx) => {
    try {
        ctx.body = {
            status: 'success',
            data: firstService.firstMethod(),
        }
    } catch (error) {
        console.error(error)
    }
})

export default router
