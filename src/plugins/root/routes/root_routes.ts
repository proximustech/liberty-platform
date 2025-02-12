import { Context } from "koa";
import Router from "koa-router"
import koaBody from "koa-body"
import { DynamicViews } from "../../../services/dynamic_views_service";
import { dynamicViewsDefinition } from "../values/dynamic_views"
import { passportAuthExports } from "../../../auth/local_auth"

const passport = require('koa-passport')

let getRouter = (appViewVars: any) => {
    let viewVars = {...appViewVars}
    const router = new Router();
    router.get('/', async (ctx:Context) => {
        try {
            if (ctx.isAuthenticated()) {
                viewVars.modulesContent = ""
                await DynamicViews.addViewVarContent(dynamicViewsDefinition,"root","modulesContent",viewVars,ctx)
                viewVars.user = ctx.session.passport.user
                return ctx.render('plugins/root/views/root', viewVars);
            }
            else
            {
                ctx.redirect(passportAuthExports.loginUrl);
            }

        } catch (error) {
            console.error(error)
        }
    })

    router.post('/login',koaBody(), async (ctx:Context) => {
        return passport.authenticate('local', (err:any, user:any, info:any, status:any) => {
            if (user) {
                ctx.login(user);
                ctx.redirect('/');
            } else {
                ctx.redirect(passportAuthExports.loginUrl);
            }
          })(ctx);
    })

    router.get(passportAuthExports.loginUrl, async (ctx:Context) => {
        try {
            if (ctx.isAuthenticated()) {
                viewVars.modulesContent = ""
                await DynamicViews.addViewVarContent(dynamicViewsDefinition,"root","modulesContent",viewVars,ctx)
                viewVars.user = ctx.session.passport.user                
                return ctx.render('plugins/root/views/root', viewVars);
            }
            else {
                return ctx.render('plugins/root/views/login', viewVars);
            }
        } catch (error) {
            console.error(error)
        }
    })

    router.get('/logout', async (ctx) => {
        if (ctx.isAuthenticated()) {
            ctx.logout();
        }
        ctx.redirect(passportAuthExports.loginUrl);
    })

    return router
}

export default getRouter
