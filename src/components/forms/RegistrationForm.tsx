'use client';

import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { usersService } from '@/services/usersService';
import { useRouter } from 'next/navigation';

interface RegistrationFormProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

interface RegistrationFormData {
    login: string;
    password: string;
    confirmPassword: string;
    roleId: number;
}

export default function RegistrationForm({ onSuccess, onError }: RegistrationFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<RegistrationFormData>();
    const router = useRouter();

    const password = watch('password');

    const onSubmit = async (data: RegistrationFormData) => {
        try {
            await usersService.register({
                login: data.login,
                password: data.password,
                roleId: data.roleId
            });
            onSuccess('Регистрация выполнена успешно!');
            // Перенаправляем на дашборд
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (error: any) {
            const errorMessage = error.response?.data || 'Ошибка регистрации';
            onError(typeof errorMessage === 'string' ? errorMessage : 'Неизвестная ошибка');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
                Регистрация
            </Typography>

            <TextField
                margin="normal"
                required
                fullWidth
                label="Логин"
                autoComplete="username"
                autoFocus
                {...register('login', {
                    required: 'Логин обязателен',
                    minLength: { value: 3, message: 'Логин должен содержать минимум 3 символа' }
                })}
                error={!!errors.login}
                helperText={errors.login?.message}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                label="Пароль"
                type="password"
                autoComplete="new-password"
                {...register('password', {
                    required: 'Пароль обязателен',
                    minLength: { value: 6, message: 'Пароль должен содержать минимум 6 символов' }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                label="Подтверждение пароля"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword', {
                    required: 'Подтвердите пароль',
                    validate: value => value === password || 'Пароли не совпадают'
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
            />

            <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Роль</InputLabel>
                <Select
                    labelId="role-label"
                    label="Роль"
                    defaultValue={2}
                    {...register('roleId', { required: 'Выберите роль', valueAsNumber: true })}
                    error={!!errors.roleId}
                >
                    <MenuItem value={1}>Администратор</MenuItem>
                    <MenuItem value={2}>Диспетчер</MenuItem>
                    <MenuItem value={3}>Водитель</MenuItem>
                </Select>
            </FormControl>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
        </Box>
    );
}