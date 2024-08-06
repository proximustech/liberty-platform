import Router from "koa-router"
import { DynamicViews } from "../../../services/dynamic_views_service";
import { dynamicViewsDefinition } from "../values/dynamic_views"
import koaBody from "koa-body"
const passport = require('koa-passport')
//import { UserPasswordAuthenticator } from "../../../services/authenticator_user_password"

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
    /*
    router.get('/authenticate', async (ctx) => {
        try {
            let authenticator = new UserPasswordAuthenticator("","")

            return ctx.render('plugins/root/views/login', viewVars);
        } catch (error) {
            console.error(error)
        }
    })
    */

    return router
}


export default getRouter
