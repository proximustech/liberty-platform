import { PinoLogger } from "../services/utilities";
import { Logger } from "pino";

export class LoggerServiceFactory{

    public static create(logger = PinoLogger.create()): Logger{
        return logger
    }

}