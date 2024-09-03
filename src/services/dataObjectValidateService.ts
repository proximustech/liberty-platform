export const DataObjectValidateFunction: any = (data:any,validateSchema:any) => {
    let fieldRegexp = ""
    let fieldValue = ""
    let result = []
    let regexpValidator = undefined

    for (const [fieldName, fieldSchema] of Object.entries(validateSchema)) {
        fieldRegexp = validateSchema[fieldName]["regexp"]
        fieldValue = data[fieldName]

        regexpValidator = new RegExp(fieldRegexp);
        if (!regexpValidator.test(fieldValue)) {
            result.push({
                field:fieldName,
                message:validateSchema[fieldName]["message"]
            })
        }
    }
    return result
}