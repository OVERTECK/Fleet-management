'use client';

import { useAuth } from '@/components/AuthProvider';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import AnalyticsContent from '@/components/AnalyticsContent';
import ClientOnly from '@/components/ClientOnly';
import { Box, Alert } from '@mui/material';

export default function Analytics() {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated === false) {
        return null;
    }


    if (user?.roleId !== 3) {
        return (
            <ClientOnly>
                <AuthenticatedLayout>
                    <Box sx={{ p: 3 }}>
                        <Alert severity="error">
                            У вас нет доступа к этой странице. Требуемая роль: Администратор (roleId: 3).
                            Ваш roleId: {user?.roleId || 'не определен'}
                        </Alert>
                    </Box>
                </AuthenticatedLayout>
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <AuthenticatedLayout>
                <AnalyticsContent />
            </AuthenticatedLayout>
        </ClientOnly>
    );
}