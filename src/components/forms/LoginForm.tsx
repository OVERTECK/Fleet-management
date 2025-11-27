'use client';

import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Typography,
} from '@mui/material';
import { usersService } from '@/services/usersService';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

interface LoginFormData {
    login: string;
    password: string;
}

export default function LoginForm({ onSuccess, onError }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>();
    const router = useRouter();

    const onSubmit = async (data: LoginFormData) => {
        try {
            await usersService.login(data);
            onSuccess('Вход выполнен успешно!');
            // Перенаправляем на дашборд
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (error: any) {
            const errorMessage = error.response?.data || 'Ошибка входа';
            onError(typeof errorMessage === 'string' ? errorMessage : 'Неизвестная ошибка');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
                Вход в систему
            </Typography>

            <TextField
                margin="normal"
                required
                fullWidth
                label="Логин"
                autoComplete="username"
                autoFocus
                {...register('login', { required: 'Логин обязателен' })}
                error={!!errors.login}
                helperText={errors.login?.message}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                label="Пароль"
                type="password"
                autoComplete="current-password"
                {...register('password', { required: 'Пароль обязателен' })}
                error={!!errors.password}
                helperText={errors.password?.message}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Вход...' : 'Войти'}
            </Button>
        </Box>
    );
}