import { IDisposable } from "../../../interfaces/disposable_interface";

import { MongoService } from "../services/MongoService";
import { ObjectId,MongoClient,Db,Collection } from 'mongodb';
import { UserDataObject,passwordMask } from "../dataObjects/UserDataObject";
import { Uuid,Random } from "../../../services/utilities";
const { createHash } = require('crypto');


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
        user.password=createHash('sha256').update(user.password+user.salt).digest('base64');

        const result = await this.collection.insertOne(user,{writeConcern: {w: 1, j: true}})

        if (result.insertedId == user._id && result.acknowledged) {
            return user.uuid
        }
        else return "false"

    }

    async updateOne(user:UserDataObject){
        user._id = new ObjectId(user.uuid)
        const cursor = this.collection.find({uuid : user.uuid});

        while (await cursor.hasNext()) {
            let document = (await cursor.next() as UserDataObject);
            user.salt = document.salt
            if (user.password===passwordMask) {
                user.password = document.password
            }
            else {
                user.salt = Random.getRandomString()
                user.password=createHash('sha256').update(user.password+user.salt).digest('base64');
            }
        }
        const result = await this.collection.replaceOne(
            {uuid: user.uuid }, 
            user,
            {upsert: false,writeConcern: {w: 1, j: true}}
        )

        if (result.acknowledged && result.matchedCount == 1 ) {
            return true
        }
        else return false

    }

    async deleteByUuId(UserUuId:string){
        const result = await this.collection.deleteOne({ uuid: UserUuId },{writeConcern: {w: 1, j: true}})
        if (result.deletedCount == 1 && result.acknowledged) {
            return true
        }
        else return false        
    }

    async getByUuId(uuid:string) : Promise<UserDataObject> {

        const cursor = this.collection.find({uuid : uuid});

        while (await cursor.hasNext()) {
            let document = (await cursor.next() as UserDataObject);
            document.password = passwordMask
            document.salt = ""
            return document
        }

        return new UserDataObject()
    }

    async getByEmailAndPassword(email:string,password:string) : Promise<UserDataObject> {

        let user = await this.getByEmail(email)
        if (user.salt==="") {
            return new UserDataObject()
        }
        else{
            password=createHash('sha256').update(password+user.salt).digest('base64');
            const cursor = this.collection.find({email:email, password:password});
            
            while (await cursor.hasNext()) {
                let document = (await cursor.next() as UserDataObject);
                document.password = passwordMask
                document.salt = ""
                return document
            }
            return new UserDataObject()
        }

    }
    private async getByEmail(email:string) : Promise<UserDataObject> {

        const cursor = this.collection.find({email:email});
        while (await cursor.hasNext()) {
            let document = (await cursor.next() as UserDataObject);
            return document
        }
        return new UserDataObject()
    }

    async getAll() : Promise<UserDataObject[]> {

        const pipeline = [
            { 
                $match: {} 
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

        const cursor = this.collection.aggregate(pipeline);
        return (await cursor.toArray() as UserDataObject[])
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