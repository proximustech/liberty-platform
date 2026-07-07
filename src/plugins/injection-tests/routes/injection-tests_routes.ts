import 'reflect-metadata'
import { Context } from "koa";
import { container } from "tsyringe";
import Router from "koa-router"
import { Test } from "../services/injection_service"

const testService = container.resolve(Test)

let getRouter = (appViewVars: any) => {
    const router = new Router();

    router.get('/injection-tests', async (ctx: Context) => {
        try {
            ctx.body = {
                status: 'success',
                data: testService.testMethod(),
            }
        } catch (error) {
            console.error(error)
        }
    })

    return router
}

export default getRouter
