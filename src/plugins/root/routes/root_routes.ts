import Router from "koa-router"
import { DynamicViews } from "../../../services/dynamic_views_service";
import { dynamicViewsDefinition } from "../values/dynamic_views"
import { passportAuthExports } from "../../../auth/local_auth"

const passport = require('koa-passport')

let getRouter = (viewVars: any) => {
    const router = new Router();
    viewVars.modulesContent = "--"
    router.get('/', async (ctx) => {
        try {
            if (ctx.isAuthenticated()) {
                await DynamicViews.addViewVarContent(dynamicViewsDefinition,"root","modulesContent",viewVars,ctx)
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

    router.post('/login', async (ctx) => {
        return passport.authenticate('local', (err:any, user:any, info:any, status:any) => {
            if (user) {
                ctx.login(user);
                ctx.redirect('/');
            } else {
                ctx.redirect(passportAuthExports.loginUrl);
            }
          })(ctx);
    })

    router.get(passportAuthExports.loginUrl, async (ctx) => {
        try {
            if (ctx.isAuthenticated()) {
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
