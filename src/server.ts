import Koa from "koa"
import testRoutes from "./routes/test"

const app = new Koa()

app.use(testRoutes.routes())

const server = app
    .listen(8000, async () => {
        console.log(`Server listening on port: 8000`)
    })
    .on("error", err => {
        console.error(err)
    })

export default server
