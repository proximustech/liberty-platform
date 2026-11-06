import { AuthorizerCasbinMongo as AuthorizerCasbin } from "./authorizer_casbin_mongo";
import { Logger } from "pino";

export abstract class GlobalServices  {
    
    static casbinAuthorizer: AuthorizerCasbin

    // FIX: Error: write EIO — every call to LoggerServiceFactory.create() opened a new
    // Worker Thread (pino-pretty uses thread-stream internally). Having multiple threads
    // writing to the same stdout in parallel increases the chance of file descriptor
    // collisions and EIO errors.
    static logger: Logger
    
}