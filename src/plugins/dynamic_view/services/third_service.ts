import {IThird} from "../interfaces/third_interface"

export class Third implements IThird {
    thirdMethod(param:string){
        return param
    }
    async getPluginData(ctx:any,viewVars:any){
        return await ctx.render('plugins/dynamic_view/views/third_additional', viewVars);
    }
}