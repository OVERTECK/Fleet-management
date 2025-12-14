'use client';

import { useAuth } from '@/components/AuthProvider';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import CarsPage from '@/components/CarsPage';
import ClientOnly from '@/components/ClientOnly';

export default function Cars() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === false) {
        return null;
    }

    return (
        <ClientOnly>
            <AuthenticatedLayout>
                <CarsPage />
            </AuthenticatedLayout>
        </ClientOnly>
    );
}