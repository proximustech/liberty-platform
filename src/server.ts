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
    let viewVars:any = {}
    let baseLanguage = "english"
    let selectedLanguage = "spanish"
   
    app.use(async (ctx, next) => {
        try {

          viewVars.breadcrumbs = []
          //let language = ctx.session.language || "english"
          //viewVars.language = language
          //let language = ctx.request.query.language
          let baseLanguageLabels = require('./languages/'+baseLanguage+'.js')
          viewVars.language = selectedLanguage
          let languageLabels = require('./languages/'+selectedLanguage+'.js')
          viewVars.labels = {...baseLanguageLabels.labels, ...languageLabels.labels};

          routePlugins.forEach(pluginName => {
            // @ts-ignore
            getRouter = require ("./plugins/"+pluginName+"/routes/"+pluginName+"_routes")
            // @ts-ignore
            app.use(getRouter.default(viewVars).routes())
            try {
              let pluginBaseLanguageLabels = require("./plugins/"+pluginName+"/languages/"+baseLanguage+".js")
              let pluginSelectedLanguageLabels = require("./plugins/"+pluginName+"/languages/"+selectedLanguage+".js")
              let pluginLanguageLabels = {...pluginBaseLanguageLabels.labels, ...pluginSelectedLanguageLabels.labels};
              viewVars.labels = {...viewVars.labels, ...pluginLanguageLabels};
            } catch (error) {}

          });             

          await next()

        } catch(err:any) {
          console.log(err.status)
          ctx.status = err.status || 500;
          ctx.body = err.message;
        }

      });
    
      routePlugins.forEach(pluginName => {
        // @ts-ignore
        getRouter = require ("./plugins/"+pluginName+"/routes/"+pluginName+"_routes")
        // @ts-ignore
        app.use(getRouter.default(viewVars).routes())
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