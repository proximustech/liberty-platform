import { Context } from "koa";
import Router from "koa-router"
import { RoleService } from "../services/RoleService";
import { RoleDataObject,RoleDataObjectSpecs,RoleDataObjectValidator } from "../dataObjects/RoleDataObject";
import { DynamicViews } from "../../../services/dynamic_views_service";
import { dynamicViewsDefinition } from "../values/dynamic_views"
import { UserHasPermissionOnElement } from "../services/UserPermissionsService"
import { ExceptionNotAuthorized,ExceptionRecordAlreadyExists,ExceptionInvalidObject } from "../../../types/exception_custom_errors";

import koaBody from 'koa-body';

module.exports = function(router:Router,appViewVars:any,prefix:string){

    let viewVars = {...appViewVars};
    viewVars.prefix = prefix

    router.get('/roles', async (ctx:Context) => {

        viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
        const roleService = new RoleService(prefix,viewVars.userPermissions)
        try {
            viewVars.roles = await roleService.getAll()
            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.module_data.roles_list.userHasPermissionOnElement=" +  UserHasPermissionOnElement         

            return ctx.render('plugins/'+prefix+'/views/roles', viewVars);
        } catch (error) {
            if (error instanceof ExceptionNotAuthorized) {
                ctx.status=401
                ctx.body = {
                    status: 'error',
                    messages: [{message:"Operation NOT Allowed"}]
                }         
                console.log("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to READ on " + prefix +'.role')
                
            }
            else {
                console.error(error)
            }
        } finally  {
            roleService.dispose()
        }
    })

    router.get('/role_form', async (ctx:Context) => {
        
        viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
        let roleService = new RoleService(prefix,viewVars.userPermissions)
        try {

            let uuid:any = ctx.request.query.uuid || ""
            let role:RoleDataObject = new RoleDataObject()
            viewVars.permissionsModulesContent = ""
            await DynamicViews.addViewVarContent(dynamicViewsDefinition,"role_form","permissionsModulesContent",viewVars,ctx)

            if (uuid !=="") {
                role = await roleService.getByUuId(uuid) 
                viewVars.editing = true
                viewVars.rolePermissions = await ctx.authorizer.enforcer.getPermissionsForUser(role.uuid)
                
            }
            else {
                viewVars.editing = false
                viewVars.passwordValue=""
                viewVars.rolePermissions = []
            }

            viewVars.role = role
            viewVars.roleMetadata = RoleDataObjectSpecs.metadata
            viewVars.roleFieldRender = RoleDataObjectSpecs.htmlDataObjectFieldRender
            viewVars.roleValidateSchema = RoleDataObjectValidator.validateSchema
            viewVars.roleValidateFunction = "app.module_data.role_form.roleValidateFunction=" + RoleDataObjectValidator.validateFunction
            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.module_data.role_form.userHasPermissionOnElement=" +  UserHasPermissionOnElement
            
            return ctx.render('plugins/'+prefix+'/views/role_form', viewVars);
        } catch (error) {
            if (error instanceof ExceptionNotAuthorized) {
                ctx.status=401
                ctx.body = {
                    status: 'error',
                    messages: [{message:"Operation NOT Allowed"}]
                }         
                console.log("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to READ on " + prefix +'.role')
                
            }
            else {
                console.error(error)
            }
        } finally {
            roleService.dispose()
        }
    })    

    router.post('/role',koaBody(), async (ctx:Context) => {

        let userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)

        let body = JSON.parse(ctx.request.body.json)
        let permissions = body.permissions
        delete body.permissions

        const roleService = new RoleService(prefix,userPermissions)
        try {
            let role = (body as RoleDataObject)
            let uuid = role.uuid

            let dbResultOk = false
            if (role.uuid !== "") {
                dbResultOk = await roleService.updateOne(role)
                if (dbResultOk) {
                    ctx.body = {
                        status: 'success',
                    }                
                }
                else {
                    ctx.status=500
                    ctx.body = {
                        status: 'error',
                        messages: [{message: "Data Unexpected Error"}]
                    }
                    console.log("DATABASE ERROR writing role "+role.uuid)                        
                }
            } else {
                uuid = await roleService.create(role)
                if (uuid != "false") {
                    ctx.body = {
                        status: 'success',
                    }
                }
                else {
                    ctx.status=500
                    ctx.body = {
                        status: 'error',
                        messages: [{message: "Data Unexpected Error"}]
                    }
                    console.log("DATABASE ERROR writing role "+role.uuid)                           
                }
                
            }

            if (uuid != "false") {
                permissions.forEach(async (permission:any) => {
                    if (permission.enabled) {
                        let result:Boolean = await ctx.authorizer.enforcer.addPolicy(uuid,permission.resource, permission.permission)
                    }
                    else{                    
                        let result:Boolean = await ctx.authorizer.enforcer.removeFilteredPolicy(0,uuid,permission.resource,permission.permission)
                    }
                });
            }
           
        } catch (error) {
            if (error instanceof ExceptionNotAuthorized) {
                ctx.status=401
                ctx.body = {
                    status: 'error',
                    messages: [{message:"Operation NOT Allowed"}]
                }         
                console.log("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.role')
                
            }
            else if (error instanceof ExceptionRecordAlreadyExists) {
                ctx.status=409
                ctx.body = {
                    status: 'error',
                    messages: [{field:"name",message:"Name already exists"}]
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
        } finally{
            roleService.dispose()
        }

    })

    router.delete('/role',koaBody(), async (ctx:Context) => {

        let userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)

        const roleService = new RoleService(prefix,userPermissions)
        try {
            let uuid:any = ctx.request.query.uuid || ""

            if (uuid !=="") {
                if (await roleService.deleteByUuId(uuid)) {
                    await ctx.authorizer.enforcer.removeFilteredPolicy(0,uuid) 
                    ctx.body = {
                        status: 'success',
                    }
                }
                else {
                    ctx.status=500
                    ctx.body = {
                        status: 'error',
                        messages: [{message: "Data Unexpected Error"}]
                    }
                    console.log("DATABASE ERROR writing role "+uuid)                        
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
                console.log("SECURITY WARNING: unauthorized user " + ctx.session.passport.user.uuid + " traying to WRITE on " + prefix +'.role')
                
            }            
        } finally {
            roleService.dispose()

        }

    })

    return router
}
