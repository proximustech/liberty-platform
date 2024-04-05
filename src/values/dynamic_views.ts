import * as DynamicViewBaseThirdService from "../plugins/dynamic_view_base/services/third_service";
import * as DynamicViewBaseModuleMenu from "../plugins/dynamic_view_base/services/module_menu";
import * as AjaxViewsModuleMenu from "../plugins/ajax_views/services/module_menu";


export let dynamicViewsDefinition = {
    //"route_target":{viewVar[bases]}
    "dynamic_view_target":{
        "pluginData":[
            new DynamicViewBaseThirdService.Third(),
        ]
    },
    "root":{
        "modulesContent":[
            new AjaxViewsModuleMenu.ModuleMenu(),
            new DynamicViewBaseModuleMenu.ModuleMenu(),
        ]
    },
}