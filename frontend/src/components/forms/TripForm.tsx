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
    Typography,
    Paper,
    Alert,
    Tabs,
    Tab,
    Card,
    CardContent,
} from '@mui/material';
import { AddLocation, Delete, Map, Route, Timeline } from '@mui/icons-material';
import { Trip, Car, Driver, CreateTripRequest, RoutePoint } from '@/types';
import { carService } from '@/services/carService';
import { driverService } from '@/services/driverService';
import { useAuth } from '@/components/AuthProvider';
import FreeRoutingMapYandex from '@/components/maps/FreeRoutingMapYandex';

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
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<CreateTripRequest>();

    const [cars, setCars] = useState<Car[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        setValue('route', routePoints);
    }, [routePoints, setValue]);

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
                createdUserId: trip.createdUserId || user?.id,
                route: trip.routes || [],
            });
            if (trip.routes) {
                setRoutePoints(trip.routes);
            }
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
                createdUserId: user?.id,
                route: [],
            });
        }
    }, [trip, reset, user]);

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
        const distance = calculateTotalDistance(routePoints);
        const finalData = {
            ...data,
            timeStart: formatDateForBackend(data.timeStart),
            timeEnd: formatDateForBackend(data.timeEnd),
            createdUserId: data.createdUserId || user?.id,
            route: routePoints,
            traveledKM: distance > 0 ? Math.round(distance) : data.traveledKM || 0,
        };

        console.log('Formatted trip data for backend:', finalData);
        onSubmit(finalData);
    };

    const handleRoutePointsChange = (points: RoutePoint[]) => {
        setRoutePoints(points);

        const distance = calculateTotalDistance(points);
        if (distance > 0) {
            setValue('traveledKM', Math.round(distance));
        }
    };

    const handleDistanceCalculated = (distanceKm: number) => {
        if (distanceKm > 0) {
            setValue('traveledKM', Math.round(distanceKm));
        }
    };

    const carId = watch('carId');
    const selectedCar = cars.find(c => c.vin === carId);
    const traveledKM = watch('traveledKM') || 0;

    const calculateEstimatedFuel = () => {
        if (!selectedCar || traveledKM <= 0) return 0;

        const avgConsumption = selectedCar.totalKM > 1000 ?
            (selectedCar.totalKM / 1000) : 10;
        return (traveledKM * avgConsumption / 100).toFixed(1);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {trip ? '✏️ Редактирование поездки' : '➕ Создание новой поездки'}
                </Typography>

                <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                    <Tab label="Основная информация" />
                    <Tab label="Построение маршрута" />
                    <Tab label="Итоги" />
                </Tabs>
            </Paper>

            {activeTab === 0 && (
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
                </Grid>
            )}

            {activeTab === 1 && (
                <Box>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Map /> Построение маршрута
                        </Typography>

                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                1. Кликните на карте, чтобы добавить точки маршрута<br />
                                2. Первая точка - начало маршрута, последняя - конец<br />
                                3. Пробег автоматически рассчитается по маршруту
                            </Typography>
                        </Alert>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Текущие точки маршрута:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {routePoints.map((point, index) => (
                                    <Card key={index} variant="outlined" sx={{ p: 1 }}>
                                        <CardContent sx={{ p: '8px !important' }}>
                                            <Typography variant="body2">
                                                <Route sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                                                Точка {index + 1}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}
                                            </Typography>
                                            <Button
                                                size="small"
                                                startIcon={<Delete />}
                                                onClick={() => {
                                                    const newPoints = [...routePoints];
                                                    newPoints.splice(index, 1);
                                                    handleRoutePointsChange(newPoints);
                                                }}
                                                sx={{ mt: 0.5 }}
                                            >
                                                Удалить
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                                {routePoints.length === 0 && (
                                    <Typography color="textSecondary">
                                        Нет точек маршрута. Кликните на карте, чтобы добавить.
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Paper>

                    <FreeRoutingMapYandex
                        routePoints={routePoints}
                        onRoutePointsChange={handleRoutePointsChange}
                        onDistanceCalculated={handleDistanceCalculated}
                        height="400px"
                    />

                    <Grid container spacing={3} sx={{ mt: 3 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Пробег (км)"
                                slotProps={{
                                    input: {
                                        inputProps: {
                                            min: 0,
                                            step: 1,
                                            value: traveledKM
                                        }
                                    }
                                }}
                                {...register('traveledKM', {
                                    required: 'Пробег обязателен',
                                    min: { value: 1, message: 'Пробег должен быть больше 0' },
                                    valueAsNumber: true,
                                })}
                                error={!!errors.traveledKM}
                                helperText={errors.traveledKM?.message as string}
                                InputProps={{
                                    endAdornment: routePoints.length >= 2 && (
                                        <Typography variant="caption" color="textSecondary">
                                            авто: {Math.round(calculateTotalDistance(routePoints))} км
                                        </Typography>
                                    )
                                }}
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
                                InputProps={{
                                    endAdornment: selectedCar && traveledKM > 0 && (
                                        <Typography variant="caption" color="textSecondary">
                                            оценка: {calculateEstimatedFuel()} л
                                        </Typography>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>

                    {selectedCar && (
                        <Paper sx={{ p: 2, mt: 3, bgcolor: '#f8f9fa' }}>
                            <Typography variant="subtitle2" gutterBottom>
                                📊 Расчет для {selectedCar.model}:
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="textSecondary">Пробег по маршруту</Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {Math.round(calculateTotalDistance(routePoints))} км
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="textSecondary">Ориентировочный расход</Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {calculateEstimatedFuel()} л
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="textSecondary">л/100км</Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {traveledKM > 0 ? ((Number(calculateEstimatedFuel()) / traveledKM) * 100).toFixed(1) : '0'} л/100км
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
                </Box>
            )}

            {activeTab === 2 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timeline /> Итоги поездки
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Маршрут
                                    </Typography>
                                    {routePoints.length >= 2 ? (
                                        <>
                                            <Typography variant="body2">
                                                От: Точка 1 ({routePoints[0].latitude.toFixed(5)}, {routePoints[0].longitude.toFixed(5)})
                                            </Typography>
                                            <Typography variant="body2">
                                                До: Точка {routePoints.length} ({routePoints[routePoints.length - 1].latitude.toFixed(5)}, {routePoints[routePoints.length - 1].longitude.toFixed(5)})
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Количество точек: {routePoints.length}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography color="textSecondary">
                                            Маршрут не задан
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Параметры поездки
                                    </Typography>
                                    <Typography variant="body2">
                                        Пробег: {traveledKM} км
                                    </Typography>
                                    <Typography variant="body2">
                                        Расход топлива: {watch('consumptionLitersFuel') || 0} л
                                    </Typography>
                                    <Typography variant="body2">
                                        Расход на 100км: {traveledKM > 0 ? ((watch('consumptionLitersFuel') || 0) / traveledKM * 100).toFixed(1) : '0'} л/100км
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setActiveTab(activeTab - 1)}
                        disabled={activeTab === 0}
                    >
                        ← Назад
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => setActiveTab(activeTab + 1)}
                        disabled={activeTab === 2}
                    >
                        Далее →
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
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
                        {isSubmitting ? 'Сохранение...' : (trip ? 'Обновить поездку' : 'Создать поездку')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

function calculateTotalDistance(points: RoutePoint[]): number {
    if (points.length < 2) return 0;

    let total = 0;
    for (let i = 1; i < points.length; i++) {
        total += haversineDistance(
            points[i - 1].latitude, points[i - 1].longitude,
            points[i].latitude, points[i].longitude
        );
    }
    return total;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}