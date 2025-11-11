'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Grid as Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Refueling, Car } from '@/types';
import { carService } from '@/services/carService';

interface RefuelingFormProps {
    refueling?: Refueling | null;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function RefuelingForm({ refueling, onSubmit, onCancel }: RefuelingFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm();

    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        loadCars();
        if (refueling) {
            reset({
                ...refueling,
                date: refueling.date.split('T')[0],
            });
        } else {
            reset({
                carId: '',
                refilledLiters: 0,
                price: 0,
                date: new Date().toISOString().split('T')[0],
            });
        }
    }, [refueling, reset]);

    const loadCars = async () => {
        try {
            const carsData = await carService.getAll();
            setCars(carsData);
        } catch (error) {
            console.error('Error loading cars:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="car-select-label">Автомобиль</InputLabel>
                        <Select
                            labelId="car-select-label"
                            label="Автомобиль"
                            defaultValue={refueling?.carId || ''}
                            {...register('carId', { required: 'Выберите автомобиль' })}
                            error={!!errors.carId}
                        >
                            {cars.map((car) => (
                                <MenuItem key={car.vin} value={car.vin}>
                                    {car.model} ({car.number})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {errors.carId && (
                        <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                            {errors.carId.message as string}
                        </Box>
                    )}
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Дата заправки"
                        InputLabelProps={{ shrink: true }}
                        {...register('date', { required: 'Дата обязательна' })}
                        error={!!errors.date}
                        helperText={errors.date?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Количество литров"
                        {...register('refilledLiters', {
                            required: 'Количество литров обязательно',
                            min: { value: 1, message: 'Количество должно быть больше 0' },
                        })}
                        error={!!errors.refilledLiters}
                        helperText={errors.refilledLiters?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Стоимость (₽)"
                        {...register('price', {
                            required: 'Стоимость обязательна',
                            min: { value: 0, message: 'Стоимость не может быть отрицательной' },
                        })}
                        error={!!errors.price}
                        helperText={errors.price?.message as string}
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
                    {isSubmitting ? 'Сохранение...' : (refueling ? 'Обновить' : 'Создать')}
                </Button>
            </Box>
        </Box>
    );
}