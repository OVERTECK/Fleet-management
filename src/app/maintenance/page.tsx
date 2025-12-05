'use client';

import { useAuth } from '@/components/AuthProvider';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import ClientOnly from '@/components/ClientOnly';
import MaintenanceRecordsPage from '@/components/MaintenanceRecordsPage';

export default function Maintenance() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === false) {
        return null;
    }

    return (
        <ClientOnly>
            <AuthenticatedLayout>
                <MaintenanceRecordsPage />
            </AuthenticatedLayout>
        </ClientOnly>
    );
}