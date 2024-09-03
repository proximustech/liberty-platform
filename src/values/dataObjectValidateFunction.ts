export const validateFunction: any = (data:any,validateData:any) => {
    let fieldRegexp = ""
    let fieldValue = ""
    let result = []
    let regexpValidator = undefined

    for (const [fieldName, fieldData] of Object.entries(validateData)) {
        fieldRegexp = validateData[fieldName]["regexp"]
        fieldValue = data[fieldName]

        regexpValidator = new RegExp(fieldRegexp);
        if (!regexpValidator.test(fieldValue)) {
            result.push({
                field:fieldName,
                message:validateData[fieldName]["message"]
            })
        }
    }
    return result
}