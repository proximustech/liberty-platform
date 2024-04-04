import { dynamicViewsDefinition } from "../values/dynamic_views"

export class DynamicViews  {
    public static async addViewVarContent(route:any,viewVar:string,viewVars:any,ctx:any){
        try {
            if (route in dynamicViewsDefinition) {
                //@ts-ignore
                if (viewVar in dynamicViewsDefinition[route]) {
                    // @ts-ignore
                    for (let index = 0; index < dynamicViewsDefinition[route][viewVar].length; index++) {
                        // @ts-ignore
                        viewVars[viewVar] = await dynamicViewsDefinition[route][viewVar][index].getPluginData(ctx, viewVars)
    
                    }
                }
            }
            
        } catch (error) {
            console.error(error)
        }
    }
}