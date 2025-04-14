import { Context } from "koa";
import Router from "koa-router"
import { UserServiceFactory } from "../factories/UserServiceFactory";
import { RoleServiceFactory } from "../factories/RoleServiceFactory";
import { UserDataObject,UserDataObjectSpecs,UserDataObjectValidator, passwordMask } from "../dataObjects/UserDataObject";
import { UserHasPermissionOnElement } from "../services/UserPermissionsService";
import { ExceptionCsrfTokenFailed,ExceptionNotAuthorized,ExceptionRecordAlreadyExists,ExceptionInvalidObject } from "../../../types/exceptions";
import { LoggerServiceFactory } from "../../../factories/LoggerServiceFactory";
import { RouteService } from "../../../services/route_service";

import koaBody from 'koa-body';
import { vi } from "@faker-js/faker";

module.exports = function(router:Router,appViewVars:any,prefix:string){

    let viewVars = {...appViewVars};
    viewVars.prefix = prefix

    let logger = LoggerServiceFactory.create()

    router.get('/users', async (ctx:Context) => {
        
        viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
        const userService = UserServiceFactory.create(prefix,viewVars.userPermissions)
        const roleService = RoleServiceFactory.create(prefix,viewVars.userPermissions)
        try {
            let searchValue:any = ctx.request.query.search_value || ""
            let listRegistersNumber:number = parseInt(ctx.request.query.list_registers_number as string) || 2
            let listPageNumber:number = parseInt(ctx.request.query.list_page_number as string) || 1            

            let filter:any = {}
            if (searchValue !== "") {
                filter["email"] = searchValue
            }

            let usersCount:number = await userService.getCount(filter)
            viewVars.listPagesTotalNumber= Math.ceil(usersCount / listRegistersNumber)
            let skipRegistersNumber = (listPageNumber * listRegistersNumber) - listRegistersNumber

            viewVars.listPageNumber = listPageNumber

            viewVars.searchValue = searchValue
            viewVars.users = await userService.getAll(filter,listRegistersNumber,skipRegistersNumber)
            viewVars.rolesUuidMap = roleService.getUuidMapFromList(await roleService.getAll())
            
            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.md.users_list.userHasPermissionOnElement=" +  UserHasPermissionOnElement            

            return ctx.render('plugins/users_control/views/users', viewVars);
        } catch (error) { 

            if (error instanceof ExceptionNotAuthorized) {
                ctx.status=401
                ctx.body = {
                    status: 'error',
                    messages: [{message:"Operation NOT Allowed"}]
                }  
       
                logger.warn("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to READ on " + prefix +'.user')
                
            }
            else {
                logger.error(error)
            }

        } finally {
            userService.dispose()
        }

    })

    router.get('/account_settings', async (ctx:Context) => {
        viewVars.userPermissions = [
            ['','users_control.user','read'],
        ]
        if (!ctx.session.passport.user.federated) {
            viewVars.userPermissions.push(['','users_control.self_user','write'])
        }

        let userService = UserServiceFactory.create(prefix,viewVars.userPermissions)
        try {
        
            viewVars.editing = true
            viewVars.accountSettings = true
            viewVars.passwordValue=passwordMask

            viewVars.user = await userService.getByUuId(ctx.session.passport.user.uuid,false)
            viewVars.userMetadata = UserDataObjectSpecs.metadata
            viewVars.userFieldRender = UserDataObjectSpecs.htmlDataObjectFieldRender
            viewVars.userValidateSchema = UserDataObjectValidator.validateSchema
            viewVars.userValidateFunction = "app.md.user_form.userValidateFunction=" + UserDataObjectValidator.validateFunction

            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.md.user_form.userHasPermissionOnElement=" +  UserHasPermissionOnElement
            RouteService.setCsrfToken(viewVars,ctx)

            return ctx.render('plugins/'+prefix+'/views/user_form', viewVars);
        } catch (error) {
            if (error instanceof ExceptionNotAuthorized) {
                ctx.status=401
                ctx.body = {
                    status: 'error',
                    messages: [{message:"Operation NOT Allowed"}]
                }         
                logger.warn("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to READ on " + prefix +'.user')
                
            }
            else {
                logger.error(error)

            }
        } finally {
            userService.dispose()
        }
    })   

    router.get('/user_form', async (ctx:Context) => {

        viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
        let userService = UserServiceFactory.create(prefix,viewVars.userPermissions)
        let roleService = RoleServiceFactory.create(prefix,viewVars.userPermissions)
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
            viewVars.userValidateFunction = "app.md.user_form.userValidateFunction=" + UserDataObjectValidator.validateFunction

            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.md.user_form.userHasPermissionOnElement=" +  UserHasPermissionOnElement
            RouteService.setCsrfToken(viewVars,ctx)

            return ctx.render('plugins/'+prefix+'/views/user_form', viewVars);
        } catch (error) {
            if (error instanceof ExceptionNotAuthorized) {
                ctx.status=401
                ctx.body = {
                    status: 'error',
                    messages: [{message:"Operation NOT Allowed"}]
                }         
                logger.warn("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to READ on " + prefix +'.user')
                
            }
            else {
                logger.error(error)

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
        if (user.uuid===ctx.session.passport.user.uuid && !ctx.session.passport.user.federated) {
            selfUser = true
        }

        let processAllowed = UserHasPermissionOnElement(userPermissions,[prefix+'.user'],['write'])
        if (!processAllowed && !selfUser) {

            ctx.status=401
            ctx.body = {
                status: 'error',
                messages: [{message:"Operation NOT Allowed"}]
            }         
            logger.warn("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.user')

        }
        else {
            const userService = UserServiceFactory.create(prefix,userPermissions)
            try {

                if (ctx.request.body.csrfToken !== ctx.cookies.get("csrfToken")) {
                    throw new ExceptionCsrfTokenFailed(ExceptionCsrfTokenFailed.ExceptionCsrfTokenFailed);
                }                

                //Protect role_id on own user account settings change
                if (selfUser && !processAllowed) {
                    let savedUser = await userService.getByUuId(user.uuid,false)
                    if (user.role_uuid !== savedUser.role_uuid) {
                        logger.warn("SECURITY WARNING: Possible role id tampering by " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.user')
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
                        logger.error("DATABASE ERROR writing user "+user.uuid)
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
                    logger.warn("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.user')
                    
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
                else if (error instanceof ExceptionCsrfTokenFailed) {
                    ctx.status=401
                    ctx.body = {
                        status: 'error',
                        messages: [{message:"Operation NOT Allowed"}]
                    }         
                    logger.warn("SECURITY WARNING: Csrf Control Failed for user " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.user')
                    
                }                  
                else {
                    logger.error(error)
    
                }                
            } finally {
                userService.dispose()
            }

        }

    })

    router.delete('/user',koaBody(), async (ctx:Context) => {

        let userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
        const userService = UserServiceFactory.create(prefix,userPermissions)

        try {

            if (ctx.request.query.csrfToken !== ctx.cookies.get("csrfToken")) {
                throw new ExceptionCsrfTokenFailed(ExceptionCsrfTokenFailed.ExceptionCsrfTokenFailed);
            }

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
                logger.warn("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.user')
                
            }
            else if (error instanceof ExceptionCsrfTokenFailed) {
                ctx.status=401
                ctx.body = {
                    status: 'error',
                    messages: [{message:"Operation NOT Allowed"}]
                }         
                logger.warn("SECURITY WARNING: Csrf Control Failed for user " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.user')
                
            }             
            else {
                logger.error(error)

            }            
        } finally {
            userService.dispose()
        }

    })

    return router
}