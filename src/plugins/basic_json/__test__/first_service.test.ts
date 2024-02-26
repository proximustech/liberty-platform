import { First } from "../services/first_service";

let firstService = new First()

describe("plugin: basic_json - first_service", () => {

    test('First property', () => {
        expect(firstService.data).toBe("first");
    });

})