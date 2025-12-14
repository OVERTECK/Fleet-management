'use client';

import { useAuth } from '@/components/AuthProvider';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import RefuelingPage from '@/components/RefuelingPage';
import ClientOnly from '@/components/ClientOnly';

export default function Refueling() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === false) {
        return null;
    }

    return (
        <ClientOnly>
            <AuthenticatedLayout>
                <RefuelingPage />
            </AuthenticatedLayout>
        </ClientOnly>
    );
}