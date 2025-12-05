'use client';

import { useAuth } from '@/components/AuthProvider';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import ClientOnly from '@/components/ClientOnly';
import ReportsPage from '@/components/ReportsPage';

export default function Reports() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === false) {
        return null;
    }

    return (
        <ClientOnly>
            <AuthenticatedLayout>
                <ReportsPage />
            </AuthenticatedLayout>
        </ClientOnly>
    );
}