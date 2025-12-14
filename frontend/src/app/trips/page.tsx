'use client';

import { useAuth } from '@/components/AuthProvider';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import TripsPage from '@/components/TripsPage';
import ClientOnly from '@/components/ClientOnly';

export default function Trips() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === false) {
        return null;
    }

    return (
        <ClientOnly>
            <AuthenticatedLayout>
                <TripsPage />
            </AuthenticatedLayout>
        </ClientOnly>
    );
}