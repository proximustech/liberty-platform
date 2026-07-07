import { TestDependence } from "../../services/test_dependence_service";

let testDependenceService = new TestDependence()

describe("Test Service", () => {

    test('Two asterisks', () => {
        expect(testDependenceService.data).toBe("**");
    });

})