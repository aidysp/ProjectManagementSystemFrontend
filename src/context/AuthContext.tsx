import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('pms_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState<string | null>(localStorage.getItem('pms_token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem('pms_token');
            if (storedToken) {
                try {
                    const response = await authAPI.getMe();
                    setUser(response.data.data);
                    localStorage.setItem('pms_user', JSON.stringify(response.data.data));
                } catch (error) {
                    console.error('Failed to load user:', error);
                    localStorage.removeItem('pms_token');
                    localStorage.removeItem('pms_user');
                    setToken(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    const login = (newToken: string, userData: User) => {
        localStorage.setItem('pms_token', newToken);
        localStorage.setItem('pms_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('pms_token');
        localStorage.removeItem('pms_user');
        setToken(null);
        setUser(null);
    };

    const updateUser = (userData: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            const updatedUser = { ...prev, ...userData };
            localStorage.setItem('pms_user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoading,
            login,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};