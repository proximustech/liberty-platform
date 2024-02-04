import {ITest} from "../interfaces/test_interface"

export class Test implements ITest {
    data="";
    testMethod(){
        return "**"
    }
}