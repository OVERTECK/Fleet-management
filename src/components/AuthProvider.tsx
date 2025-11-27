// components/AuthProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean | null;
    setIsAuthenticated: (auth: boolean) => void;
    user: any | null;
    setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const cookies = document.cookie;
                const tokenMatch = cookies.match(/token=([^;]+)/);
                const hasToken = !!tokenMatch && tokenMatch[1] !== '';

                if (hasToken) {
                    // Если есть токен, пробуем получить данные пользователя
                    const userResponse = await fetch('http://localhost:8000/users/me', {
                        credentials: 'include'
                    });

                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setUser(userData);
                        setIsAuthenticated(true);

                        // Если на странице авторизации - редирект на поездки
                        if (pathname === '/auth') {
                            router.push('/trips');
                        }
                    } else {
                        // Токен невалидный
                        setIsAuthenticated(false);
                        if (pathname !== '/auth') {
                            router.push('/auth');
                        }
                    }
                } else {
                    // Нет токена
                    setIsAuthenticated(false);
                    if (pathname !== '/auth') {
                        router.push('/auth');
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setIsAuthenticated(false);
                if (pathname !== '/auth') {
                    router.push('/auth');
                }
            }
        };

        checkAuth();
    }, [pathname, router]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}