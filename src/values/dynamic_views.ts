import { DynamicViewBase} from "../plugins/dynamic_view_base/services/third_service";
import { AjaxViews } from "../plugins/ajax_views/services/module_menu";


export let dynamicViewsDefinition = {
    //"route_target":{viewVar[bases]}
    "dynamic_view_target":{
        "pluginData":[
            new DynamicViewBase.Third(),
        ]
    },
    "root":{
        "modulesContent":[
            new AjaxViews.ModuleMenu(),
        ]
    },
}