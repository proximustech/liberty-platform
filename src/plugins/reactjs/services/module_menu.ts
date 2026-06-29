import { IDynamicView } from "../../../interfaces/dynamic_view_interface"

export default class ModuleMenu implements IDynamicView {
    async getPluginData(ctx: any, viewVars: any) {
        return await ctx.render('plugins/reactjs/views/module_menu', viewVars)
    }
}
