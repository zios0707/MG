// Authentication API service
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * API service for authentication-related requests
 */
export const authService = {
    /**
     * Sign up a new user
     * @param accountId - User's username
     * @param password - User's password
     * @returns Promise with user data
     */
    signUp(accountId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost:8081/users/signUp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ accountId: accountId, password: password }),
                });
                if (!response.ok) {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Sign up failed');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Sign up error:', error);
                throw error;
            }
        });
    },
    /**
     * Log in a user
     * @param accountId - User's username
     * @param password - User's password
     * @returns Promise with user data and token
     */
    login(accountId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost:8081/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ accountId: accountId, password: password }),
                });
                if (!response.ok) {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Login failed');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        });
    },
    /**
     * Change user password
     * @param userId - User's ID
     * @param newPassword - New password
     * @returns Promise with success message
     */
    changePassword(accountId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost:8081/users/password', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ accountId: accountId, password: password }),
                });
                if (!response.ok) {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Password change failed');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Password change error:', error);
                throw error;
            }
        });
    }
};
//# sourceMappingURL=authService.js.map