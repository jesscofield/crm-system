import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const API_URL = 'http://localhost:8080/api/auth';

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { token, email: userEmail, username } = response.data;
            
            localStorage.setItem('token', token);
            setToken(token);
            setUser({ email: userEmail, username });
            
            toast.success('Login successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            // Send only the fields your backend expects
            const payload = {
                email: userData.email,
                fullName: userData.fullName,
                password: userData.password,
                phone: userData.phone,
                address: userData.address
            };
            
            // Store userType in localStorage for future use
            if (userData.userType) {
                localStorage.setItem('userType', userData.userType);
                if (userData.userType === 'company') {
                    localStorage.setItem('companyName', userData.companyName || '');
                    localStorage.setItem('employeeCount', userData.employeeCount || '');
                }
            }
            
            await axios.post(`${API_URL}/register`, payload);
            toast.success('Registration successful! Please login.');
            return true;
        } catch (error) {
            toast.error(error.response?.data || 'Registration failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('companyName');
        localStorage.removeItem('employeeCount');
        setToken(null);
        setUser(null);
        toast.info('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, token }}>
            {children}
        </AuthContext.Provider>
    );
};