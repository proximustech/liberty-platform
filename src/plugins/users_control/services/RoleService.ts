import { MongoService } from "./MongoService";
import { ObjectId,MongoClient,Db,Collection } from 'mongodb';
import { RoleDataObject } from "../dataObjects/RoleDataObject";
import { Uuid } from "../../../services/utilities";

export class RoleService {
    
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

    getNew(){
        let role = new RoleDataObject()
        role.uuid = Uuid.createMongoUuId()
        role._id = new ObjectId(role.uuid)

        return role
    }

    async create(role:RoleDataObject){
        role.uuid = Uuid.createMongoUuId()
        role._id = new ObjectId(role.uuid)        
        const result = await this.collection.insertOne(role)
        return role.uuid
    }

    async updateOne(role:RoleDataObject){
        role._id = new ObjectId(role.uuid)
        const result = await this.collection.replaceOne(
            {uuid: role.uuid }, 
            role,
            {upsert: false}
        )        
    }

    async deleteByUuId(roleUuId:string){
        const result = await this.collection.deleteOne({ uuid: roleUuId })
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

}