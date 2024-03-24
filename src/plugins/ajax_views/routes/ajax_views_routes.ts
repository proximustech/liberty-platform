import Router from "koa-router"
import koaBody from "koa-body"

let data = {
    "0":"1st Record",
    "1":"2nd Record",
    "2":"2nd Record",
    "3":"3nd Record",
    "4":"4nd Record",
    "5":"5nd Record",
    "6":"6nd Record",
    "7":"7nd Record",
    "8":"8nd Record",
    "9":"1st Record",
    "10":"2nd Record",
    "12":"2nd Record",
    "13":"3nd Record",
    "14":"4nd Record",
    "15":"5nd Record",
    "16":"6nd Record",
    "17":"7nd Record",
    "18":"8nd Record",
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
