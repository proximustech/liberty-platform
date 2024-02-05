import 'reflect-metadata'
import { container } from "tsyringe";
import Router from "koa-router"
import {Test} from "../services/test_service"

const testService = container.resolve(Test)

const router = new Router();
router.get('/test', async (ctx) => {
    try {
        ctx.body = {
            status: 'success',
            data: testService.testMethod(),
        }
    } catch (error) {
        console.error(error)
    }
})

export default router
