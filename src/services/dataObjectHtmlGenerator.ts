export const HtmlDataObjectFieldRender: any = (dataObjectName:string,fieldName:string,fieldValue:any,fieldMetadata:any) => {
    let html:any = ""
    let validationRequired:any = false
    let validationRegexp:any = ""
    let validationMessage:any = ""
    let validationRequiredMessage:any = ""
    let label:any = ""
    let inputType:any = ""
    let disabled = "disabled='disabled'"

    validationRegexp = fieldMetadata["validationRegexp"]
    validationMessage = fieldMetadata["validationMessage"]
    validationRequired = fieldMetadata["validationRequired"]
    validationRequiredMessage = fieldMetadata["validationRequiredMessage"]
    label = fieldMetadata["label"]
    inputType = fieldMetadata["inputType"]

    if ("disabled" in fieldMetadata) {
        disabled = fieldMetadata["disabled"]
    }


    if (inputType=="text") {
        html+=`
        <label style='margin-bottom:7px;font-size:17px'>${label}</label>
        <input id='${dataObjectName}_${fieldName}' class='form-control' type='text' value='${fieldValue}' oninput="${dataObjectName}_${fieldName}_listener(this)" ${disabled} />
        <label id='${dataObjectName}_${fieldName}_validation_message' style='font-size:15px;color:red;margin-left:2px;margin-top:3px'></label>
        <br>

        <script>
            function ${dataObjectName}_${fieldName}_listener(element){
                app.module_data.${dataObjectName}_form.${dataObjectName}.${fieldName}=element.value

                if(element.value===""){
                    if("${validationRequired}"==="true"){
                        document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML="${validationRequiredMessage}"
                    }
                    else{
                        document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML=""
                    }                                   
                } else {
                    regexpValidator = new RegExp(/${validationRegexp}/)
                    if(!regexpValidator.test(element.value)){
                        document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML='${validationMessage}'
                    }
                    else {
                        document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML=''
                    }
                }

            }
            ${dataObjectName}_${fieldName}_listener(document.getElementById("${dataObjectName}_${fieldName}"))
        </script>
        `
    }
    else if (inputType=="password") {
        html+=`
        <label style='margin-bottom:7px;font-size:17px'>${label}</label>
        <sl-input id='${dataObjectName}_${fieldName}' type="password" value='${fieldValue}' password-toggle oninput="${dataObjectName}_${fieldName}_listener(this)" ${disabled} ></sl-input>
        <label id='${dataObjectName}_${fieldName}_validation_message' style='font-size:15px;color:red;margin-left:2px;margin-top:3px'></label>
        <br>

        <script>
            function ${dataObjectName}_${fieldName}_listener(element){
                app.module_data.${dataObjectName}_form.${dataObjectName}.${fieldName}=element.value

                if(element.value===""){
                    if("${validationRequired}"==="true"){
                        document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML="${validationRequiredMessage}"
                    }
                    else{
                        document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML=""
                    }                                   
                } else {
                    regexpValidator = new RegExp(/${validationRegexp}/)
                    if(!regexpValidator.test(element.value)){
                        document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML='${validationMessage}'
                    }
                    else {
                        document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML=''
                    }
                }

            }
            ${dataObjectName}_${fieldName}_listener(document.getElementById("${dataObjectName}_${fieldName}"))
        </script>
        `
    }    
    else if (inputType=="text_area") {
        html+=`
        <label style='margin-bottom:7px;font-size:17px'>${label}</label>
        <textarea id='${dataObjectName}_${fieldName}' class='form-control' oninput="${dataObjectName}_${fieldName}_listener(this)" ${disabled} >${fieldValue}</textarea>
        <label id='${dataObjectName}_${fieldName}_validation_message' style='font-size:15px;color:red;margin-left:2px;margin-top:3px'></label>
        <br>

        <script>
            function ${dataObjectName}_${fieldName}_listener(element){
                app.module_data.${dataObjectName}_form.${dataObjectName}.${fieldName}=element.value

                if(element.value===""){
                    if("${validationRequired}"==="true"){
                        document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML="${validationRequiredMessage}"

                    }
                    else{
                        document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML=""
                    }               
                } else {
                    regexpValidator = new RegExp(/${validationRegexp}/)
                    if(!regexpValidator.test(element.value)){
                        document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML='${validationMessage}'
                    }
                    else {
                        document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML=''
                    }
                }
            }
            ${dataObjectName}_${fieldName}_listener(document.getElementById("${dataObjectName}_${fieldName}"))
        </script>
        `       
    }
    else if (inputType=="switch") {
        html+=`
        <label style='margin-bottom:7px;font-size:17px'>${label}</label>
        <input id="${dataObjectName}_${fieldName}" class="form-check-input" type="checkbox" role="switch" onchange="${dataObjectName}_${fieldName}_listener(this)" ${disabled} >
        <br>

        <script>
            function ${dataObjectName}_${fieldName}_listener(element){
                app.module_data.${dataObjectName}_form.${dataObjectName}.${fieldName}=element.checked
            }
            ${dataObjectName}_${fieldName}_listener(document.getElementById("${dataObjectName}_${fieldName}"))
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