export interface IAuthorizer { 
    initialize: ()=> {}
    authorize: (subject:any,element:any,action:any,environment:any)=> {} 
    getRoleAndSubjectPermissions: (role:any,subject:any)=> {} 
 }