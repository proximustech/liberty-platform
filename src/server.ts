import Koa from "koa"
const render = require("@koa/ejs");
import testRoutes from "./routes/test_route"
import {routePlugins} from "./values/routePlugins"

import { MikroORM,RequestContext,EntityManager } from '@mikro-orm/sqlite';
export let globalEntityManager : EntityManager

(async () => {

    const orm = await MikroORM.init();

    globalEntityManager = orm.em
    const app = new Koa()
    
    let routePlugin={}
    routePlugins.forEach(pluginName => {
        routePlugin = require ("./plugins/"+pluginName+"/routes/"+pluginName+"_routes")
        // @ts-ignore
        app.use(routePlugin.default.routes())
    });
    
    app.use(testRoutes.routes())
    app.use((ctx, next) => RequestContext.create(orm.em, next));
    
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
            
})();