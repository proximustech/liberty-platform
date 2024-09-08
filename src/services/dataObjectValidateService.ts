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
        fieldValue = data[fieldName]

        regexpValidator = new RegExp(fieldRegexp);
        if (!regexpValidator.test(fieldValue)) {
            result.isValid=false
            result.messages.push({
                field:fieldName,
                message:validateSchema[fieldName]["message"]
            })
        }
    }
    return result
}