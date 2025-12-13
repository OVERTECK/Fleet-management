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
import { MaintenanceRecord, Car, CreateMaintenanceRecordRequest } from '@/types';
import { carService } from '@/services/carService';

interface MaintenanceFormProps {
    record?: MaintenanceRecord | null;
    onSubmit: (data: CreateMaintenanceRecordRequest) => void;
    onCancel: () => void;
}

const workTypes = [
    'Замена масла',
    'Замена фильтров',
    'Технический осмотр',
    'Ремонт двигателя',
    'Ремонт тормозной системы',
    'Замена шин',
    'Балансировка колес',
    'Ремонт подвески',
    'Замена аккумулятора',
    'Обслуживание кондиционера',
    'Кузовной ремонт',
    'Покраска',
    'Другое'
];

export default function MaintenanceForm({ record, onSubmit, onCancel }: MaintenanceFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<CreateMaintenanceRecordRequest>();

    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        loadCars();

        if (record) {
            reset({
                carId: record.carId,
                typeWork: record.typeWork,
                price: record.price,
                date: record.date.split('T')[0],
            });
        } else {
            reset({
                carId: '',
                typeWork: '',
                price: 0,
                date: new Date().toISOString().split('T')[0],
            });
        }
    }, [record, reset]);

    const formatDateForBackend = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toISOString();
    };

    const loadCars = async () => {
        try {
            const carsData = await carService.getAll();
            setCars(carsData);
        } catch (error) {
            console.error('Error loading cars:', error);
        }
    };

    const handleFormSubmit = (data: CreateMaintenanceRecordRequest) => {
        const formattedData = {
            ...data,
            date: formatDateForBackend(data.date),
        };
        console.log('Formatted maintenance data for backend:', formattedData);
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
                            defaultValue={record?.carId || ''}
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
                    <FormControl fullWidth error={!!errors.typeWork}>
                        <InputLabel id="work-type-label">Вид работ</InputLabel>
                        <Select
                            labelId="work-type-label"
                            label="Вид работ"
                            defaultValue={record?.typeWork || ''}
                            {...register('typeWork', { required: 'Выберите вид работ' })}
                            error={!!errors.typeWork}
                        >
                            {workTypes.map((workType) => (
                                <MenuItem key={workType} value={workType}>
                                    {workType}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {errors.typeWork && (
                        <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                            {errors.typeWork.message as string}
                        </Box>
                    )}
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Дата выполнения"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        {...register('date', { required: 'Дата обязательна' })}
                        error={!!errors.date}
                        helperText={errors.date?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Стоимость (₽)"
                        slotProps={{
                            input: {
                                inputProps: { min: 0, step: 0.01 }
                            }
                        }}
                        {...register('price', {
                            required: 'Стоимость обязательна',
                            min: { value: 0, message: 'Стоимость не может быть отрицательной' },
                            valueAsNumber: true,
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
                    {isSubmitting ? 'Сохранение...' : (record ? 'Обновить' : 'Создать')}
                </Button>
            </Box>
        </Box>
    );
}