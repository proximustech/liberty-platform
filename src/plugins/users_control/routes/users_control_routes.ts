import Router from "koa-router"

let getRouter = (appViewVars: any) => {
    const prefix = 'users_control'
    let router = new Router({prefix: '/'+ prefix});

    router = require("./user_routes.ts")(router,appViewVars,prefix)
    router = require("./role_routes.ts")(router,appViewVars,prefix)
    router = require("./api_v1_routes.ts")(router,appViewVars,prefix)

    return router
}

export default getRouter