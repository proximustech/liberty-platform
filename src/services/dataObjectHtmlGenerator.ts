export const HtmlDataObjectFieldRender: any = (fieldName:string,fieldValue:any,fieldMetadata:any) => {
    let html:any = ""
    let regexp:any = ""
    let label:any = ""
    let inputType:any = ""

    regexp = fieldMetadata["regexp"]
    label = fieldMetadata["label"]
    inputType = fieldMetadata["inputType"]

    if (inputType=="text") {
        html+=`
        <label>${label}</label>
        <input id='${fieldName}_id' class='form-control' type='text' value='${fieldValue}' />
        <label id='${fieldName}_validation_message'></label>
        <br>
        <br>
        `       
    }


    return html
}

export const HtmlDataObjectRender: any = (dataObjectData:any,dataObjectMetadata:any) => {
    let html:any = ""

    for (const [fieldName, fieldMetadata] of Object.entries(dataObjectMetadata)) {
        html += HtmlDataObjectFieldRender(fieldName,dataObjectData[fieldName],fieldMetadata)
    }

    return html
}