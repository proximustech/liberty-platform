import { IDisposable } from "../../../interfaces/disposable_interface";

import { MongoService } from "../services/MongoService";
import { ObjectId,MongoClient,Db,Collection } from 'mongodb';
import { UserDataObject,passwordMask } from "../dataObjects/UserDataObject";
import { Uuid,Random } from "../../../services/utilities";
import { ExceptionRecordAlreadyExists } from "../../../types/exceptions";

import * as argon2 from "argon2";


export class UserModel implements IDisposable {
    
    private dataBaseName = "liberty_platform"
    private collectionName = "users"
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

    async create(user:UserDataObject){
        user.uuid = Uuid.createMongoUuId()
        user._id = new ObjectId(user.uuid)
        user.salt = Random.getRandomString()
        user.password=await argon2.hash(user.password+user.salt)

        const result = await this.collection.insertOne(user,{writeConcern: {w: 1, j: true}}).catch((error) => {
            if (error.code === 11000) {
                throw new ExceptionRecordAlreadyExists("E-Mail already exists")
            } else {
              console.log(error);
              throw new Error("DB Unexpected Error");
            }
        });
        if (result.insertedId == user._id && result.acknowledged) {
            return user.uuid
        }
        else return "false"

    }

    async updateOne(user:UserDataObject,protectCustomData:Boolean=true){
        user._id = new ObjectId(user.uuid)
        const cursor = this.collection.find({uuid : String(user.uuid)});

        while (await cursor.hasNext()) {
            let oldUser = (await cursor.next() as UserDataObject);
            if (!protectCustomData) {
                user.custom_protected_data = oldUser.custom_protected_data
            }
            user.salt = oldUser.salt
            if (user.password===passwordMask) {
                user.password = oldUser.password
            }
            else {
                user.salt = Random.getRandomString()
                user.password=await argon2.hash(user.password+user.salt)
            }
        }
        const result = await this.collection.replaceOne(
            {uuid: String(user.uuid) }, 
            user,
            {upsert: false,writeConcern: {w: 1, j: true}}
        ).catch((error) => {
            if (error.code === 11000) {
                throw new ExceptionRecordAlreadyExists("E-Mail already exists")
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

    async deleteByUuId(uuid:string){
        const result = await this.collection.deleteOne({ uuid: String(uuid) },{writeConcern: {w: 1, j: true}})
        if (result.deletedCount == 1 && result.acknowledged) {
            return true
        }
        else return false        
    }

    async getByUuId(uuid:string) : Promise<UserDataObject> {

        const cursor = this.collection.find({uuid : String(uuid)});

        while (await cursor.hasNext()) {
            let document = (await cursor.next() as UserDataObject);
            document.password = passwordMask
            document.salt = ""
            return document
        }

        return new UserDataObject()
    }

    async getByEmailAndPassword(email:string,password:string) : Promise<UserDataObject> {

        let user = await this.getByEmail(String(email))
        if (user.salt==="") {
            return new UserDataObject()
        }
        else{

            if (await argon2.verify(user.password,String(password)+user.salt)) {
                user.password = passwordMask
                user.salt = ""
                return user
            }

        }
        return new UserDataObject()

    }
    async getByEmail(email:string) : Promise<UserDataObject> {

        const cursor = this.collection.find({email:String(email)});
        while (await cursor.hasNext()) {
            let document = (await cursor.next() as UserDataObject);
            return document
        }
        return new UserDataObject()
    }

    async getAll(filter:any={},limit=0,skip=0) : Promise<UserDataObject[]> {

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
                $sort: { email : 1 }
            },            
            {
                $project: {
                    _id: 1,
                    uuid: 1,
                    email: 1,
                    name: 1,
                    last_name: 1,
                    role_uuid:1
                },
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
        return (await cursor.toArray() as UserDataObject[])
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