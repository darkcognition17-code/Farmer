// Centralized Regular Expressions for validation and pattern matching across the application.
// This approach improves maintainability, reusability, and consistency of regex patterns.
// Regex for validating Indian mobile numbers. It expects a '+91' prefix followed by a space,
// then a 10-digit number starting with 6, 7, 8, or 9.
export const MOBILE_NUMBER_REGEX = /^\+91 [6-9]\d{9}$/;

// Regex to check if a password contains at least one digit (0-9).
export const PASSWORD_HAS_NUMBER_REGEX = /\d/;

// Regex to check if a password contains at least one uppercase letter (A-Z).
export const PASSWORD_HAS_UPPER_CASE_REGEX = /[A-Z]/;

// Regex to check if a password contains at least one special character.
// The allowed special characters are !@#$%^&*(),.?:{}|<>.
export const PASSWORD_HAS_SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
export const USERNAME_REGEX = /[^a-z0-9_]/g;
export const MOBILE_REGEX =/[^0-9]/g;
export const NAME_REGEX = /[^A-Za-z ]/g;
