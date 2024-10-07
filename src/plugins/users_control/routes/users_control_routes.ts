import Router from "koa-router"
import { Context } from "koa";
import { UserService } from "../services/UserService";
import { UserDataObject,UserDataObjectSpecs,UserDataObjectValidator } from "../dataObjects/UserDataObject";

let getRouter = (viewVars: any) => {
    const prefix = 'users_control'
    let router = new Router({prefix: '/'+ prefix});
    viewVars.prefix = prefix

    router.get('/users', async (ctx:Context) => {
        try {
            const userService = new UserService()
            viewVars.users = await userService.getAll()            
            return ctx.render('plugins/users_control/views/users', viewVars);
        } catch (error) {
            console.error(error)
        }
    })

    router.get('/user_form', async (ctx:Context) => {
        try {

            let uuid:any = ctx.request.query.uuid || ""
            let User:UserDataObject = new UserDataObject()
            let userService = new UserService()

            if (uuid !=="") {
                User = await userService.getByUuId(uuid) 
                viewVars.editing = true
                
            }
            else {
                viewVars.editing = false
            }

            viewVars.user = User
            viewVars.userMetadata = UserDataObjectSpecs.metadata
            viewVars.userFieldRender = UserDataObjectSpecs.htmlDataObjectFieldRender
            viewVars.userValidateSchema = UserDataObjectValidator.validateSchema
            viewVars.userValidateFunction = "app.module_data.user_form.userValidateFunction=" + UserDataObjectValidator.validateFunction

            return ctx.render('plugins/'+prefix+'/views/user_form', viewVars);
        } catch (error) {
            console.error(error)
        }
    })    

    return router
}

export default getRouter