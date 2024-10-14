import Router from "koa-router"

let getRouter = (viewVars: any) => {
    const prefix = 'users_control'
    let router = new Router({prefix: '/'+ prefix});
    viewVars.prefix = prefix

    router = require("./user_routes.ts")(router,viewVars,prefix)
    router = require("./role_routes.ts")(router,viewVars,prefix)

    return router
}

export default getRouter