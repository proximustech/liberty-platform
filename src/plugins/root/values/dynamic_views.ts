import * as LibertyFlagModuleMenu from "../../_liberty_flag/services/module_menu";
import * as UsersControlModuleMenu from "../../users_control/services/module_menu";
//import * as VsmModuleMenu from "../../_assessor/services/module_menu";
//import * as DynamicViewBaseModuleMenu from "../../dynamic_view_base/services/module_menu";
//import * as AjaxViewsModuleMenu from "../../ajax_views/services/module_menu";


export let dynamicViewsDefinition = {
    //"route_target":{viewVar[bases]}
    "root":{
        "modulesContent":[
            new LibertyFlagModuleMenu.ModuleMenu(),
	        new UsersControlModuleMenu.ModuleMenu(),
	        //new VsmModuleMenu.ModuleMenu(),
            //new AjaxViewsModuleMenu.ModuleMenu(),
            //new DynamicViewBaseModuleMenu.ModuleMenu(),
        ]
    },
}
