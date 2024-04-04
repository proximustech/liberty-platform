import {IDynamicView} from "../../../interfaces/dynamic_view_interface"

export namespace DynamicViewBase {
    export class Third implements IDynamicView {
        async getPluginData(ctx:any,viewVars:any){
            return await ctx.render('plugins/dynamic_view_base/views/third_additional', viewVars);
        }
    }
}