import { IllegalCharacters as IllegalCharactersRegexp, IllegalCharactersValidationMessage } from "../values/regular_expressions";

export const HtmlDataObjectFieldRender: any = (dataObjectName:string,fieldName:string,fieldValue:any,fieldMetadata:any,enabled:Boolean=true) => {
    let html:any = ""
    let validationRequired:any = false
    let validationRegexp:any = ""
    let validationMessage:any = ""
    let validationRequiredMessage:any = ""
    let label:any = ""
    let inputType:any = ""
    let disabledParameter = "disabled='disabled'"

    if (enabled) {
        disabledParameter = ""
    }

    validationRegexp = fieldMetadata["validationRegexp"]
    validationMessage = fieldMetadata["validationMessage"]
    validationRequired = fieldMetadata["validationRequired"]
    validationRequiredMessage = fieldMetadata["validationRequiredMessage"]
    label = fieldMetadata["label"]
    inputType = fieldMetadata["inputType"]

    if (inputType=="text") {
        html+=`
        <label style='margin-bottom:7px;font-size:17px'>${label}</label>
        <input id='${dataObjectName}_${fieldName}' class='form-control lp_input' type='text' value='${fieldValue}' oninput="${dataObjectName}_${fieldName}_listener(this)" ${disabledParameter} autocomplete="one-time-code" />
        <label id='${dataObjectName}_${fieldName}_validation_message' style='font-size:15px;color:red;margin-left:2px;margin-top:3px'></label>
        <br>

        <script>
            function ${dataObjectName}_${fieldName}_listener(element){
                app.md.${dataObjectName}_form.${dataObjectName}.${fieldName}=element.value

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
                        illegalCharactersRegexp = new RegExp(/${IllegalCharactersRegexp}/)
                        if(illegalCharactersRegexp.test(element.value)){
                            document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML='${IllegalCharactersValidationMessage}'
                        }
                        else {
                            document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML=''
                        }
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
        <sl-input id='${dataObjectName}_${fieldName}' type="password" value='${fieldValue}' password-toggle oninput="${dataObjectName}_${fieldName}_listener(this)" ${disabledParameter} ></sl-input>
        <label id='${dataObjectName}_${fieldName}_validation_message' style='font-size:15px;color:red;margin-left:2px;margin-top:3px'></label>
        <br>

        <script>
            function ${dataObjectName}_${fieldName}_listener(element){
                app.md.${dataObjectName}_form.${dataObjectName}.${fieldName}=element.value

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
                        illegalCharactersRegexp = new RegExp(/${IllegalCharactersRegexp}/)
                        if(illegalCharactersRegexp.test(element.value)){
                            document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML='${IllegalCharactersValidationMessage}'
                        }
                        else {
                            document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML=''
                        }
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
        <textarea id='${dataObjectName}_${fieldName}' class='form-control lp_input' oninput="${dataObjectName}_${fieldName}_listener(this)" ${disabledParameter} >${fieldValue}</textarea>
        <label id='${dataObjectName}_${fieldName}_validation_message' style='font-size:15px;color:red;margin-left:2px;margin-top:3px'></label>
        <br>

        <script>
            function ${dataObjectName}_${fieldName}_listener(element){
                app.md.${dataObjectName}_form.${dataObjectName}.${fieldName}=element.value

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
                        illegalCharactersRegexp = new RegExp(/${IllegalCharactersRegexp}/)
                        if(illegalCharactersRegexp.test(element.value)){
                            document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML='${IllegalCharactersValidationMessage}'
                        }
                        else {
                            document.getElementById('${dataObjectName}_${fieldName}_validation_message').innerHTML=''
                        }
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
        <input id="${dataObjectName}_${fieldName}" class="form-check-input" type="checkbox" role="switch" onchange="${dataObjectName}_${fieldName}_listener(this)" ${disabledParameter} >
        <br>

        <script>
            function ${dataObjectName}_${fieldName}_listener(element){
                app.md.${dataObjectName}_form.${dataObjectName}.${fieldName}=element.checked
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