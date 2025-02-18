import { Uuid } from "../services/utilities";

export class RouteService  {
    public static async setCsrfToken(viewVars:any,ctx:any){
        let csrfToken = Uuid.createMongoUuId()
        ctx.cookies.set("csrfToken",csrfToken)
        viewVars.csrfToken = csrfToken
    }
}