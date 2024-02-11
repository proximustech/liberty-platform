export interface IThird { 
    thirdMethod: (param:string)=> string 
    getPluginData: (ctx:any,viewVars:any)=> Promise<any> 
 }