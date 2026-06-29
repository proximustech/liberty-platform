import { Context } from "koa"
import Router from "koa-router"
import { safeProps } from "../services/safe_props"

const mountId = () => 'rr' + Math.random().toString(36).slice(2, 9)

let getRouter = (appViewVars: any) => {
    let viewVars = { ...appViewVars }

    const router = new Router({ prefix: '/reactjs' });

    router.get('/', async (ctx: Context) => {
        try {
            const user = ctx.session?.passport?.user
            const id = mountId()
            viewVars.mountId = id
            viewVars.safeProps = safeProps({
                screen: 'home',
                props: { userName: user?.name ?? 'Guest' },
                _mountId: id,
            })
            return ctx.render('plugins/reactjs/views/reactjs', viewVars)
        } catch (error) {
            console.error(error)
        }
    })

    router.get('/counter', async (ctx: Context) => {
        try {
            const id = mountId()
            viewVars.mountId = id
            viewVars.safeProps = safeProps({
                screen: 'counter',
                props: { startCount: 0 },
                _mountId: id,
            })
            return ctx.render('plugins/reactjs/views/reactjs', viewVars)
        } catch (error) {
            console.error(error)
        }
    })

    router.get('/dashboard', async (ctx: Context) => {
        try {
            const id = mountId()
            const chartId = mountId()
            viewVars.mountId = id
            viewVars.safeProps = safeProps({
                screen: 'dashboard',
                props: {
                    chartId,
                    chartData: [
                        { category: 'Flags Active',   value: 42 },
                        { category: 'Flags Inactive', value: 18 },
                        { category: 'Buckets',        value: 31 },
                        { category: 'Contexts',       value: 9  },
                    ],
                },
                _mountId: id,
            })
            return ctx.render('plugins/reactjs/views/reactjs', viewVars)
        } catch (error) {
            console.error(error)
        }
    })

    return router
}

export default getRouter
