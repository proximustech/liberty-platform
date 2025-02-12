import { DataObjectValidateFunction } from "../../../services/dataObjectValidateService";
import { HtmlDataObjectFieldRender,HtmlDataObjectRender } from "../../../services/dataObjectHtmlGenerator";
export class UserDataObject {
    _id:any = ""
    uuid:string = ""

    email:string = ""
    password:string = ""
    salt:string = ""
    name:string = ""
    last_name:string = ""

    role_uuid:string = ""
}

export const passwordMask:string = "----------"

export const UserDataObjectValidator:any = {

    validateSchema : {
        email : {
            regexp: String.raw`^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`,
            message:"Email must have a valid e-mail format",
            required:true,
            requiredMessage : "E-Mail is required."
        },
        password : {
            regexp: String.raw`(^${passwordMask}$)|(^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#;:,\.\?@])[a-zA-Z\d!#;:,\.\?@]{12,}$)`,
            message:"Password MUST have at least 12 DISTRIBUTED characteres with letters ( uppercase and lowercase ), numbers and some of the following: !#;:,.?@",
            required:true,
            requiredMessage : "Password is required."
        },
        name : {
            regexp:String.raw`^\S{3,30}$`,
            message:"Name name must be in the range of 3 and 30 characters without spaces.",
            required:true,
            requiredMessage : "Name is required."
        },
        last_name : {
            regexp:String.raw`^\S{3,30}$`,
            message:"Last name name must be in the range of 3 and 30 characters.",
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
            validationRequired: UserDataObjectValidator.validateSchema.email.required,
            validationRegexp: UserDataObjectValidator.validateSchema.email.regexp,
            validationMessage: UserDataObjectValidator.validateSchema.email.message,
            validationRequiredMessage: UserDataObjectValidator.validateSchema.email.requiredMessage,
            inputType:"text"
        },
        password : {
            label:"Password",
            validationRequired: UserDataObjectValidator.validateSchema.password.required,
            validationRegexp: UserDataObjectValidator.validateSchema.password.regexp,
            validationMessage: UserDataObjectValidator.validateSchema.password.message,
            validationRequiredMessage: UserDataObjectValidator.validateSchema.password.requiredMessage,
            inputType:"password"
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
            validationRequired: UserDataObjectValidator.validateSchema.last_name.required,
            validationRegexp: UserDataObjectValidator.validateSchema.last_name.regexp,
            validationMessage: UserDataObjectValidator.validateSchema.last_name.message,
            validationRequiredMessage: UserDataObjectValidator.validateSchema.last_name.requiredMessage,
            inputType:"text"
        },
        

    },
    htmlDataObjectRender:HtmlDataObjectRender,
    htmlDataObjectFieldRender:HtmlDataObjectFieldRender
}