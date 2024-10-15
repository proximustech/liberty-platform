import { Context } from "koa";
import Router from "koa-router"
import { RoleService } from "../services/RoleService";
import { RoleDataObject,RoleDataObjectSpecs,RoleDataObjectValidator } from "../dataObjects/RoleDataObject";
import { DynamicViews } from "../../../services/dynamic_views_service";
import { dynamicViewsDefinition } from "../values/dynamic_views"

import koaBody from 'koa-body';

module.exports = function(router:Router,viewVars:any,prefix:string){


    router.get('/roles', async (ctx:Context) => {
        try {
            const roleService = new RoleService()
            viewVars.roles = await roleService.getAll()            
            return ctx.render('plugins/'+prefix+'/views/roles', viewVars);
        } catch (error) {
            console.error(error)
        }
    })

    router.get('/role_form', async (ctx:Context) => {
        try {

            let uuid:any = ctx.request.query.uuid || ""
            let role:RoleDataObject = new RoleDataObject()
            let roleService = new RoleService()
            viewVars.permissionsModulesContent = ""
            await DynamicViews.addViewVarContent(dynamicViewsDefinition,"role_form","permissionsModulesContent",viewVars,ctx)

            if (uuid !=="") {
                role = await roleService.getByUuId(uuid) 
                viewVars.editing = true
                
            }
            else {
                viewVars.editing = false
                viewVars.passwordValue=""
            }

            viewVars.role = role
            viewVars.roleMetadata = RoleDataObjectSpecs.metadata
            viewVars.roleFieldRender = RoleDataObjectSpecs.htmlDataObjectFieldRender
            viewVars.roleValidateSchema = RoleDataObjectValidator.validateSchema
            viewVars.roleValidateFunction = "app.module_data.role_form.roleValidateFunction=" + RoleDataObjectValidator.validateFunction

            return ctx.render('plugins/'+prefix+'/views/role_form', viewVars);
        } catch (error) {
            console.error(error)
        }
    })    

    router.post('/role',koaBody(), async (ctx:Context) => {
        const roleService = new RoleService()
        let role = (JSON.parse(ctx.request.body.json) as RoleDataObject)

        let roleValidationResult=RoleDataObjectValidator.validateFunction(role,RoleDataObjectValidator.validateSchema)

        if (roleValidationResult.isValid) {
            if (role.uuid !== "") {
                roleService.updateOne(role)
                ctx.body = {
                    status: 'success',
                }                
            } else {

                roleService.create(role)
                ctx.body = {
                    status: 'success',
                }
                
            }
            
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