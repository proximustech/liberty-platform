import { MongoService } from "./MongoService";
import { ObjectId,MongoClient,Db,Collection } from 'mongodb';
import { UserDataObject } from "../dataObjects/UserDataObject";
import { Uuid } from "../../../services/utilities";
const { createHash } = require('crypto');

export class UserService {
    
    private dataBaseName = "liberty_platform"
    private collectionName = "users"
    private mongoClient:MongoClient
    private mongoService:MongoService
    private dataBase:Db
    private collection:Collection
    private hashcycles:number = 1000

    constructor(){
        this.mongoService = new MongoService()
        this.mongoClient = this.mongoService.getMongoClient()
        this.dataBase = this.mongoClient.db(this.dataBaseName);
        this.collection = this.dataBase.collection(this.collectionName);
    }

    getNew(){
        let User = new UserDataObject()
        return User
    }

    async create(User:UserDataObject){
        User.uuid = Uuid.createMongoUuId()
        User._id = new ObjectId(User.uuid)

        for (let index = 0; index < this.hashcycles; index++) {
            User.password=createHash('sha256').update(User.password).digest('base64');
        }         
        
        const result = await this.collection.insertOne(User)
    }

    async updateOne(User:UserDataObject){
        User._id = new ObjectId(User.uuid)
        const result = await this.collection.replaceOne(
            {uuid: User.uuid }, 
            User,
            {upsert: false}
        )        
    }

    async deleteByUuId(UserUuId:string){
        const result = await this.collection.deleteOne({ uuid: UserUuId })
    }

    async getByUuId(uuid:string) : Promise<UserDataObject> {

        const cursor = this.collection.find({uuid : uuid});

        while (await cursor.hasNext()) {
            let document = (await cursor.next() as UserDataObject);
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
            document.password = ""
            return document
        }

        return new UserDataObject()
    }

    async getAll() : Promise<UserDataObject[]> {
        //await this.processTest()
        const cursor = this.collection.find({});
        return (await cursor.toArray() as UserDataObject[])
    }


}