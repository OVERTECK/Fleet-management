'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean | null;
    setIsAuthenticated: (auth: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Используем более надежный способ проверки токена
        const checkAuth = () => {
            const cookies = document.cookie;
            const tokenMatch = cookies.match(/token=([^;]+)/);
            const hasToken = !!tokenMatch && tokenMatch[1] !== '';
            setIsAuthenticated(hasToken);

            // Если пользователь не аутентифицирован и не на странице аутентификации - перенаправляем
            if (!hasToken && pathname !== '/auth') {
                router.push('/auth');
            }
        };

        checkAuth();
    }, [pathname, router]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
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