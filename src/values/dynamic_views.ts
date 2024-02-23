import { Third } from "../plugins/dynamic_view_base/services/third_service";

export let dynamicViewsDefinition = {
    //"target":{view[bases]}
    "dynamic_view_target":{
        "third":[
            new Third(),
        ]
    }
}