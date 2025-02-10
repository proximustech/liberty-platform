import { RoleService } from "../services/RoleService";
import { RoleModel } from "../models/RoleModel";

export class RoleServiceFactory{

    public static create(prefix:string,userPermissions:any,roleModel = new RoleModel()): RoleService{

        return new RoleService(
            roleModel,
            prefix,
            userPermissions
        )

    }

}