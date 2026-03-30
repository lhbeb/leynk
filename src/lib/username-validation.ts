/**
 * Username validation and sanitization utilities
 * Ensures usernames are URL-safe and don't contain spaces or special characters
 */

// Allowed characters: lowercase letters, numbers, and underscores
const USERNAME_REGEX = /^[a-z0-9_]+$/;

// Minimum and maximum username length
const MIN_LENGTH = 1;
const MAX_LENGTH = 50;

/**
 * Sanitize username input by:
 * - Converting to lowercase
 * - Removing all invalid characters
 * - Trimming whitespace
 */
export function sanitizeUsername(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, ''); // Remove all characters that aren't lowercase letters, numbers, or underscores
}

/**
 * Validate username format
 * Returns an object with isValid flag and error message if invalid
 */
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  // Trim and check if empty
  const trimmed = username.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Username is required' };
  }

  // Check minimum length
  if (trimmed.length < MIN_LENGTH) {
    return { isValid: false, error: `Username must be at least ${MIN_LENGTH} character long` };
  }

  // Check maximum length
  if (trimmed.length > MAX_LENGTH) {
    return { isValid: false, error: `Username must be no more than ${MAX_LENGTH} characters long` };
  }

  // Check if it contains only allowed characters (lowercase)
  if (!USERNAME_REGEX.test(trimmed)) {
    return { 
      isValid: false, 
      error: 'Username can only contain lowercase letters, numbers, and underscores. No spaces or special characters allowed.' 
    };
  }

  // Check if it starts or ends with underscore
  if (trimmed.startsWith('_') || trimmed.endsWith('_')) {
    return { 
      isValid: false, 
      error: 'Username cannot start or end with an underscore' 
    };
  }

  // Check if it starts with a number (optional - you might want to allow this)
  // Uncomment if you want to disallow usernames starting with numbers
  // if (/^[0-9]/.test(trimmed)) {
  //   return { 
  //     isValid: false, 
  //     error: 'Username cannot start with a number' 
  //   };
  // }

  return { isValid: true };
}

/**
 * Normalize username for storage (sanitize and validate)
 * Throws error if username is invalid after sanitization
 */
export function normalizeUsername(input: string): string {
  const sanitized = sanitizeUsername(input);
  const validation = validateUsername(sanitized);
  
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid username');
  }
  
  return sanitized;
}

