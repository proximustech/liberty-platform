import { DataObjectValidateFunction } from "../../../services/dataObjectValidateService";
import { HtmlDataObjectFieldRender,HtmlDataObjectRender } from "../../../services/dataObjectHtmlGenerator";

export class UserDataObject {
    _id:any = ""
    uuid:string = ""

    email:string = ""
    password:string = ""
    name:string = ""
    last_name:string = ""

}

export const UserDataObjectValidator:any = {

    validateSchema : {
        name : {
            regexp:"^.{3,30}$",
            message:"Name name must be in the range of e and 30 characters.",
            required:true,
            requiredMessage : "Name is required."
        },
        last_name : {
            regexp:"^.{3,30}$",
            message:"Last name name must be in the range of e and 30 characters.",
            required:true,
            requiredMessage : "Last name is required."
        },

    },

    validateFunction : DataObjectValidateFunction
}

export const UserDataObjectSpecs:any = {

    metadata : {
        email : {
            label:"E-Mail",
            validationRequired: UserDataObjectValidator.validateSchema.name.required,
            validationRegexp: UserDataObjectValidator.validateSchema.name.regexp,
            validationMessage: UserDataObjectValidator.validateSchema.name.message,
            validationRequiredMessage: UserDataObjectValidator.validateSchema.name.requiredMessage,
            inputType:"text"
        },
        password : {
            label:"Password",
            validationRequired: UserDataObjectValidator.validateSchema.name.required,
            validationRegexp: UserDataObjectValidator.validateSchema.name.regexp,
            validationMessage: UserDataObjectValidator.validateSchema.name.message,
            validationRequiredMessage: UserDataObjectValidator.validateSchema.name.requiredMessage,
            inputType:"text"
        },
        name : {
            label:"Name",
            validationRequired: UserDataObjectValidator.validateSchema.name.required,
            validationRegexp: UserDataObjectValidator.validateSchema.name.regexp,
            validationMessage: UserDataObjectValidator.validateSchema.name.message,
            validationRequiredMessage: UserDataObjectValidator.validateSchema.name.requiredMessage,
            inputType:"text"
        },
        last_name : {
            label:"Last name",
            validationRequired: UserDataObjectValidator.validateSchema.name.required,
            validationRegexp: UserDataObjectValidator.validateSchema.name.regexp,
            validationMessage: UserDataObjectValidator.validateSchema.name.message,
            validationRequiredMessage: UserDataObjectValidator.validateSchema.name.requiredMessage,
            inputType:"text"
        },
        

    },
    htmlDataObjectRender:HtmlDataObjectRender,
    htmlDataObjectFieldRender:HtmlDataObjectFieldRender
}