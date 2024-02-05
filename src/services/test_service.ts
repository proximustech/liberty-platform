import { autoInjectable } from "tsyringe";
import {ITest} from "../interfaces/test_interface"
import { TestDependence } from "./test_dependence_service";

@autoInjectable()
export class Test implements ITest {
    testDependence: TestDependence;

    constructor(testDependence: TestDependence){
        this.testDependence = testDependence
    }

    testMethod(){
        return this.testDependence.data
    }
}