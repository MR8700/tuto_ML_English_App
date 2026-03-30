/**
 * Strict input validation for authentication form
 */

export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

export function validateFirstName(value: string): string | undefined {
  if (!value || value.trim().length < 2) {
    return 'First name must be at least 2 characters';
  }
  if (value.trim().length > 50) {
    return 'First name must be at most 50 characters';
  }
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
    return 'First name contains invalid characters';
  }
  return undefined;
}

export function validateLastName(value: string): string | undefined {
  if (!value || value.trim().length < 2) {
    return 'Last name must be at least 2 characters';
  }
  if (value.trim().length > 50) {
    return 'Last name must be at most 50 characters';
  }
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
    return 'Last name contains invalid characters';
  }
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  
  // Must be a Gmail address
  if (!trimmed.endsWith('@gmail.com')) {
    return 'Email must be a valid Gmail address (@gmail.com)';
  }
  
  // Standard email regex for Gmail format
  const emailRegex = /^[^\s@]+@gmail\.com$/;
  if (!emailRegex.test(trimmed)) {
    return 'Invalid Gmail address format';
  }
  
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) {
    return 'Password is required';
  }
  
  // Check minimum length
  if (value.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  // Check for spaces
  if (/\s/.test(value)) {
    return 'Password cannot contain spaces';
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(value)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(value)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  // Check for digit
  if (!/\d/.test(value)) {
    return 'Password must contain at least one digit';
  }
  
  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    return 'Password must contain at least one special character (!@#$%^&*...)';
  }
  
  return undefined;
}

export function validatePasswordConfirm(password: string, confirm: string): string | undefined {
  if (password !== confirm) {
    return 'Passwords do not match';
  }
  return undefined;
}

export function validateAuthForm(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordConfirm: string
): ValidationErrors {
  const errors: ValidationErrors = {};
  
  const firstNameError = validateFirstName(firstName);
  if (firstNameError) errors.firstName = firstNameError;
  
  const lastNameError = validateLastName(lastName);
  if (lastNameError) errors.lastName = lastNameError;
  
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  
  if (!passwordError) {
    const confirmError = validatePasswordConfirm(password, passwordConfirm);
    if (confirmError) errors.passwordConfirm = confirmError;
  }
  
  return errors;
}

export function isAuthFormValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}
