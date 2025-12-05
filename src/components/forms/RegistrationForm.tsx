'use client';

import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import { usersService } from '@/services/usersService';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

interface RegistrationFormProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export default function RegistrationForm({ onSuccess, onError }: RegistrationFormProps) {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const { login } = useAuth();
    const router = useRouter();
    const password = watch('password');

    const onSubmit = async (data: any) => {
        try {
            console.log('Registration attempt:', data);

            const user = await usersService.register({
                login: data.login,
                password: data.password,
                roleId: Number(data.roleId),
            });

            console.log('Registration successful, user:', user);

            // Обновляем контекст
            login(user);

            onSuccess('Регистрация выполнена успешно!');

            // Немедленный редирект
            router.push('/dashboard');

        } catch (error: any) {
            console.error('Registration error:', error);
            onError(error.response?.data?.message || 'Ошибка регистрации');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Регистрация
            </Typography>

            <TextField
                margin="normal"
                required
                fullWidth
                label="Логин"
                {...register('login', {
                    required: 'Логин обязателен',
                    minLength: { value: 3, message: 'Минимум 3 символа' }
                })}
                error={!!errors.login}
                helperText={errors.login?.message as string}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                label="Пароль"
                type="password"
                {...register('password', {
                    required: 'Пароль обязателен',
                    minLength: { value: 6, message: 'Минимум 6 символов' }
                })}
                error={!!errors.password}
                helperText={errors.password?.message as string}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                label="Подтверждение пароля"
                type="password"
                {...register('confirmPassword', {
                    required: 'Подтвердите пароль',
                    validate: value => value === password || 'Пароли не совпадают'
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message as string}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                select
                label="Роль"
                defaultValue={2}
                {...register('roleId', { required: 'Выберите роль' })}
                error={!!errors.roleId}
                helperText={errors.roleId?.message as string}
            >
                <MenuItem value={1}>Водитель</MenuItem>
                <MenuItem value={2}>Диспетчер</MenuItem>
                <MenuItem value={3}>Администратор</MenuItem>
            </TextField>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
        </Box>
    );
}