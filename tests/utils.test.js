const { checkSize, extractFileExtension } = require('../scripts/utils');

describe("Check Size Function", () => {
    test('should return the same dimensions if within maxWidth and maxHeight', () => {
        const result = checkSize(800, 600, 400, 300);
        expect(result).toEqual([400, 300]);
    });

    test('should resize width and height proportionally when width exceeds maxWidth', () => {
        const result = checkSize(800, 600, 1600, 1200);
        expect(result).toEqual([800, 600]);
    });

    test('should resize width and height proportionally when height exceeds maxHeight', () => {
        const result = checkSize(800, 600, 400, 1200);
        expect(result).toEqual([200, 600]);
    });

    test('should resize width and height proportionally when both exceed maxWidth and maxHeight', () => {
        const result = checkSize(800, 600, 1600, 2400);
        expect(result).toEqual([400, 600]);
    });

    test('should handle edge case where width and height are zero', () => {
        const result = checkSize(800, 600, 0, 0);
        expect(result).toEqual([0, 0]);
    });

    test('should handle edge case where maxWidth and maxHeight are zero', () => {
        const result = checkSize(0, 0, 400, 300);
        expect(result).toEqual([0, 0]);
    });
});

describe("Extract file extension function", () => {
    test('should return the correct file extension for a given filename', () => {
        const result = extractFileExtension('example.txt');
        expect(result).toBe('txt');
    });
});