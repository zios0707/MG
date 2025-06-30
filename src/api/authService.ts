// Authentication API service

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
  async signUp(accountId: string, password: string): Promise<any> {
    try {
      const response = await fetch('http://localhost:8081/users/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId: accountId, password: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },
  
  /**
   * Log in a user
   * @param accountId - User's username
   * @param password - User's password
   * @returns Promise with user data and token
   */
  async login(accountId: string, password: string): Promise<any> {
    try {
      const response = await fetch('http://localhost:8081/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId: accountId, password: password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Change user password
   * @param userId - User's ID
   * @param newPassword - New password
   * @returns Promise with success message
   */
  async changePassword(accountId: string, password: string): Promise<any> {
    try {
      const response = await fetch('http://localhost:8081/users/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId: accountId, password: password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password change failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }
};