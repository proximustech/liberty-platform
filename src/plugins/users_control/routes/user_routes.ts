import { Context } from "koa";
import Router from "koa-router"
import { UserService } from "../services/UserService";
import { RoleService } from "../services/RoleService";
import { UserDataObject,UserDataObjectSpecs,UserDataObjectValidator, passwordMask } from "../dataObjects/UserDataObject";
import { UserHasPermissionOnElement } from "../services/UserPermissionsService";

import koaBody from 'koa-body';

module.exports = function(router:Router,appViewVars:any,prefix:string){

    let viewVars = {...appViewVars};
    viewVars.prefix = prefix

    router.get('/users', async (ctx:Context) => {
        
        try {
            const userService = new UserService()
            viewVars.users = await userService.getAll()
            
            viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.module_data.users_list.userHasPermissionOnElement=" +  UserHasPermissionOnElement            

            userService.dispose()
            return ctx.render('plugins/users_control/views/users', viewVars);
        } catch (error) {
            console.error(error)
        }
    })

    router.get('/account_settings', async (ctx:Context) => {

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

            viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.module_data.user_form.userHasPermissionOnElement=" +  UserHasPermissionOnElement

            userService.dispose()
            return ctx.render('plugins/'+prefix+'/views/user_form', viewVars);
        } catch (error) {
            console.error(error)
        }
    })   

    router.get('/user_form', async (ctx:Context) => {

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

            viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.module_data.user_form.userHasPermissionOnElement=" +  UserHasPermissionOnElement

            userService.dispose()
            roleService.dispose()
            return ctx.render('plugins/'+prefix+'/views/user_form', viewVars);
        } catch (error) {
            console.error(error)
        }
    })    

    router.post('/user',koaBody(), async (ctx:Context) => {

        let userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
        let processAllowed = UserHasPermissionOnElement(userPermissions,[prefix+'.user'],['write'])
        if (!processAllowed) {

            ctx.status=401
            ctx.body = {
                status: 'error',
                messages: [{message:"Operation NOT Allowed"}]
            }         
            console.log("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.user')

        }
        else {

            const userService = new UserService()
            let user = (JSON.parse(ctx.request.body.json) as UserDataObject)
            let uuid = user.uuid
            let saveRolePolicy = false
    
            let userValidationResult=UserDataObjectValidator.validateFunction(user,UserDataObjectValidator.validateSchema)
            if (await userService.fieldValueExists(user.uuid,"email",user.email)){
                ctx.status=409
                ctx.body = {
                    status: 'error',
                    messages: [{field:"email",message:"E-Mail already exists"}]
                }              
            }
            else if (userValidationResult.isValid) {
                let dbResultOk = false
                if (user.uuid !== "") {
                    dbResultOk = await userService.updateOne(user)
                    if (dbResultOk) {
                        ctx.body = {
                            status: 'success',
                        }
                        saveRolePolicy = true
                    }
                    else{
                        ctx.status=500
                        ctx.body = {
                            status: 'error',
                            messages: [{message: "Data Unexpected Error"}]
                        }
                        console.log("DATABASE ERROR writing user "+user.uuid)
                    }
                } else {
                    if (user.password == passwordMask) {
                        ctx.status=400
                        ctx.body = {
                            status: 'error',
                            messages: [{field:"password",message:"Invalid password"}]
                        }                    
                    }
                    else {
                        uuid = await userService.create(user)
                        if (uuid != "false") {
                            ctx.body = {
                                status: 'success',
                            }
                            saveRolePolicy = true
                        }
                        else {
                            ctx.status=500
                            ctx.body = {
                                status: 'error',
                                messages: [{message: "Data Unexpected Error"}]
                            }
                            console.log("DATABASE ERROR writing user "+user.uuid)                             
                        }
    
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
            userService.dispose()         

        }

    })

    router.delete('/user',koaBody(), async (ctx:Context) => {

        let userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
        let processAllowed = UserHasPermissionOnElement(userPermissions,[prefix+'.user'],['write'])
        if (!processAllowed) {

            ctx.status=401
            ctx.body = {
                status: 'error',
                messages: [{message:"Operation NOT Allowed"}]
            }         
            console.log("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.user')

        }
        else {

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
            userService.dispose()
        }

    })

    return router
}