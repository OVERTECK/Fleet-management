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
import { Assignment, Car, Driver } from '@/types';
import { carService } from '@/services/carService';
import { driverService } from '@/services/driverService';

interface AssignmentFormProps {
    assignment?: Assignment | null;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function AssignmentForm({ assignment, onSubmit, onCancel }: AssignmentFormProps) {
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
        if (assignment) {
            reset({
                ...assignment,
                start: assignment.start.split('T')[0],
                end: assignment.end.split('T')[0],
            });
        } else {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 30);

            reset({
                carId: '',
                driverId: '',
                start: new Date().toISOString().split('T')[0],
                end: tomorrow.toISOString().split('T')[0],
            });
        }
    }, [assignment, reset]);

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
                            defaultValue={assignment?.carId || ''}
                            {...register('carId', { required: 'Выберите автомобиль' })}
                            error={!!errors.carId}
                        >
                            {cars.map((car) => (
                                <MenuItem key={car.vin} value={car.vin}>
                                    {car.model} ({car.number}) - {car.status === 'active' ? '🟢' : car.status === 'maintenance' ? '🟡' : '🔴'}
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
                            defaultValue={assignment?.driverId || ''}
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
                        type="date"
                        label="Дата начала"
                        InputLabelProps={{ shrink: true }}
                        {...register('start', { required: 'Дата начала обязательна' })}
                        error={!!errors.start}
                        helperText={errors.start?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Дата окончания"
                        InputLabelProps={{ shrink: true }}
                        {...register('end', {
                            required: 'Дата окончания обязательна',
                            validate: (value, formValues) => {
                                if (new Date(value) <= new Date(formValues.start)) {
                                    return 'Дата окончания должна быть позже даты начала';
                                }
                                return true;
                            }
                        })}
                        error={!!errors.end}
                        helperText={errors.end?.message as string}
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
                    {isSubmitting ? 'Сохранение...' : (assignment ? 'Обновить' : 'Создать')}
                </Button>
            </Box>
        </Box>
    );
}