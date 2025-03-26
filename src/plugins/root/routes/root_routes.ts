import { Context } from "koa";
import Router from "koa-router"
import koaBody from "koa-body"
import { DynamicViews } from "../../../services/dynamic_views_service";
import { dynamicViewsDefinition } from "../values/dynamic_views"

const passport = require('koa-passport')

let getRouter = (appViewVars: any) => {
    let viewVars = {...appViewVars}
    const router = new Router();

    let loginRoute = "/login"

    router.get('/', async (ctx:Context) => {
        try {
            if (ctx.isAuthenticated()) {
                viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
                viewVars.modulesContent = ""
                await DynamicViews.addViewVarContent(dynamicViewsDefinition,"root","modulesContent",viewVars,ctx)
                viewVars.user = ctx.session.passport.user
                return ctx.render('plugins/root/views/root', viewVars);
            }
            else
            {
                ctx.redirect(loginRoute);
            }

        } catch (error) {
            console.error(error)
        }
    })

    router.post('/local-login',koaBody(), async (ctx:Context) => {
        return passport.authenticate('local', (err:any, user:any, info:any, status:any) => {
            if (user) {
                ctx.login(user);
                ctx.redirect('/');
            } else {
                ctx.redirect(loginRoute+"?event=invalid_credentials");
            }
          })(ctx);
    })

    router.get(loginRoute, async (ctx:Context) => {
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

    router.get('/oidc-login', async (ctx:Context) => {
        return passport.authenticate('openidconnect')(ctx)
    })

    router.get('/logout', async (ctx) => {
        if (ctx.isAuthenticated()) {
            ctx.logout();
        }
        ctx.redirect(loginRoute);
    })

    return router
}

export default getRouter
