import { formatData } from "./helpers";

describe("formatData", () => {
    it("should return an empty array if no documents are provided", () => {
        expect(
            formatData([
                {
                    name: "New test - Copy (9).pdf",
                    size: 9842,
                    timeCreated: "2020-12-01T13:31:16.346Z",
                },
            ])
        ).toBe([
            {
                name: "New test - Copy (9).pdf",
                size: "9.61 KB",
                timeCreated: "12/1/2020, 2:31:16 PM",
            },
        ]);
    });
    it("should return an empty array if no documents are provided", () => {
        expect(formatData([{}])).toBe(null);
    });
});
