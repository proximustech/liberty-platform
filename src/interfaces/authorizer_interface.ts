export interface IAuthorizer { 
    initialize: ()=> {}
    authorize: (subject:any,element:any,action:any,environment:any)=> {} 
    getSubjectPermissions: (subject:any)=> {} 
 }