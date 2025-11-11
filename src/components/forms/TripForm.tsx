'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    MenuItem,
    Grid as Grid,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import { Trip, Car, Driver } from '@/types';
import { carService } from '@/services/carService';
import { driverService } from '@/services/driverService';

interface TripFormProps {
    trip?: Trip | null;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function TripForm({ trip, onSubmit, onCancel }: TripFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm();

    const [cars, setCars] = useState<Car[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    useEffect(() => {
        loadCarsAndDrivers();
        if (trip) {
            reset({
                ...trip,
                timeStart: trip.timeStart.split('T')[0],
                timeEnd: trip.timeEnd.split('T')[0],
            });
        } else {
            reset({
                carId: '',
                driverId: '',
                timeStart: new Date().toISOString().split('T')[0],
                timeEnd: new Date().toISOString().split('T')[0],
                traveledKM: 0,
                consumptionLitersFuel: 0,
            });
        }
    }, [trip, reset]);

    const loadCarsAndDrivers = async () => {
        try {
            const [carsData, driversData] = await Promise.all([
                carService.getAll(),
                driverService.getAll()
            ]);
            setCars(carsData);
            setDrivers(driversData);
        } catch (error) {
            console.error('Error loading data:', error);
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
                            defaultValue={trip?.carId || ''}
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
                    <FormControl fullWidth>
                        <InputLabel id="driver-select-label">Водитель</InputLabel>
                        <Select
                            labelId="driver-select-label"
                            label="Водитель"
                            defaultValue={trip?.driverId || ''}
                            {...register('driverId', { required: 'Выберите водителя' })}
                            error={!!errors.driverId}
                        >
                            {drivers.map((driver) => (
                                <MenuItem key={driver.id} value={driver.id}>
                                    {driver.lastName} {driver.name} {driver.patronymic}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {errors.driverId && (
                        <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                            {errors.driverId.message as string}
                        </Box>
                    )}
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="datetime-local"
                        label="Время начала"
                        InputLabelProps={{ shrink: true }}
                        {...register('timeStart', { required: 'Время начала обязательно' })}
                        error={!!errors.timeStart}
                        helperText={errors.timeStart?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="datetime-local"
                        label="Время окончания"
                        InputLabelProps={{ shrink: true }}
                        {...register('timeEnd', { required: 'Время окончания обязательно' })}
                        error={!!errors.timeEnd}
                        helperText={errors.timeEnd?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Пробег (км)"
                        {...register('traveledKM', {
                            required: 'Пробег обязателен',
                            min: { value: 1, message: 'Пробег должен быть больше 0' },
                        })}
                        error={!!errors.traveledKM}
                        helperText={errors.traveledKM?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Расход топлива (л)"
                        {...register('consumptionLitersFuel', {
                            required: 'Расход топлива обязателен',
                            min: { value: 0, message: 'Расход не может быть отрицательным' },
                        })}
                        error={!!errors.consumptionLitersFuel}
                        helperText={errors.consumptionLitersFuel?.message as string}
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
                    {isSubmitting ? 'Сохранение...' : (trip ? 'Обновить' : 'Создать')}
                </Button>
            </Box>
        </Box>
    );
}