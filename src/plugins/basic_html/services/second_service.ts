import {ISecond} from "../interfaces/second_interface"

export class Second implements ISecond {
    data="second";
    secondMethod(){
        return this.data
    }
}