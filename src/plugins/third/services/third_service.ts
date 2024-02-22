import {IThird} from "../interfaces/third_interface"

export class Third implements IThird {
    thirdMethod(param:string){
        return param
    }
}