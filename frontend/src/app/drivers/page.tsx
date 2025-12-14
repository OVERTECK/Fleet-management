'use client';

import { useAuth } from '@/components/AuthProvider';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import DriversPage from '@/components/DriversPage';
import ClientOnly from '@/components/ClientOnly';

export default function Drivers() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === false) {
        return null;
    }

    return (
        <ClientOnly>
            <AuthenticatedLayout>
                <DriversPage />
            </AuthenticatedLayout>
        </ClientOnly>
    );
}