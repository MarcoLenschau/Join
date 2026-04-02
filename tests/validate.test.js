const { isValidUser, isValidEmail, isValidPassword } = require("../scripts/validate");

describe("Check user validation", () => {
    it("Return true for valid username", () => {
        expect(isValidUser("John")).toBe(true);
    });

    it("Return false for username with length 1", () => {
        expect(isValidUser("J")).toBe(false);
    });

    it("Return false for empty username", () => {
        expect(isValidUser("")).toBe(false);
    });
});

describe("Check email validation", () => {
    it("Return true for valid email", () => {
        expect(isValidEmail("john@example.com")).toBe(true);
    });

    it("Return false for invalid email", () => {
        expect(isValidEmail("john")).toBe(false);
    });

    it("Return false for empty email", () => {
        expect(isValidEmail("")).toBe(false);
    });
});

describe("Check password validation", () => {
    it("Return true for valid password", () => {
        expect(isValidPassword("password123")).toBe(true);
    });

    it("Return false for invalid password", () => {
        expect(isValidPassword("pass")).toBe(false);
    });

    it("Return false for empty password", () => {
        expect(isValidPassword("")).toBe(false);
    });
});