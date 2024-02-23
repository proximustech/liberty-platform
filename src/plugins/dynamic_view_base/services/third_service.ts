import {IThird} from "../interfaces/third_interface"

export class Third implements IThird {
    async getPluginData(ctx:any,viewVars:any){
        return await ctx.render('plugins/dynamic_view_base/views/third_additional', viewVars);
    }
}