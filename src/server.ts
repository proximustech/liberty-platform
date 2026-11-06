import Koa from "koa"
import { Context } from "koa";
const render = require("@koa/ejs");
const path = require('path');
const mount = require('koa-mount')
const serve = require('koa-static')
const session = require('koa-session');
const passport = require('koa-passport');
//const pino = require('koa-pino-logger')()
import { LoggerServiceFactory } from "./factories/LoggerServiceFactory";
import {routePlugins} from "./values/route_plugins"
import { Config } from "./values/config";

import {AuthorizerCasbinMongo as AuthorizerCasbin} from "./services/authorizer_casbin_mongo";
import { ExceptionSessionInvalid } from "./types/exceptions";

import { GlobalServices } from "./services/global_services";

//import { MikroORM,RequestContext,EntityManager } from '@mikro-orm/sqlite';
//export let globalEntityManager : EntityManager

(async () => {

  const authorizer: AuthorizerCasbin = new AuthorizerCasbin()
  await authorizer.initialize()
  GlobalServices.casbinAuthorizer = authorizer
  let logger = LoggerServiceFactory.create()
  GlobalServices.logger = logger

  //const orm = await MikroORM.init();

  //globalEntityManager = orm.em
  const app = new Koa()
  //app.use(pino)
  
  let getRouter={}
  let appViewVars:any = {}
  let baseLanguage = "english"
  let selectedLanguage = "english"

  //app.use(koaBody())

  app.keys = [Config.APP_KEYS];
  app.use(session(app))
  
  require('./auth/local_auth')
  require('./auth/oidc_auth')
  
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

      } catch(error:any) {

        if (error instanceof ExceptionSessionInvalid) {
          try {
            ctx.logout()
          } catch (error) {}
          ctx.body = "app.event.logged_out"        
        }
        else {
          logger.error(error)
          ctx.status = error.status || 500;
          ctx.body = "Generic Server Error.";          
        }       

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
  
  // FIX: Error: write EIO — Koa distinguishes two error surfaces:
  //   - server.on('error'): net.Server errors (port in use, etc.)
  //   - app.on('error'):    HTTP context errors (client socket closed,
  //                         failed render, koa-static writing to a client
  //                         that aborted the download, etc.)
  // Without app.on('error'), Koa falls back to its default onerror which calls
  // console.error(). If stdout is already compromised at that point, that
  // console.error() triggers a cascading EIO. With this listener, EIO/EPIPE/
  // ECONNRESET/ECONNABORTED are silently discarded (normal network behaviour);
  // everything else is logged.
  app.on('error', (err: any, ctx: any) => {
      if (['EIO', 'EPIPE', 'ECONNRESET', 'ECONNABORTED'].includes(err.code)) return
      logger.error({ err, url: ctx?.url }, 'app error')
  })

  // FIX: Error: write EIO — last line of defence for I/O errors that escape the
  // handlers above (e.g. pino stream errors before the listener in PinoLogger.create()
  // is attached, or errors thrown by third-party modules).
  // EIO/EPIPE/ECONNRESET are ignored; any other unexpected error is logged
  // without re-throwing, to keep the process alive.
  process.on('uncaughtException', (err: any) => {
      if (['EIO', 'EPIPE', 'ECONNRESET'].includes(err.code)) return
      logger.error(err, 'uncaughtException')
  })

  // FIX: Error: write EIO — unhandled rejected Promises (e.g. em.persist().flush()
  // without await) crash the process in Node >= 15, interrupting active streams and
  // potentially causing EIO in concurrent handlers. This handler catches and logs them.
  process.on('unhandledRejection', (reason: any) => {
      logger.error(reason, 'unhandledRejection')
  })

  const server = app
      .listen(8000, async () => {
          console.log(`Server listening on port: 8000`)
      })
      .on("error", err => {
          console.error(err)
      })
            
})();
