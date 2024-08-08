import Router from "koa-router"
import { DynamicViews } from "../../../services/dynamic_views_service";
import { dynamicViewsDefinition } from "../values/dynamic_views"
const passport = require('koa-passport')

let getRouter = (viewVars: any) => {
    const router = new Router();
    viewVars.modulesContent = "--"
    router.get('/', async (ctx) => {
        try {

            // @ts-ignore
            if (ctx.isAuthenticated()) {
                await DynamicViews.addViewVarContent(dynamicViewsDefinition,"root","modulesContent",viewVars,ctx)
                return ctx.render('plugins/root/views/root', viewVars);
            }
            else
            {
                return ctx.render('plugins/root/views/login', viewVars);
            }

        } catch (error) {
            console.error(error)
        }
    })

    router.post('/login', async (ctx) => {
        // @ts-ignore
        return passport.authenticate('local', (err, user, info, status) => {
            if (user) {
              // @ts-ignore
              ctx.login(user);
              ctx.redirect('/');
            } else {
              ctx.status = 400;
              ctx.body = { status: 'error' };
            }
          })(ctx);
    })

    router.get('/login', async (ctx) => {
        try {
            return ctx.render('plugins/root/views/login', viewVars);
        } catch (error) {
            console.error(error)
        }
    })

    router.get('/logout', async (ctx) => {
        // @ts-ignore
        if (ctx.isAuthenticated()) {
            // @ts-ignore
            ctx.logout();
            ctx.redirect('/login');
          } else {
            ctx.body = { success: false };
            ctx.throw(401);
          }
    })

    return router
}


export default getRouter
