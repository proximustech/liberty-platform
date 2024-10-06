import { env } from 'node:process';
import { MongoClient, ServerApiVersion } from 'mongodb';

export class MongoService {

    private client:MongoClient

    constructor(){
        // @ts-ignore
        this.client = new MongoClient(env.AUTHENTICATOR_USER_PASSWORD_PLUGIN_MONGO_URI, {
            //serverApi: {
            //    version: ServerApiVersion.v1,
            //    strict: true,
            //    deprecationErrors: true,
            //}
        });        
    }

    getMongoClient(){
        return this.client
    }

}