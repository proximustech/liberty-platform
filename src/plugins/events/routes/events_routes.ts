import Router from "koa-router"
import { events_events } from "../values/events_list"
import { eventEmitter } from "../../../server";

eventEmitter.on(events_events.events_my_event, (viewVars) => {
    viewVars.event_text = viewVars.event_text + " Basic"
})


let getRouter = (viewVars: any) => {
    viewVars = {
        event_text: "",
        headerFile: "../../../html/header.html",
        footerFile: "../../../html/footer.html",
    }
    const router = new Router();
    router.get('/event_emmit', async (ctx) => {


        try {
            eventEmitter.emit(events_events.events_my_event, viewVars)
            return ctx.render('plugins/events/views/event', viewVars);
        } catch (error) {
            console.error(error)
        }
    })

    router.get('/event_on', async (ctx) => {
        eventEmitter.on(events_events.events_my_event, (viewVars) => {
            viewVars.event_text = viewVars.event_text + " Iterated"
        })
        try {
            return ctx.render('plugins/events/views/event', viewVars);
        } catch (error) {
            console.error(error)
        }
    })


    return router
}


export default getRouter

