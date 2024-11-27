import { Context } from "koa";
import Router from "koa-router"
import { UserService } from "../services/UserService";
import { RoleService } from "../services/RoleService";
import { UserDataObject,UserDataObjectSpecs,UserDataObjectValidator, passwordMask } from "../dataObjects/UserDataObject";

import koaBody from 'koa-body';

module.exports = function(router:Router,viewVars:any,prefix:string){


    router.get('/users', async (ctx:Context) => {
        viewVars.prefix = prefix
        try {
            const userService = new UserService()
            viewVars.users = await userService.getAll()            
            return ctx.render('plugins/users_control/views/users', viewVars);
        } catch (error) {
            console.error(error)
        }
    })

    router.get('/account_settings', async (ctx:Context) => {
        viewVars.prefix = prefix
        try {

            let userService = new UserService()

            viewVars.editing = true
            viewVars.accountSettings = true
            viewVars.passwordValue=passwordMask

            viewVars.user = await userService.getByUuId(ctx.session.passport.user.uuid)
            viewVars.userMetadata = UserDataObjectSpecs.metadata
            viewVars.userFieldRender = UserDataObjectSpecs.htmlDataObjectFieldRender
            viewVars.userValidateSchema = UserDataObjectValidator.validateSchema
            viewVars.userValidateFunction = "app.module_data.user_form.userValidateFunction=" + UserDataObjectValidator.validateFunction

            return ctx.render('plugins/'+prefix+'/views/user_form', viewVars);
        } catch (error) {
            console.error(error)
        }
    })   

    router.get('/user_form', async (ctx:Context) => {
        viewVars.prefix = prefix
        try {

            let uuid:any = ctx.request.query.uuid || ""
            let user:UserDataObject = new UserDataObject()
            let userService = new UserService()
            
            let roleService = new RoleService()
            viewVars.roles = await roleService.getAll()

            if (uuid !=="") {
                user = await userService.getByUuId(uuid) 
                viewVars.editing = true
                viewVars.passwordValue=passwordMask
                
            }
            else {
                viewVars.editing = false
                viewVars.passwordValue=""
            }

            viewVars.accountSettings = false
            viewVars.user = user
            viewVars.userMetadata = UserDataObjectSpecs.metadata
            viewVars.userFieldRender = UserDataObjectSpecs.htmlDataObjectFieldRender
            viewVars.userValidateSchema = UserDataObjectValidator.validateSchema
            viewVars.userValidateFunction = "app.module_data.user_form.userValidateFunction=" + UserDataObjectValidator.validateFunction

            return ctx.render('plugins/'+prefix+'/views/user_form', viewVars);
        } catch (error) {
            console.error(error)
        }
    })    

    router.post('/user',koaBody(), async (ctx:Context) => {
        const userService = new UserService()
        let user = (JSON.parse(ctx.request.body.json) as UserDataObject)
        let uuid = user.uuid
        let saveRolePolicy = false

        let userValidationResult=UserDataObjectValidator.validateFunction(user,UserDataObjectValidator.validateSchema)

        if (userValidationResult.isValid) {
            if (user.uuid !== "") {
                userService.updateOne(user)
                ctx.body = {
                    status: 'success',
                }
                saveRolePolicy = true
            } else {
                if (user.password == passwordMask) {
                    ctx.status=400
                    ctx.body = {
                        status: 'error',
                        messages: [{field:"password",message:"Invalid password"}]
                    }                    
                }
                else {
                    //TODO: Check permissions on create or update
                    //TODO: Look for duplicate
                    uuid = await userService.create(user)
                    ctx.body = {
                        status: 'success',
                    }
                    saveRolePolicy = true

                }
            }
            if (saveRolePolicy) {
                await ctx.authorizer.enforcer.removeFilteredGroupingPolicy(0,uuid)
                if (user.role_uuid !== "") {
                    await ctx.authorizer.enforcer.addGroupingPolicy(uuid,user.role_uuid)          
                }
            }
            
        } else {
            ctx.status=400
            ctx.body = {
                status: 'error',
                messages: userValidationResult.messages
            }
            
        }

    })

    router.delete('/user',koaBody(), async (ctx:Context) => {
        const userService = new UserService()

        let uuid:any = ctx.request.query.uuid || ""

        if (uuid !=="") {
            await userService.deleteByUuId(uuid)
            await ctx.authorizer.enforcer.removeFilteredGroupingPolicy(0,uuid)
            ctx.body = {
                status: 'success',
            }
        }
        else {
            ctx.status=400
            ctx.body = {
                status: 'error',
                message: "Invalid Uuid"
            }

        }

    })

    return router
}