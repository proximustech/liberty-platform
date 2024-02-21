export interface IThird { 
    thirdMethod: (param:string)=> string
    //Allows rendering a view before the final render
    getPluginData: (ctx:any,viewVars:any)=> Promise<any> 
 }