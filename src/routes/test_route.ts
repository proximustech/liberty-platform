import Router from "koa-router"
import {Test} from "../services/test_service"
import {TestDependence} from "../services/test_dependence_service"

const testDependenceService = new TestDependence()
const testService = new Test(testDependenceService)

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
