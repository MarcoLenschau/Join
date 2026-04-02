const { checkSize, extractFileExtension, firstLetter, firstLetterBig, getAssignedToString } = require('../scripts/utils');

describe("Check Size Function", () => {
    it('Return the same dimensions if within maxWidth and maxHeight', () => {
        const result = checkSize(800, 600, 400, 300);
        expect(result).toEqual([400, 300]);
    });
    it('Return resized width and height proportionally when width exceeds maxWidth', () => {
        const result = checkSize(800, 600, 1600, 1200);
        expect(result).toEqual([800, 600]);
    });
    it('Return resized width and height proportionally when height exceeds maxHeight', () => {
        const result = checkSize(800, 600, 400, 1200);
        expect(result).toEqual([200, 600]);
    });
    it('Return resized width and height proportionally when both exceed maxWidth and maxHeight', () => {
        const result = checkSize(800, 600, 1600, 2400);
        expect(result).toEqual([400, 600]);
    });
    it('Return [0, 0] when width and height are zero', () => {
        const result = checkSize(800, 600, 0, 0);
        expect(result).toEqual([0, 0]);
    });
    it('Return [0, 0] when maxWidth and maxHeight are zero', () => {
        const result = checkSize(0, 0, 400, 300);
        expect(result).toEqual([0, 0]);
    });
});

describe("Extract file extension function", () => {
    it('Return the correct file extension for a given filename', () => {
        const result = extractFileExtension('example.txt');
        expect(result).toBe('txt');
    });
});

describe("Extract first letter function", () => {
    it('Return the first letter of a given string', () => {
        expect(firstLetter("Hello")).toBe("H");
    });
    it('Return the first letter of a given lowercase string', () => {
        expect(firstLetter("hello")).toBe("h");
    });
    it('Return undefined for an empty string', () => {
        expect(firstLetter("")).toBeUndefined();
    });
});

describe("Extract first big letter function", () => {
    it('Return the first letter of a given string', () => {
        expect(firstLetterBig("Hello")).toBe("H");
    });
    it('Return the first letter of a given lowercase string', () => {
        expect(firstLetterBig("hello")).toBe("H");
    });
    it('Return undefined for an empty string', () => {
        expect(firstLetterBig("")).toBeUndefined();
    });
});

describe("Get assigned to string function", () => {
    let assigned = ["Test", "Test2", "Test3", "Test4"];
    it('Return the assigned string with all elements and count', () => {
        expect(getAssignedToString(assigned)).toBe("TestTest2Test3Test4+0");
    });
    it('Return the assigned string after removing an element', () => {
        assigned.pop();
        expect(getAssignedToString(assigned)).toBe("TestTest2Test3+-1");
    });
    it('Return the assigned string after adding an element', () => {
        assigned.push("Test5");
        expect(getAssignedToString(assigned)).toBe("TestTest2Test3Test5+0");
    });
    it('Return the assigned string after adding multiple elements', () => {
        assigned.push("Test5");
        assigned.push("Test6");
        expect(getAssignedToString(assigned)).toBe("TestTest2Test3Test5+2");
    });
    it('Return the assigned string for an empty array', () => {
        expect(getAssignedToString([])).toBe("+-4");
    });
});