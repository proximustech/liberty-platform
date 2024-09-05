export const HtmlDataObjectFieldRender: any = (dataObjectName:string,fieldName:string,fieldValue:any,fieldMetadata:any) => {
    let html:any = ""
    let validationRegexp:any = ""
    let validationMessage:any = ""
    let label:any = ""
    let inputType:any = ""

    validationRegexp = fieldMetadata["validationRegexp"]
    validationMessage = fieldMetadata["validationMessage"]
    label = fieldMetadata["label"]
    inputType = fieldMetadata["inputType"]

    if (inputType=="text") {
        html+=`
        <label style='margin-bottom:7px;font-size:17px'>${label}</label>
        <input id='${dataObjectName}_${fieldName}' class='form-control' type='text' value='${fieldValue}' oninput="${dataObjectName}_${fieldName}_listener(this)" />
        <label id='${dataObjectName}_${fieldName}_validation_message' style='font-size:15px;color:red;margin-left:12px'></label>
        <br>

        <script>
            function ${dataObjectName}_${fieldName}_listener(element){
                app.module_data.${dataObjectName}_form.${dataObjectName}.${fieldName}=element.value

                regexpValidator = new RegExp("${validationRegexp}")
                if(!regexpValidator.test(element.value)){
                    document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML='${validationMessage}'
                }
                else {
                    document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML=''
                }
            }
        </script>
        `       
    }
    else if (inputType=="text_area") {
        html+=`
        <label style='margin-bottom:7px;font-size:17px'>${label}</label>
        <textarea id='${dataObjectName}_${fieldName}' class='form-control' oninput="${dataObjectName}_${fieldName}_listener(this)">${fieldValue}</textarea>
        <label id='${dataObjectName}_${fieldName}_validation_message' style='font-size:15px;color:red;margin-left:12px'></label>
        <br>

        <script>
            function ${dataObjectName}_${fieldName}_listener(element){
                app.module_data.${dataObjectName}_form.${dataObjectName}.${fieldName}=element.value

                regexpValidator = new RegExp("${validationRegexp}")
                if(!regexpValidator.test(element.value)){
                    document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML='${validationMessage}'
                }
                else {
                    document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML=''
                }
            }
        </script>
        `       
    }


    return html
}

export const HtmlDataObjectRender: any = (dataObjectName:any,dataObjectData:any,dataObjectMetadata:any) => {
    let html:any = ""

    for (const [fieldName, fieldMetadata] of Object.entries(dataObjectMetadata)) {
        html += HtmlDataObjectFieldRender(dataObjectName,fieldName,dataObjectData[fieldName],fieldMetadata)
    }

    return html
}