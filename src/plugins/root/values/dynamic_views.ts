import * as DynamicViewBaseModuleMenu from "../../dynamic_view_base/services/module_menu";
import * as AjaxViewsModuleMenu from "../../ajax_views/services/module_menu";


export let dynamicViewsDefinition = {
    //"route_target":{viewVar[bases]}
    "root":{
        "modulesContent":[
            new AjaxViewsModuleMenu.ModuleMenu(),
            new DynamicViewBaseModuleMenu.ModuleMenu(),
        ]
    },
}