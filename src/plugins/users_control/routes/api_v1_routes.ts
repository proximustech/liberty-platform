import Router from "koa-router"
import { Context } from "koa";
import { GlobalServices } from "../../../services/global_services";

import koaBody from 'koa-body';

const passport = require('koa-passport')

module.exports = function(router:Router,appViewVars:any,prefix:string){

    let apiPrefix = "/api/v1"

    let logger = GlobalServices.logger

    router.get(apiPrefix+'/oidc_callback',koaBody(), async (ctx:Context) => {

        try {

            return passport.authenticate('openidconnect', { failureRedirect: '/login', failureMessage: true }, (err:any, user:any, info:any, status:any) => {
                if (user) {
                    ctx.login(user);
                    ctx.redirect('/');
                } else {
                    ctx.redirect('/login'+"?event=invalid_credentials");
                }
              })(ctx)  
                    
        } catch (error) {

            logger.error(error)

        } 

    })

    return router
}