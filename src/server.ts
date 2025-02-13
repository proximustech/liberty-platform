import Koa from "koa"
import { Context } from "koa";
const render = require("@koa/ejs");
const path = require('path');
const mount = require('koa-mount')
const serve = require('koa-static')
const session = require('koa-session');
const passport = require('koa-passport');
const pino = require('koa-pino-logger')()
import testRoutes from "./routes/test_route"
import {routePlugins} from "./values/route_plugins"
import { EventEmitter } from "node:events";

import {AuthorizerCasbinMongo as AuthorizerCasbin} from "./services/authorizer_casbin_mongo";

//import { MikroORM,RequestContext,EntityManager } from '@mikro-orm/sqlite';
//export let globalEntityManager : EntityManager
export let eventEmitter : EventEmitter

(async () => {

  const authorizer: AuthorizerCasbin = new AuthorizerCasbin()
  await authorizer.initialize()

  eventEmitter = new EventEmitter()
  //const orm = await MikroORM.init();

  //globalEntityManager = orm.em
  const app = new Koa()
  app.use(pino)
  
  let getRouter={}
  let appViewVars:any = {}
  let baseLanguage = "english"
  let selectedLanguage = "english"

  //app.use(koaBody())

  app.keys = ['lkaweob923jkpselld34k'];
  app.use(session(app))
  
  require('./auth/local_auth')
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(async (ctx:Context, next) => {
      try {

        ctx.authorizer = authorizer

        /*
        routePlugins.forEach(pluginName => {
          try {
            let pluginBaseLanguageLabels = require("./plugins/"+pluginName+"/languages/"+baseLanguage+".js")
            try{
              let pluginSelectedLanguageLabels = require("./plugins/"+pluginName+"/languages/"+selectedLanguage+".js")
              let pluginLanguageLabels = {...pluginBaseLanguageLabels.labels, ...pluginSelectedLanguageLabels.labels};
              appViewVars.labels = {...appViewVars.labels, ...pluginLanguageLabels};
            }catch(error){
              appViewVars.labels = {...appViewVars.labels, ...pluginBaseLanguageLabels.labels};
            }
          } catch (error) {}   
          // @ts-ignore
          //getRouter = require ("./plugins/"+pluginName+"/routes/"+pluginName+"_routes")                 
          // @ts-ignore
          //app.use(getRouter.default(appViewVars).routes())

        });
        */             

        await next()

      } catch(err:any) {
        console.log(err.status)
        ctx.status = err.status || 500;
        ctx.body = err.message;
      }

  });
  
  appViewVars.breadcrumbs = []
  //let language = ctx.session.language || "english"
  //viewVars.language = language
  //let language = ctx.request.query.language
  let baseLanguageLabels = require('./languages/'+baseLanguage+'.js')
  appViewVars.language = selectedLanguage
  let languageLabels = require('./languages/'+selectedLanguage+'.js')
  appViewVars.labels = {...baseLanguageLabels.labels, ...languageLabels.labels};


  routePlugins.forEach(pluginName => {

    try {
      let pluginBaseLanguageLabels = require("./plugins/"+pluginName+"/languages/"+baseLanguage+".js")
      try{
        let pluginSelectedLanguageLabels = require("./plugins/"+pluginName+"/languages/"+selectedLanguage+".js")
        let pluginLanguageLabels = {...pluginBaseLanguageLabels.labels, ...pluginSelectedLanguageLabels.labels};
        appViewVars.labels = {...appViewVars.labels, ...pluginLanguageLabels};
      }catch(error){
        appViewVars.labels = {...appViewVars.labels, ...pluginBaseLanguageLabels.labels};
      }
    } catch (error) {} 

    // @ts-ignore
    getRouter = require ("./plugins/"+pluginName+"/routes/"+pluginName+"_routes")
    // @ts-ignore
    app.use(getRouter.default(appViewVars).routes())
  });  

  app.use(testRoutes.routes())
  //app.use((ctx, next) => RequestContext.create(orm.em, next));
  
  app.use(mount('/static',serve(path.join(__dirname, '/static'))))
  
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
