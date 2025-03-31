import { IDisposable } from "../../../interfaces/disposable_interface";
import { ExceptionNotAuthorized,ExceptionInvalidObject } from "../../../types/exception_custom_errors";
import { UserHasPermissionOnElement } from "../services/UserPermissionsService";
import { RoleDataObject,RoleDataObjectValidator } from "../dataObjects/RoleDataObject";
import { RoleModel } from "../models/RoleModel";

export class RoleService implements IDisposable {
    
    private roleModel:RoleModel
    private userPermissions:any
    private serviceSecurityElement:string
    private userCanRead:boolean
    private userCanWrite:boolean

    constructor(roleModel:RoleModel,serviceSecurityElementPrefix:string,userPermissions:any){
        this.roleModel= roleModel
        this.serviceSecurityElement=serviceSecurityElementPrefix+".user"
        this.userPermissions=userPermissions
        this.userCanRead = UserHasPermissionOnElement(this.userPermissions,[this.serviceSecurityElement],["read"])
        this.userCanWrite = UserHasPermissionOnElement(this.userPermissions,[this.serviceSecurityElement],["write"])
    }

    async create(role:RoleDataObject){

        let roleValidationResult=RoleDataObjectValidator.validateFunction(role,RoleDataObjectValidator.validateSchema)

        if (!roleValidationResult.isValid) {
            throw new ExceptionInvalidObject(ExceptionInvalidObject.invalidObject,roleValidationResult.messages)
        }        
   
        if (this.userCanWrite) {
            return await this.roleModel.create(role)            
        }
        else{
            throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
        }        

    }

    async updateOne(role:RoleDataObject){
        let roleValidationResult=RoleDataObjectValidator.validateFunction(role,RoleDataObjectValidator.validateSchema)

        if (!roleValidationResult.isValid) {
            throw new ExceptionInvalidObject(ExceptionInvalidObject.invalidObject,roleValidationResult.messages)
        }        
        
        if (this.userCanWrite) {
            return await this.roleModel.updateOne(role)
        }
        else{
            throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
        }                  
    }

    async deleteByUuId(roleUuId:string){
        if (this.userCanWrite) {
            return await this.roleModel.deleteByUuId(roleUuId) 
           
        }
        else{
            throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
        }          


    }

    async getByUuId(uuid:string) : Promise<RoleDataObject> {
        if (this.userCanRead) {
            return await this.roleModel.getByUuId(uuid)
           
        }
        else{
            throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
        }  
    }

    async getAll() : Promise<RoleDataObject[]> {
        if (this.userCanRead) {
            return await this.roleModel.getAll()
           
        }
        else{
            throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
        }  
    }
    
    getUuidMapFromList(list:RoleDataObject[]) : Map<string, string> {
        //let result:any = {}
        const result = new Map<string, string>();
        list.forEach(role => {
            //result[role.name]=role.uuid
            result.set(role.uuid,role.name)
        });

        return result
    }

    async fieldValueExists(processedDocumentUuid:string,fieldName:string,fieldValue:any) : Promise<Boolean> {
        if (this.userCanRead) {
            return await this.roleModel.fieldValueExists(processedDocumentUuid,fieldName,fieldValue)
           
        }
        else{
            throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
        }  
    }
    
    dispose(){
        this.roleModel.dispose()
    }      

}