'use client';

import { useAuth } from '@/components/AuthProvider';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import AssignmentsPage from '@/components/AssignmentsPage';
import ClientOnly from '@/components/ClientOnly';

export default function Assignments() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === false) {
        return null;
    }

    return (
        <ClientOnly>
            <AuthenticatedLayout>
                <AssignmentsPage />
            </AuthenticatedLayout>
        </ClientOnly>
    );
}