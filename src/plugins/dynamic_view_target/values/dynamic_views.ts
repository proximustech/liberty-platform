import * as DynamicViewBaseThirdService from "../../dynamic_view_base/services/third_service";

export let dynamicViewsDefinition = {
    //"route_target":{viewVar[bases]}
    "dynamic_view_target":{
        "pluginData":[
            new DynamicViewBaseThirdService.Third(),
        ]
    }
}