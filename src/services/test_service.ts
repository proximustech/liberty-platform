import {ITest} from "../interfaces/test_interface"
import { TestDependence } from "./test_dependence_service";

export class Test implements ITest {
    testDependence: TestDependence;

    constructor(testDependence: TestDependence){
        this.testDependence = testDependence
    }

    testMethod(){
        return this.testDependence.data
    }
}