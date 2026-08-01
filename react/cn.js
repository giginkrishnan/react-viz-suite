/**
 * Join class names, skipping falsy values.
 * @param {...(string | false | null | undefined)} parts
 * @returns {string}
 */
export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}
