import { cookies } from 'next/headers';
import { AuthProvider } from '@/components/AuthProvider';

async function serverLogout(): Promise<{ success: boolean; error?: string }> {
    'use server';

    try {
        const cookieStore = await cookies();
        cookieStore.delete('token');

        console.log('Server: token cookie deleted successfully');
        return { success: true };
    } catch (error) {
        console.error('Server logout error:', error);
        return { success: false, error: 'Ошибка выхода на сервере' };
    }
}

export async function AuthProviderServerWrapper({
    children
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    const hasToken = !!tokenCookie?.value;

    console.log('Server wrapper - token exists:', hasToken);

    return (
        <AuthProvider
            initialHasToken={hasToken}
            serverLogout={serverLogout}
        >
            {children}
        </AuthProvider>
    );
}