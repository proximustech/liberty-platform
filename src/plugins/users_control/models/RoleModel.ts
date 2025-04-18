import { IDisposable } from "../../../interfaces/disposable_interface";

import { MongoService } from "../services/MongoService";
import { ObjectId,MongoClient,Db,Collection } from 'mongodb';
import { RoleDataObject } from "../dataObjects/RoleDataObject";
import { Uuid } from "../../../services/utilities";
import { ExceptionRecordAlreadyExists } from "../../../types/exceptions";


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
        const result = await this.collection.insertOne(role,{writeConcern: {w: 1, j: true}}).catch((error) => {
            if (error.code === 11000) {
                throw new ExceptionRecordAlreadyExists("Name already exists")
            } else {
              console.log(error);
              throw new Error("DB Unexpected Error");
            }
        });

        if (result.insertedId == role._id && result.acknowledged) {
            return role.uuid
        }
        else return "false"

    }

    async updateOne(role:RoleDataObject){
        role._id = new ObjectId(role.uuid)
        const result = await this.collection.replaceOne(
            {uuid: String(role.uuid) }, 
            role,
            {upsert: false,writeConcern: {w: 1, j: true}}
        ).catch((error) => {
            if (error.code === 11000) {
                throw new ExceptionRecordAlreadyExists("Name already exists")
            } else {
              console.log(error);
              throw new Error("DB Unexpected Error");
            }
        });
        if (result.acknowledged && result.matchedCount == 1 ) {
            return true
        }
        else return false                
    }

    async deleteByUuId(roleUuId:string){
        const result = await this.collection.deleteOne({ uuid: String(roleUuId) })
        if (result.deletedCount == 1 && result.acknowledged) {
            return true
        }
        else return false            
    }

    async getByUuId(uuid:string) : Promise<RoleDataObject> {

        const cursor = this.collection.find({uuid : String(uuid)});

        while (await cursor.hasNext()) {
            let document = (await cursor.next() as RoleDataObject);
            return document
        }

        return new RoleDataObject()
    }

    async getAll(filter:any={},limit=0,skip=0) : Promise<RoleDataObject[]> {
        for (const [key, value] of Object.entries(filter)) {
            filter[key]=new RegExp(`.*${value}.*`)
        } 

        let limitStage = [{
            $limit : limit
        }]
        let skipStage = [{
            $skip : skip
        }]        

        let pipeline = [
            { 
                $match: filter
            },
            { 
                $sort: { name : 1 }
            }
        ] 

        if (skip > 0) {
            //@ts-ignore
            pipeline = pipeline.concat(skipStage)
        }        
        if (limit > 0) {
            //@ts-ignore
            pipeline = pipeline.concat(limitStage)
        }             

        const cursor = this.collection.aggregate(pipeline);
        return (await cursor.toArray() as RoleDataObject[])
    }

    async getCount(filter:any={}) : Promise<number> {
        let localFilter = structuredClone(filter)

        for (const [key, value] of Object.entries(localFilter)) {
            localFilter[key]=new RegExp(`.*${value}.*`)
        }         
        return await this.collection.countDocuments(localFilter);
    }  
    
    async fieldValueExists(processedDocumentUuid:string,fieldName:string,fieldValue:any) : Promise<Boolean> {
        let filter:any = {}
        filter[fieldName] = String(fieldValue)
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