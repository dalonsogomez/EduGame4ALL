import api from './api';

// Description: Login user functionality
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: User fields spread at root level + { accessToken: string, refreshToken: string }
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  location?: string;
  nativeLanguage?: string;
  targetLanguage?: string;
  userType?: 'child' | 'adult' | 'educator';
};

// Description: Register user functionality
// Endpoint: POST /api/auth/register
// Request: { name: string, email: string, password: string, location?: string, nativeLanguage?: string, targetLanguage?: string, userType?: string }
// Response: { user: User, token: string, refreshToken: string }
export const register = async (data: RegisterData) => {
  try {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.response?.data?.error || error.message);
  }
};

// Description: Logout
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { success: boolean, message: string }
export const logout = async () => {
  try {
    return await api.post('/api/auth/logout');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
