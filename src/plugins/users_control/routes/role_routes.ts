import { Context } from "koa";
import Router from "koa-router"
import { RoleService } from "../services/RoleService";
import { RoleDataObject,RoleDataObjectSpecs,RoleDataObjectValidator } from "../dataObjects/RoleDataObject";
import { DynamicViews } from "../../../services/dynamic_views_service";
import { dynamicViewsDefinition } from "../values/dynamic_views"
import { UserHasPermissionOnElement } from "../services/UserPermissionsService"

import koaBody from 'koa-body';

module.exports = function(router:Router,viewVars:any,prefix:string){


    router.get('/roles', async (ctx:Context) => {
        viewVars.prefix = prefix
        try {
            const roleService = new RoleService()
            viewVars.roles = await roleService.getAll()
            viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.module_data.roles_list.userHasPermissionOnElement=" +  UserHasPermissionOnElement         
            return ctx.render('plugins/'+prefix+'/views/roles', viewVars);
        } catch (error) {
            console.error(error)
        }
    })

    router.get('/role_form', async (ctx:Context) => {
        viewVars.prefix = prefix
        try {

            let uuid:any = ctx.request.query.uuid || ""
            let role:RoleDataObject = new RoleDataObject()
            let roleService = new RoleService()
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
            viewVars.userPermissions = await ctx.authorizer.getRoleAndSubjectPermissions(ctx.session.passport.user.role_uuid,ctx.session.passport.user.uuid)
            viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
            viewVars.userHasPermissionOnElement = "app.module_data.role_form.userHasPermissionOnElement=" +  UserHasPermissionOnElement
            
            return ctx.render('plugins/'+prefix+'/views/role_form', viewVars);
        } catch (error) {
            console.error(error)
        }
    })    

    router.post('/role',koaBody(), async (ctx:Context) => {

        let body = JSON.parse(ctx.request.body.json)
        let permissions = body.permissions
        delete body.permissions

        const roleService = new RoleService()
        let role = (body as RoleDataObject)
        let uuid = role.uuid

        let roleValidationResult=RoleDataObjectValidator.validateFunction(role,RoleDataObjectValidator.validateSchema)

        if (await roleService.fieldValueExists(role.uuid,"name",role.name)){
            ctx.status=409
            ctx.body = {
                status: 'error',
                messages: [{field:"name",message:"Name already exists"}]
            } 
        }
        else if (roleValidationResult.isValid) {
            if (role.uuid !== "") {
                roleService.updateOne(role)
                ctx.body = {
                    status: 'success',
                }                
            } else {
                uuid = await roleService.create(role)
                ctx.body = {
                    status: 'success',
                }
                
            }

            permissions.forEach(async (permission:any) => {
                if (permission.enabled) {
                    let result:Boolean = await ctx.authorizer.enforcer.addPolicy(uuid,permission.resource, permission.permission)
                }
                else{                    
                    let result:Boolean = await ctx.authorizer.enforcer.removeFilteredPolicy(0,uuid,permission.resource,permission.permission)
                }
            });
            
        } else {
            ctx.status=400
            ctx.body = {
                status: 'error',
                messages: roleValidationResult.messages
            }
            
        }

    })

    router.delete('/role',koaBody(), async (ctx:Context) => {
        const roleService = new RoleService()

        let uuid:any = ctx.request.query.uuid || ""

        if (uuid !=="") {
            await roleService.deleteByUuId(uuid)   
            await ctx.authorizer.enforcer.removeFilteredPolicy(0,uuid) 
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