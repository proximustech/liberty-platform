import { IDisposable } from "../../../interfaces/disposable_interface";
import { ExceptionNotAuthorized,ExceptionInvalidObject } from "../../../types/exceptions";
import { UserHasPermissionOnElement } from "../services/UserPermissionsService";
import { UserDataObject, UserDataObjectValidator, passwordMask } from "../dataObjects/UserDataObject";
import { UserModel } from "../models/UserModel";

export class UserService implements IDisposable {
    
    private userModel:UserModel
    private userPermissions:any
    private serviceSecurityElement:string
    private userCanRead:boolean
    private userCanWrite:boolean

    constructor(userModel:UserModel,serviceSecurityElementPrefix:string,userPermissions:any){
        this.userModel= userModel
        this.serviceSecurityElement=serviceSecurityElementPrefix+".user"
        this.userPermissions=userPermissions
        this.userCanRead = UserHasPermissionOnElement(this.userPermissions,[this.serviceSecurityElement],["read"])
        this.userCanWrite = UserHasPermissionOnElement(this.userPermissions,[this.serviceSecurityElement],["write"])
    }

    async create(user:UserDataObject,checkPermissions=true){

        if (user.password == passwordMask) {
            let errorMessages = [{field:"password",message:"Invalid password"}]
            throw new ExceptionInvalidObject(ExceptionInvalidObject.invalidObject,errorMessages)             
        }

        let userValidationResult=UserDataObjectValidator.validateFunction(user,UserDataObjectValidator.validateSchema)

        if (!userValidationResult.isValid) {
            throw new ExceptionInvalidObject(ExceptionInvalidObject.invalidObject,userValidationResult.messages)
        }

        if (checkPermissions) {
            if (this.userCanWrite) {
                return await this.userModel.create(user)            
            }
            else{
                throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
            }
            
        }
        else {
            return await this.userModel.create(user)
        }
    }

    async updateOne(user:UserDataObject,checkPermissions=true){

        let userValidationResult=UserDataObjectValidator.validateFunction(user,UserDataObjectValidator.validateSchema)

        if (!userValidationResult.isValid) {
            throw new ExceptionInvalidObject(ExceptionInvalidObject.invalidObject,userValidationResult.messages)
        }        
        
        if (checkPermissions) {
            if (this.userCanWrite) {
                return await this.userModel.updateOne(user)
                
            }
            else{
                throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
            }            
        }
        else{
            return await this.userModel.updateOne(user)
        }

    }

    async deleteByUuId(UserUuId:string){
        if (this.userCanWrite) {
            return await this.userModel.deleteByUuId(UserUuId) 
           
        }
        else{
            throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
        }              
    }

    async getByUuId(uuid:string,checkPermissions=true) : Promise<UserDataObject> {
        if (checkPermissions) {
            if (this.userCanRead) {
                return await this.userModel.getByUuId(uuid)
               
            }
            else{
                throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
            }            
        }
        else{
            return await this.userModel.getByUuId(uuid)

        }
 
    }

    async getAll(limit=0,skip=0) : Promise<UserDataObject[]> {
        if (this.userCanRead) {
            return await this.userModel.getAll(limit,skip)
           
        }
        else{
            throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
        }        
    }

    async getCount() : Promise<number> {
        if (this.userCanRead) {
            return await this.userModel.getCount()
           
        }
        else{
            throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
        }        
    }    

    async fieldValueExists(processedDocumentUuid:string,fieldName:string,fieldValue:any,checkPermissions=true) : Promise<Boolean> {
        if (checkPermissions) {
            if (this.userCanRead) {
                return await this.userModel.fieldValueExists(processedDocumentUuid,fieldName,fieldValue)
            }
            else{
                throw new ExceptionNotAuthorized(ExceptionNotAuthorized.notAuthorized);            
            }                    
        }
        else {
            return await this.userModel.fieldValueExists(processedDocumentUuid,fieldName,fieldValue)
        }

    }    
   
    dispose(){
        this.userModel.dispose()
    }      

}