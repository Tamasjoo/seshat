import { formatData } from "./helpers";

//test cases

describe("formatData", () => {
    it("should return an empty array if no documents are provided", () => {
        expect(
            formatData([
                { size: 5, timeCreated: "2020-12-01T13:30:30.770Z" },
                { size: 5345634563, timeCreated: "2020-12-01T13:27:36.261Z" },
            ])
        ).toBe([]);
    });
    it("should be something else", () => {
        expect(formatData([])).toBe([]);
    });
});
