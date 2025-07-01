import { CookieUtils } from "../utils/cookies";

// Simple API service for Nuha AI authentication
const API_NUHA_AI_LOGIN = 'https://nuha.ai:3000/api/v1/auths/signin';
const NUHA_AI_TOKEN_NAME = 'token';

// Simple API functions
export const ApiService = {
    // Sign in to Nuha AI
    async signInNuhaAI(email, password) {
        let obj = {
            "email": email,
            "password": password
        }
        try {
            const response = await fetch(API_NUHA_AI_LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            CookieUtils.setCookie(NUHA_AI_TOKEN_NAME, data.token, 7);

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get stored token
    getToken() {
        return CookieUtils.getCookie(NUHA_AI_TOKEN_NAME);
    },

    // Get stored user data
    getUser() {
        const userStr = CookieUtils.getCookie(NUHA_AI_TOKEN_NAME);
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },

    // Sign out
    signOut() {
        CookieUtils.deleteCookie(NUHA_AI_TOKEN_NAME);
        // CookieUtils.deleteCookie(NUHA_AI_TOKEN_NAME);
        return { success: true, message: 'Signed out successfully' };
    },

};

export default ApiService; 