import { IDisposable } from "../../../interfaces/disposable_interface";

import { MongoService } from "../services/MongoService";
import { ObjectId,MongoClient,Db,Collection } from 'mongodb';
import { RoleDataObject } from "../dataObjects/RoleDataObject";
import { Uuid } from "../../../services/utilities";


export class RoleModel implements IDisposable {
    
    private dataBaseName = "liberty_platform"
    private collectionName = "roles"
    private mongoClient:MongoClient
    private mongoService:MongoService
    private dataBase:Db
    private collection:Collection

    constructor(){
        this.mongoService = new MongoService()
        this.mongoClient = this.mongoService.getMongoClient()
        this.dataBase = this.mongoClient.db(this.dataBaseName);
        this.collection = this.dataBase.collection(this.collectionName);
    }

    async create(role:RoleDataObject){
        role.uuid = Uuid.createMongoUuId()
        role._id = new ObjectId(role.uuid)        
        const result = await this.collection.insertOne(role,{writeConcern: {w: 1, j: true}})

        if (result.insertedId == role._id && result.acknowledged) {
            return role.uuid
        }
        else return "false"

    }

    async updateOne(role:RoleDataObject){
        role._id = new ObjectId(role.uuid)
        const result = await this.collection.replaceOne(
            {uuid: role.uuid }, 
            role,
            {upsert: false,writeConcern: {w: 1, j: true}}
        )
        if (result.acknowledged && result.matchedCount == 1 ) {
            return true
        }
        else return false                
    }

    async deleteByUuId(roleUuId:string){
        const result = await this.collection.deleteOne({ uuid: roleUuId })
        if (result.deletedCount == 1 && result.acknowledged) {
            return true
        }
        else return false            
    }

    async getByUuId(uuid:string) : Promise<RoleDataObject> {

        const cursor = this.collection.find({uuid : uuid});

        while (await cursor.hasNext()) {
            let document = (await cursor.next() as RoleDataObject);
            return document
        }

        return new RoleDataObject()
    }

    async getAll() : Promise<RoleDataObject[]> {
        //await this.processTest()
        const cursor = this.collection.find({});
        return (await cursor.toArray() as RoleDataObject[])
    }
    
    async fieldValueExists(processedDocumentUuid:string,fieldName:string,fieldValue:any) : Promise<Boolean> {
        let filter:any = {}
        filter[fieldName] = fieldValue
        const cursor = this.collection.find(filter);
        while (await cursor.hasNext()) {
            let document:any = await cursor.next();
            if (document.uuid !== processedDocumentUuid) {
                return true
            }
        }
        return false
    }
    
    dispose(){
        this.mongoService.dispose()
    }      

}