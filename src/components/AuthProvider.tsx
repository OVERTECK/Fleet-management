'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usersService, User } from '@/services/usersService';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
}

interface AuthProviderProps {
    children: ReactNode;
    initialHasToken: boolean;
    serverLogout: () => Promise<{ success: boolean; error?: string }>;
}

export function AuthProvider({
    children,
    initialHasToken,
    serverLogout
}: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(initialHasToken);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const login = (userData: User) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            console.log('Starting logout process...');
            const result = await serverLogout();
            console.log('Server logout result:', result);

            if (!result.success) {
                console.warn('Server logout failed, but continuing with client cleanup');
            }

            console.log('Clearing localStorage...');
            localStorage.removeItem('currentUser');

            console.log('Resetting auth state...');
            setIsAuthenticated(false);
            setUser(null);

            console.log('Redirecting to auth page...');
            router.push('/auth');

            console.log('Logout completed successfully');

        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('currentUser');
            setIsAuthenticated(false);
            setUser(null);
            router.push('/auth');
        }
    };

    const checkAuth = async (): Promise<boolean> => {
        try {
            const userData = await usersService.getCurrentUser();
            if (userData) {
                setIsAuthenticated(true);
                setUser(userData);
                return true;
            }
        } catch (error) {
            console.log('User not authenticated:', error);
        }

        setIsAuthenticated(false);
        setUser(null);
        return false;
    };

    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true);
            if (initialHasToken) {
                await checkAuth();
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated && pathname === '/auth') {
                router.push('/dashboard');
            } else if (!isAuthenticated && pathname !== '/auth' && pathname !== '/') {
                router.push('/auth');
            }
        }
    }, [isAuthenticated, isLoading, pathname]);

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Загрузка...
            </div>
        );
    }

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);