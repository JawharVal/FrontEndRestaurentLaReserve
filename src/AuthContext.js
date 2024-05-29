import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Token received:", data.token);
                setToken(data.token);
            } else {
                throw new Error(data.message || "Unable to login");
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const setToken = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);

        setCurrentUser({
            ...currentUser,
            id: decoded.userId,
            role: decoded.role
        });
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                setToken(token);
            } catch (error) {
                console.error("Error decoding token: ", error);
            }
        } else {
            setCurrentUser(null);
        }
        setLoading(false);
    }, []);

    const value = {
        currentUser,
        login,
        logout,
        setToken,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};