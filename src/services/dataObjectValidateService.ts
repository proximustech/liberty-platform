import { IllegalCharacters as IllegalCharactersRegexp, IllegalCharactersValidationMessage } from "../values/regular_expressions";

export const DataObjectValidateFunction: any = (data:any,validateSchema:any) => {
    let fieldRegexp = ""
    let fieldValue = ""
    let regexpValidator = undefined
    let result:any = {
        isValid :true,
        messages:[]
    }

    result.isValid = true

    for (const [fieldName, fieldSchema] of Object.entries(validateSchema)) {
        fieldRegexp = validateSchema[fieldName]["regexp"]
        fieldValue = data[fieldName].toString()

        if (fieldValue === "") {
            if (validateSchema[fieldName]["required"]) {
                result.isValid=false
                result.messages.push({
                    field:fieldName,
                    message:validateSchema[fieldName]["requiredMessage"]
                })                
            } 
            
        } else {
            regexpValidator = new RegExp(fieldRegexp);
            if (!regexpValidator.test(fieldValue)) {
                result.isValid=false
                result.messages.push({
                    field:fieldName,
                    message:validateSchema[fieldName]["message"]
                })
            }
            else {
                try {
                    //This code executes well in the backend but not in the brower. Leaving this validation section to the backend
                    let illegalCharactersRegexp = new RegExp(IllegalCharactersRegexp)                
                    if(illegalCharactersRegexp.test(fieldValue)){
                        result.isValid=false
                        result.messages.push({
                            field:fieldName,
                            message:IllegalCharactersValidationMessage
                        })
                    }                                       
                } catch (error) {}

            }         
            
        }

    }
    return result
}