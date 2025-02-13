import {v4 as uuidv4} from 'uuid';
const pino = require('pino')

export abstract class Uuid  {
    
    static createMongoUuId(){
        /**
         * Returns a uuid v4 without "-" and only 24 characters log
         * This format is compatible with the mongo _id fields
         */
        return uuidv4().split("-").join("").substring(0,24)
    }
    
}
export abstract class Random  {
    
    static getRandomString(){
        return (Math.random()+1).toString(36).substring(2)
    }
    
}
export class PinoLogger  {
    
    public static create(){
        const logger = pino({
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true
                }
            }
        })
        return logger 
    }
    
}