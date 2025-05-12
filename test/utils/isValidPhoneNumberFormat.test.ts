import { isValidPhoneNumberFormat } from "../../src/utils/isValidPhoneNumberFormat";
import { describe, expect, it } from "@jest/globals";

describe("isValidPhoneNumberFormat", () => {
  describe("should return true for valid phone numbers", () => {
    it("Should Valid São Paulo number", () => {
      expect(isValidPhoneNumberFormat("11912345678")).toBe(true);
    });

    it("Should valid Rio de Janeiro number", () => {
      expect(isValidPhoneNumberFormat("21987654321")).toBe(true);
    });
  });

  describe("should return false for invalid phone numbers", () => {
    it("Should not be short than 11 digits", () => {
      expect(isValidPhoneNumberFormat("123456789")).toBe(false);
    });
    it("Should not missing the nine digit", () => {
      expect(isValidPhoneNumberFormat("1191234567")).toBe(false);
    });
    it("It should not be longer than 11 digits", () => {
      expect(isValidPhoneNumberFormat("119123456789")).toBe(false);
    });

    it("Should not be text", () => {
      expect(isValidPhoneNumberFormat("abcdefghijk")).toBe(false);
    });

    it("Should not be special characters", () => {
      expect(isValidPhoneNumberFormat("1191234567@")).toBe(false);
    });
    it("Should not be a mix of numbers and letters", () => {
      expect(isValidPhoneNumberFormat("1191234567a")).toBe(false);
    });
  });

  describe("should return false for null or undefined input", () => {
    it("should return false for null input", () => {
      expect(isValidPhoneNumberFormat(null as unknown as string)).toBe(false);
    });
    it("should return false for undefined input", () => {
      expect(isValidPhoneNumberFormat(undefined as unknown as string)).toBe(
        false
      );
    });
  });

  it("should return false for empty string", () => {
    expect(isValidPhoneNumberFormat("")).toBe(false);
  });
});
