'use client';

import { useAuth } from '@/components/AuthProvider';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import DashboardPage from '@/components/DashboardPage';
import ClientOnly from '@/components/ClientOnly';

export default function Dashboard() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === false) {
        return null;
    }

    return (
        <ClientOnly>
            <AuthenticatedLayout>
                <DashboardPage />
            </AuthenticatedLayout>
        </ClientOnly>
    );
}