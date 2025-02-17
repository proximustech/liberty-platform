import { DataObjectValidateFunction } from "../../../services/dataObjectValidateService";
import { HtmlDataObjectFieldRender,HtmlDataObjectRender } from "../../../services/dataObjectHtmlGenerator";
export class RoleDataObject {
    _id:any = ""
    uuid:string = ""

    name:string = ""

}

export const RoleDataObjectValidator:any = {

    validateSchema : {
        name : {
            regexp: String.raw`^\S{3,30}$`,
            message:"Name name must be in the range of 3 and 30 characters without spaces.",
            required:true,
            requiredMessage : "Name is required."
        },
        uuid : {
            regexp:String.raw`(^\S{24}$)|(^$)`,
            message:"uuid format is invalid",
            required:false,
            requiredMessage : ""
        },           

    },

    validateFunction : DataObjectValidateFunction
}

export const RoleDataObjectSpecs:any = {

    metadata : {
        name : {
            label:"Name",
            validationRequired: RoleDataObjectValidator.validateSchema.name.required,
            validationRegexp: RoleDataObjectValidator.validateSchema.name.regexp,
            validationMessage: RoleDataObjectValidator.validateSchema.name.message,
            validationRequiredMessage: RoleDataObjectValidator.validateSchema.name.requiredMessage,
            inputType:"text"
        },

    },
    htmlDataObjectRender:HtmlDataObjectRender,
    htmlDataObjectFieldRender:HtmlDataObjectFieldRender
}