export class DynamicViews  {
    public static async addViewVarContent(dynamicViewsDefinition:any,route:any,viewVar:string,viewVars:any,ctx:any){
        let pluginObjectInstance = undefined
        try {
            if (route in dynamicViewsDefinition) {
                //@ts-ignore
                if (viewVar in dynamicViewsDefinition[route]) {
                    // @ts-ignore
                    for (let index = 0; index < dynamicViewsDefinition[route][viewVar].length; index++) {
                        pluginObjectInstance = new(require(dynamicViewsDefinition[route][viewVar][index]).default)
                        // @ts-ignore
                        viewVars[viewVar] += await pluginObjectInstance.getPluginData(ctx, viewVars)
    
                    }
                }
            }
            
        } catch (error) {
            console.error(error)
        }
    }
}