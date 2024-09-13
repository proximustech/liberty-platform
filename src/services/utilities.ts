import {v4 as uuidv4} from 'uuid';

export abstract class Uuid  {
    
    static createMongoUuId(){
        /**
         * Returns a uuid v4 without "-" and only 24 characters log
         * This format is compatible with the mongo _id fields
         */
        return uuidv4().split("-").join("").substring(0,24)
    }
    
}