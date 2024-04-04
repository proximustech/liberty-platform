export interface IDynamicView { 
    getPluginData: (ctx:any,viewVars:any)=> Promise<any> 
 }