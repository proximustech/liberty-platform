import Router from "koa-router"
import koaBody from "koa-body"

let data = {
    "0":"1st Record",
    "1":"2nd Record",
}

let viewVars ={
    data: {},
    id : '',
    title : ''
}
const router = new Router();


router.get('/ajax_views/content', async (ctx) => {
    try {
        viewVars.data = data
        return ctx.render('plugins/ajax_views/views/content', viewVars);
    } catch (error) {
        console.error(error)
    }
})
router.get('/ajax_views/detail', async (ctx) => {
    try {
        //@ts-ignore
        viewVars.id = ctx.request.query.id
        //@ts-ignore
        viewVars.title = data[ctx.request.query.id]
        return ctx.render('plugins/ajax_views/views/detail', viewVars);
    } catch (error) {
        console.error(error)
    }
})
router.post('/ajax_views/save', koaBody() ,async (ctx) => {
    try {
        //@ts-ignore
        data[ctx.request.body["id"]] = ctx.request.body["title"]
        viewVars.id = ctx.request.body["id"]
        viewVars.title = ctx.request.body["title"]
        return ctx.render('plugins/ajax_views/views/save', viewVars);
    } catch (error) {
        console.error(error)
    }
})

export default router
