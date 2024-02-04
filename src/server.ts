import Koa from "koa"
import testRoutes from "./routes/test_route"
import firstRoutes from "./plugins/first/routes/first_route"

const app = new Koa()

app.use(testRoutes.routes())
app.use(firstRoutes.routes())

const server = app
    .listen(8000, async () => {
        console.log(`Server listening on port: 8000`)
    })
    .on("error", err => {
        console.error(err)
    })

export default server
