import { Uuid } from "../services/utilities";

export class RouteService  {
    public static async setCsrfToken(ctx:any){
        ctx.cookies.set("csrfToken",Uuid.createMongoUuId(),{httpOnly:false})
    }
}