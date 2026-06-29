import { Context } from "koa"
import Router from "koa-router"
import { safeProps } from "../services/safe_props"

let getRouter = (appViewVars: any) => {
    let viewVars = { ...appViewVars }

    const router = new Router({ prefix: '/vuejs' })

    router.get('/', async (ctx: Context) => {
        try {
            const user = ctx.session?.passport?.user
            viewVars.safeProps = safeProps({
                screen: 'home',
                props: {
                    userName: user?.name ?? 'Guest',
                },
            })
            return ctx.render('plugins/vuejs/views/vuejs', viewVars)
        } catch (error) {
            console.error(error)
        }
    })

    router.get('/counter', async (ctx: Context) => {
        try {
            viewVars.safeProps = safeProps({
                screen: 'counter',
                props: {
                    startCount: 0,
                },
            })
            return ctx.render('plugins/vuejs/views/vuejs', viewVars)
        } catch (error) {
            console.error(error)
        }
    })

    return router
}

export default getRouter
