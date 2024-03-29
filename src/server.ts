import Koa from "koa"
const render = require("@koa/ejs");
import testRoutes from "./routes/test_route"
import {routePlugins} from "./values/route_plugins"
import { EventEmitter } from "node:events";

import { MikroORM,RequestContext,EntityManager } from '@mikro-orm/sqlite';
export let globalEntityManager : EntityManager
export let eventEmitter : EventEmitter

(async () => {

    eventEmitter = new EventEmitter()
    const orm = await MikroORM.init();

    globalEntityManager = orm.em
    const app = new Koa()
    
    let getRouter={}
    routePlugins.forEach(pluginName => {
        // @ts-ignore
        getRouter = require ("./plugins/"+pluginName+"/routes/"+pluginName+"_routes")
        // @ts-ignore
        app.use(getRouter.default().routes())
    });
    /*
    app.use(async (ctx, next) => {
        try {
          viewVars.breadcrumbs = []
          let language = ctx.session.language || "english"
          viewVars.language = language
          let languageLabels = require('./languages/'+language+'.js')
          viewVars.labels = languageLabels.labels
          await next()
        } catch(err) {
          console.log(err.status)
          ctx.status = err.status || 500;
          ctx.body = err.message;
        }
      });   
      */ 
    
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