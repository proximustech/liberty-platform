import { Context } from "koa";
import Router from "koa-router"
import { UserService } from "../services/UserService";
import { RoleService } from "../services/RoleService";
import { UserDataObject,UserDataObjectSpecs,UserDataObjectValidator, passwordMask } from "../dataObjects/UserDataObject";
import { UserHasPermissionOnElement } from "../services/UserPermissionsService";
import { ExceptionNotAuthorized,ExceptionRecordAlreadyExists,ExceptionInvalidObject } from "../../../types/exception_custom_errors";

import koaBody from 'koa-body';

module.exports = function(router:Router,appViewVars:any,prefix:string){

    let viewVars = {...appViewVars};
    viewVars.prefix = prefix

    router.get('/users', async (ctx:Context) => {
        
        viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
        const userService = new UserService(prefix,viewVars.userPermissions)
        try {
            viewVars.users = await userService.getAll()
            
            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.module_data.users_list.userHasPermissionOnElement=" +  UserHasPermissionOnElement            

            return ctx.render('plugins/users_control/views/users', viewVars);
        } catch (error) { 

            if (error instanceof ExceptionNotAuthorized) {
                ctx.status=401
                ctx.body = {
                    status: 'error',
                    messages: [{message:"Operation NOT Allowed"}]
                }         
                console.log("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to READ on " + prefix +'.user')
                
            }
            else {
                console.error(error)
            }

        } finally {
            userService.dispose()
        }

    })

    router.get('/account_settings', async (ctx:Context) => {

        viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
        let userService = new UserService(prefix,viewVars.userPermissions)
        try {
        
            viewVars.editing = true
            viewVars.accountSettings = true
            viewVars.passwordValue=passwordMask

            viewVars.user = await userService.getByUuId(ctx.session.passport.user.uuid,false)
            viewVars.userMetadata = UserDataObjectSpecs.metadata
            viewVars.userFieldRender = UserDataObjectSpecs.htmlDataObjectFieldRender
            viewVars.userValidateSchema = UserDataObjectValidator.validateSchema
            viewVars.userValidateFunction = "app.module_data.user_form.userValidateFunction=" + UserDataObjectValidator.validateFunction

            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.module_data.user_form.userHasPermissionOnElement=" +  UserHasPermissionOnElement

            return ctx.render('plugins/'+prefix+'/views/user_form', viewVars);
        } catch (error) {
            if (error instanceof ExceptionNotAuthorized) {
                ctx.status=401
                ctx.body = {
                    status: 'error',
                    messages: [{message:"Operation NOT Allowed"}]
                }         
                console.log("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to READ on " + prefix +'.user')
                
            }
            else {
                console.error(error)

            }
        } finally {
            userService.dispose()
        }
    })   

    router.get('/user_form', async (ctx:Context) => {

        viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
        let userService = new UserService(prefix,viewVars.userPermissions)
        let roleService = new RoleService()
        try {
            
            let uuid:any = ctx.request.query.uuid || ""
            let user:UserDataObject = new UserDataObject()
            
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

            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.module_data.user_form.userHasPermissionOnElement=" +  UserHasPermissionOnElement

            return ctx.render('plugins/'+prefix+'/views/user_form', viewVars);
        } catch (error) {
            if (error instanceof ExceptionNotAuthorized) {
                ctx.status=401
                ctx.body = {
                    status: 'error',
                    messages: [{message:"Operation NOT Allowed"}]
                }         
                console.log("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to READ on " + prefix +'.user')
                
            }
            else {
                console.error(error)

            }
        } finally {
            userService.dispose()
            roleService.dispose()
        }
    })    

    router.post('/user',koaBody(), async (ctx:Context) => {

        let userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
        let user = (JSON.parse(ctx.request.body.json) as UserDataObject)
        let selfUser = false
        if (user.uuid===ctx.session.passport.user.uuid) {
            selfUser = true
        }

        let processAllowed = UserHasPermissionOnElement(userPermissions,[prefix+'.user'],['write'])
        if (!processAllowed && !selfUser) {

            ctx.status=401
            ctx.body = {
                status: 'error',
                messages: [{message:"Operation NOT Allowed"}]
            }         
            console.log("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.user')

        }
        else {
            const userService = new UserService(prefix,userPermissions)
            try {

                //Protect role_id on own user account settings change
                if (selfUser && !processAllowed) {
                    let savedUser = await userService.getByUuId(user.uuid,false)
                    if (user.role_uuid !== savedUser.role_uuid) {
                        console.log("SECURITY WARNING: Possible role id tampering by " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.user')
                    }
    
                    user.role_uuid = savedUser.role_uuid
    
                }
    
                let uuid = user.uuid
                let saveRolePolicy = false
        
                let dbResultOk = false
                if (user.uuid !== "") {
                    if (selfUser) {
                        dbResultOk = await userService.updateOne(user,false)
                    }
                    else {
                        dbResultOk = await userService.updateOne(user)
                    }

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
                if (saveRolePolicy && processAllowed) {
                    await ctx.authorizer.enforcer.removeFilteredGroupingPolicy(0,uuid)
                    if (user.role_uuid !== "") {
                        await ctx.authorizer.enforcer.addGroupingPolicy(uuid,user.role_uuid)          
                    }
                }
                      
            } catch (error) {
                if (error instanceof ExceptionNotAuthorized) {
                    ctx.status=401
                    ctx.body = {
                        status: 'error',
                        messages: [{message:"Operation NOT Allowed"}]
                    }         
                    console.log("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.user')
                    
                }
                else if (error instanceof ExceptionRecordAlreadyExists) {
                    ctx.status=409
                    ctx.body = {
                        status: 'error',
                        messages: [{field:"email",message:"E-Mail already exists"}]
                    }   
                    
                }
                else if (error instanceof ExceptionInvalidObject) {
                    ctx.status=400
                    ctx.body = {
                        status: 'error',
                        //@ts-ignore
                        messages: error.errorMessages
                    }
                    
                }
                else {
                    console.error(error)
    
                }                
            } finally {
                userService.dispose()
            }

        }

    })

    router.delete('/user',koaBody(), async (ctx:Context) => {

        let userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
        const userService = new UserService(prefix,userPermissions)

        try {
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
        } catch (error) {
            if (error instanceof ExceptionNotAuthorized) {
                ctx.status=401
                ctx.body = {
                    status: 'error',
                    messages: [{message:"Operation NOT Allowed"}]
                }         
                console.log("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.user')
                
            }
            else {
                console.error(error)

            }            
        } finally {
            userService.dispose()
        }

    })

    return router
}