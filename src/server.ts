import Koa from "koa"
const render = require("@koa/ejs");
import testRoutes from "./routes/test_route"
import firstRoutes from "./plugins/first/routes/first_route"
import secondRoutes from "./plugins/second/routes/second_route"

const app = new Koa()

app.use(testRoutes.routes())
app.use(firstRoutes.routes())
app.use(secondRoutes.routes())

render(app, {
    root: __dirname,
    //layout: 'html/layout',
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
});

const server = app
    .listen(8000, async () => {
        console.log(`Server listening on port: 8000`)
    })
    .on("error", err => {
        console.error(err)
    })

export default server