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

        // FIX: Error: write EIO — pino-pretty transport spawns a Worker Thread that
        // writes to stdout via sonic-boom (async batched writes).
        // When stdout closes (e.g. broken pipe in Docker, SSH session dropped,
        // ts-node-dev restarting the process), sonic-boom emits an 'EIO' or 'EPIPE'
        // error to the main thread's stream (thread-stream).
        // Without this listener, Node.js raises that error as an uncaughtException
        // and kills the process. The fix: catch the error on the stream and silently
        // ignore expected I/O codes; anything else is re-thrown to avoid hiding real failures.
        const stream: any = (logger as any)[Symbol.for('pino.stream')]
        if (stream && typeof stream.on === 'function') {
            stream.on('error', (err: any) => {
                if (!['EIO', 'EPIPE', 'ECONNRESET'].includes(err?.code)) throw err
            })
        }
        return logger 
    }
    
}