import { IDisposable } from "../../../interfaces/disposable_interface";

import { MongoService } from "./MongoService";
import { ObjectId,MongoClient,Db,Collection } from 'mongodb';
import { UserDataObject,passwordMask } from "../dataObjects/UserDataObject";
import { Uuid } from "../../../services/utilities";
const { createHash } = require('crypto');


export class UserService implements IDisposable {
    
    private dataBaseName = "liberty_platform"
    private collectionName = "users"
    private mongoClient:MongoClient
    private mongoService:MongoService
    private dataBase:Db
    private collection:Collection
    private hashcycles:number = 100

    constructor(){
        this.mongoService = new MongoService()
        this.mongoClient = this.mongoService.getMongoClient()
        this.dataBase = this.mongoClient.db(this.dataBaseName);
        this.collection = this.dataBase.collection(this.collectionName);
    }

    getNew(){
        let user = new UserDataObject()
        return user
    }

    async create(user:UserDataObject){
        user.uuid = Uuid.createMongoUuId()
        user._id = new ObjectId(user.uuid)

        for (let index = 0; index < this.hashcycles; index++) {
            user.password=createHash('sha256').update(user.password).digest('base64');
        }         
        
        const result = await this.collection.insertOne(user,{writeConcern: {w: 1, j: true}})

        if (result.insertedId == user._id && result.acknowledged) {
            return user.uuid
        }
        else return "false"

    }

    async updateOne(user:UserDataObject){
        user._id = new ObjectId(user.uuid)
        if (user.password===passwordMask) {
            const cursor = this.collection.find({uuid : user.uuid});

            while (await cursor.hasNext()) {
                let document = (await cursor.next() as UserDataObject);
                user.password = document.password
            }            
            
        }
        else {
            for (let index = 0; index < this.hashcycles; index++) {
                user.password=createHash('sha256').update(user.password).digest('base64');
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
            return document
        }

        return new UserDataObject()
    }

    async getByEmailAndPassword(email:string,password:string) : Promise<UserDataObject> {

        for (let index = 0; index < this.hashcycles; index++) {
            password=createHash('sha256').update(password).digest('base64');
        }
        const cursor = this.collection.find({email:email, password:password});

        while (await cursor.hasNext()) {
            let document = (await cursor.next() as UserDataObject);
            document.password = passwordMask
            return document
        }

        return new UserDataObject()
    }

    async getAll() : Promise<UserDataObject[]> {
        const cursor = this.collection.find({});
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