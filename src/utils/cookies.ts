/**
 * Cookie utility functions for managing browser cookies
 * Follows the same pattern as other utility files in the codebase
 */

export interface CookieOptions {
  path?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * Set a cookie with expiration and options
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until expiration
 * @param options - Optional cookie settings (path, secure, sameSite)
 */
export const setCookie = (
  name: string,
  value: string,
  days: number,
  options?: CookieOptions
): void => {
  // Return early for invalid inputs
  if (!name || !value) {
    return;
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=${options?.path || "/"}`;

  if (options?.secure) {
    cookieString += ";secure";
  }

  if (options?.sameSite) {
    cookieString += `;sameSite=${options.sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  if (!name) {
    return null;
  }

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
};

/**
 * Delete a cookie
 * @param name - Cookie name
 * @param path - Cookie path (defaults to "/")
 */
export const deleteCookie = (name: string, path: string = "/"): void => {
  if (!name) {
    return;
  }

  document.cookie = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};`;
};


