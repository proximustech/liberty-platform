import Router from "koa-router"
import { events_events } from "../values/events_list"
import { EventEmitter } from "node:events";

//TODO: use EventEmitter in GlobalServices
export let eventEmitter : EventEmitter = new EventEmitter()

// FIX: Error: write EIO — without an 'error' listener on the EventEmitter, any
// synchronous exception thrown inside a registered listener propagates unhandled to
// the emit() caller. If nothing catches it, Node converts it to an uncaughtException,
// which can interrupt active streams and produce EIO in other handlers.
eventEmitter.on('error', (err: any) => {
    if (!['EIO', 'EPIPE', 'ECONNRESET'].includes(err?.code)) throw err
})

// FIX: Error: write EIO — all listeners are registered here, once at module load time.
// Before, the "Iterated" listener was registered inside the GET /event_on handler,
// adding a new permanent listener on every request. After 10 requests Node emitted a
// MaxListenersExceededWarning to stderr; if stderr was closed at that moment, writing
// the warning threw EIO. It was also a memory leak: listeners accumulated indefinitely.
eventEmitter.on(events_events.events_my_event, (viewVars: any) => {
    viewVars.event_text = viewVars.event_text + " Basic"
})

eventEmitter.on(events_events.events_my_event, (viewVars: any) => {
    viewVars.event_text = viewVars.event_text + " Iterated"
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
        // The "Iterated" listener is already registered globally at module load time.
        // Only emit the event and render here; no listeners are registered per request.
        try {
            eventEmitter.emit(events_events.events_my_event, viewVars)
            return ctx.render('plugins/events/views/event', viewVars);
        } catch (error) {
            console.error(error)
        }
    })


    return router
}


export default getRouter

