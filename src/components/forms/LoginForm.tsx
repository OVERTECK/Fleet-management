'use client';

import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import { usersService } from '@/services/usersService';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export default function LoginForm({ onSuccess, onError }: LoginFormProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { login } = useAuth();
    const router = useRouter();

    const onSubmit = async (data: any) => {
        try {
            console.log('Login attempt:', data);

            const user = await usersService.login({
                login: data.login,
                password: data.password,
            });

            console.log('Login successful, user:', user);

            // Обновляем контекст
            login(user);

            onSuccess('Вход выполнен успешно!');

            // Немедленный редирект
            router.push('/dashboard');

        } catch (error: any) {
            console.error('Login error:', error);
            onError(error.response?.data?.message || 'Ошибка входа');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Вход в систему
            </Typography>

            <TextField
                margin="normal"
                required
                fullWidth
                label="Логин"
                {...register('login', { required: 'Логин обязателен' })}
                error={!!errors.login}
                helperText={errors.login?.message as string}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                label="Пароль"
                type="password"
                {...register('password', { required: 'Пароль обязателен' })}
                error={!!errors.password}
                helperText={errors.password?.message as string}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Вход...' : 'Войти'}
            </Button>
        </Box>
    );
}