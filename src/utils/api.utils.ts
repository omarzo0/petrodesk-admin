/**
 * Centralized API utilities for the application.
 */

export const getHeaders = (): Record<string, string> => {
    if (typeof window === 'undefined') {
        return { "Content-Type": "application/json" };
    }

    let token = localStorage.getItem("token");

    if (token) {
        // Clean up token: trim and remove wrapping quotes if they exist
        token = token.trim().replace(/^"(.*)"$/, '$1');
    }

    if (!token || token === "null" || token === "undefined") {
        return { "Content-Type": "application/json" };
    }

    const finalToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    return {
        "Content-Type": "application/json",
        "Authorization": finalToken
    };
};
