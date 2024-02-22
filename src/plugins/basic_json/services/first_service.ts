import {IFirst} from "../interfaces/first_interface"

export class First implements IFirst {
    data="first";
    firstMethod(){
        return this.data
    }
}