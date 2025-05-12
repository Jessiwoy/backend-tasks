import { isValidDeadlineFormat } from "../../src/utils/isValidDeadlineFormat";
import { describe, expect, it } from "@jest/globals";

describe("isValidDeadlineFormat", () => {
  it("should return true for valid deadline formats", () => {
    expect(isValidDeadlineFormat("01/10/2023")).toBe(true); // DD/MM/YYYY
    expect(isValidDeadlineFormat("31/12/2023")).toBe(true); // Valid end of year date
  });

  it("should return false for invalid deadline formats", () => {
    expect(isValidDeadlineFormat("2023/10/01")).toBe(false); // YYYY/MM/DD
    expect(isValidDeadlineFormat("10-01-2023")).toBe(false); // MM-DD-YYYY
    expect(isValidDeadlineFormat("01.10.2023")).toBe(false); // DD.MM.YYYY
    expect(isValidDeadlineFormat("01/13/2023")).toBe(false); // Invalid month
    expect(isValidDeadlineFormat("32/12/2023")).toBe(false); // Invalid day
    expect(isValidDeadlineFormat("")).toBe(false); // Empty string
    expect(isValidDeadlineFormat("01/10/23")).toBe(false); // Two-digit year
  });

  it("should return false for non-date strings", () => {
    expect(isValidDeadlineFormat("deadline")).toBe(false); // Random string
    expect(isValidDeadlineFormat("12345678")).toBe(false); // Numeric string
    expect(isValidDeadlineFormat("01/10/abcd")).toBe(false); // Invalid year
  });

  it("should return false for null or undefined input", () => {
    expect(isValidDeadlineFormat(null as unknown as string)).toBe(false);
    expect(isValidDeadlineFormat(undefined as unknown as string)).toBe(false);
  });
});
