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
import { Trip, Car, Driver, CreateTripRequest } from '@/types';
import { carService } from '@/services/carService';
import { driverService } from '@/services/driverService';

interface TripFormProps {
    trip?: Trip | null;
    onSubmit: (data: CreateTripRequest) => void;
    onCancel: () => void;
}

export default function TripForm({ trip, onSubmit, onCancel }: TripFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<CreateTripRequest>();

    const [cars, setCars] = useState<Car[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    useEffect(() => {
        loadCarsAndDrivers();
        if (trip) {
            reset({
                carId: trip.carId,
                driverId: trip.driverId,
                timeStart: formatDateForInput(trip.timeStart),
                timeEnd: formatDateForInput(trip.timeEnd),
                traveledKM: trip.traveledKM,
                consumptionLitersFuel: trip.consumptionLitersFuel,
            });
        } else {
            const now = new Date();
            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

            reset({
                carId: '',
                driverId: '',
                timeStart: formatDateForInput(now.toISOString()),
                timeEnd: formatDateForInput(oneHourLater.toISOString()),
                traveledKM: 0,
                consumptionLitersFuel: 0,
            });
        }
    }, [trip, reset]);

    const formatDateForInput = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const formatDateForBackend = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toISOString();
    };

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

    const handleFormSubmit = (data: CreateTripRequest) => {
        const formattedData = {
            ...data,
            timeStart: formatDateForBackend(data.timeStart),
            timeEnd: formatDateForBackend(data.timeEnd),
        };
        console.log('Formatted trip data for backend:', formattedData);
        onSubmit(formattedData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={!!errors.carId}>
                        <InputLabel id="car-select-label">Автомобиль</InputLabel>
                        <Select
                            labelId="car-select-label"
                            label="Автомобиль"
                            defaultValue={trip?.carId || ''}
                            {...register('carId', { required: 'Выберите автомобиль' })}
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
                    <FormControl fullWidth error={!!errors.driverId}>
                        <InputLabel id="driver-select-label">Водитель</InputLabel>
                        <Select
                            labelId="driver-select-label"
                            label="Водитель"
                            defaultValue={trip?.driverId || ''}
                            {...register('driverId', { required: 'Выберите водителя' })}
                        >
                            {drivers.map((driver) => (
                                <MenuItem key={driver.id} value={driver.id}>
                                    {driver.lastName} {driver.name} {driver.pathronymic || ''}
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
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        {...register('timeStart', {
                            required: 'Время начала обязательно',
                        })}
                        error={!!errors.timeStart}
                        helperText={errors.timeStart?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="datetime-local"
                        label="Время окончания"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        {...register('timeEnd', {
                            required: 'Время окончания обязательно',
                            validate: (value, formValues) => {
                                const start = new Date(formValues.timeStart);
                                const end = new Date(value);
                                if (end <= start) {
                                    return 'Время окончания должно быть позже времени начала';
                                }
                                return true;
                            }
                        })}
                        error={!!errors.timeEnd}
                        helperText={errors.timeEnd?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Пробег (км)"
                        slotProps={{
                            input: {
                                inputProps: { min: 0, step: 1 }
                            }
                        }}
                        {...register('traveledKM', {
                            required: 'Пробег обязателен',
                            min: { value: 1, message: 'Пробег должен быть больше 0' },
                            valueAsNumber: true,
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
                        slotProps={{
                            input: {
                                inputProps: { min: 0, step: 0.1 }
                            }
                        }}
                        {...register('consumptionLitersFuel', {
                            required: 'Расход топлива обязателен',
                            min: { value: 0, message: 'Расход не может быть отрицательным' },
                            valueAsNumber: true,
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