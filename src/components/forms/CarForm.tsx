'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    MenuItem,
    Grid as Grid,
} from '@mui/material';
import { Car } from '@/types';

interface CarFormProps {
    car?: Car | null;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const statusOptions = [
    { value: 'active', label: '🟢 Активный' },
    { value: 'maintenance', label: '🟡 На обслуживании' },
    { value: 'inactive', label: '🔴 Неактивный' },
];

export default function CarForm({ car, onSubmit, onCancel }: CarFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm();

    // Получаем текущее значение статуса для отображения
    const currentStatus = watch('status');

    useEffect(() => {
        if (car) {
            // При редактировании - устанавливаем все значения из car
            reset({
                vin: car.vin || '',
                model: car.model || '',
                number: car.number || '',
                status: car.status || '', // Пустая строка если статуса нет
                totalKM: car.totalKM || 0
            });
        } else {
            // При создании новой машины - пустые значения
            reset({
                vin: '',
                model: '',
                number: '',
                status: '', // Пустая строка по умолчанию
                totalKM: 0
            });
        }
    }, [car, reset]);

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        label="VIN номер"
                        variant="outlined"
                        {...register('vin', {
                            required: 'VIN обязателен',
                            minLength: { value: 17, message: 'VIN должен содержать 17 символов' }
                        })}
                        error={!!errors.vin}
                        helperText={errors.vin?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Модель автомобиля"
                        variant="outlined"
                        {...register('model', { required: 'Модель обязательна' })}
                        error={!!errors.model}
                        helperText={errors.model?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Государственный номер"
                        variant="outlined"
                        {...register('number', { required: 'Госномер обязателен' })}
                        error={!!errors.number}
                        helperText={errors.number?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        select
                        label="Статус"
                        variant="outlined"
                        value={currentStatus || ''} // Управляемое значение
                        {...register('status', { required: 'Статус обязателен' })}
                        error={!!errors.status}
                        helperText={errors.status?.message as string}
                    >
                        {/* Пустой вариант для выбора */}
                        <MenuItem value="">
                            <em>Выберите статус</em>
                        </MenuItem>
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Пробег (км)"
                        variant="outlined"
                        {...register('totalKM', {
                            required: 'Пробег обязателен',
                            min: { value: 0, message: 'Пробег не может быть отрицательным' },
                            valueAsNumber: true,
                        })}
                        error={!!errors.totalKM}
                        helperText={errors.totalKM?.message as string}
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    disabled={isSubmitting}
                >
                    Отмена
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Сохранение...' : (car ? 'Обновить' : 'Создать')}
                </Button>
            </Box>
        </Box>
    );
}