// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            
            if (token && userData) {
                try {
                    // Verify token by fetching profile
                    const response = await authAPI.getProfile();
                    setUser(response.data);
                    
                    // Update stored user data if needed
                    localStorage.setItem('user', JSON.stringify(response.data));
                } catch (error) {
                    console.error('Auth verification failed:', error);
                    
                    // Only logout if token is invalid (401)
                    if (error.response?.status === 401) {
                        logout();
                    } else {
                        // For other errors (rate limit, network), keep the user logged in
                        // but set from localStorage
                        setUser(JSON.parse(userData));
                    }
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token, user: userData } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            toast({
                title: "✅ Login Successful",
                description: `Welcome back, ${userData.name}!`,
                variant: "default",
            });
            
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            
            let errorMessage = 'Login failed';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.status === 429) {
                errorMessage = 'Too many login attempts. Please wait a few minutes and try again.';
            }
            
            toast({
                title: "❌ Login Failed",
                description: errorMessage,
                variant: "destructive",
            });
            
            return { 
                success: false, 
                error: errorMessage 
            };
        }
    };

    const register = async (name, email, password, confirmPassword) => {
        try {
            const response = await authAPI.register({ name, email, password, confirmPassword });
            const { token, user: userData } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            toast({
                title: "✅ Registration Successful",
                description: `Welcome to CommuteGo, ${name}!`,
            });
            
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            
            let errorMessage = 'Registration failed';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.status === 429) {
                errorMessage = 'Too many attempts. Please wait a few minutes and try again.';
            }
            
            toast({
                title: "❌ Registration Failed",
                description: errorMessage,
                variant: "destructive",
            });
            
            return { 
                success: false, 
                error: errorMessage 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        
        toast({
            title: "👋 Logged Out",
            description: "You have been logged out successfully",
        });
        
        // Use navigate instead of direct window.location
        window.location.href = '/login';
    };

    const updateUser = (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const refreshToken = async () => {
        try {
            const response = await authAPI.refreshToken();
            const { token, user: userData } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            updateUser,
            refreshToken,
            isAdmin,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};