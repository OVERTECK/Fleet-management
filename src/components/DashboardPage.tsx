'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Grid as Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    LinearProgress,
} from '@mui/material';
import {
    DirectionsCar,
    People,
    LocalGasStation,
    AttachMoney,
    Warning,
    TrendingUp,
    Route,
} from '@mui/icons-material';
import { Car, Driver, Trip, MaintenanceRecord, Refueling } from '@/types';
import { carService } from '@/services/carService';
import { driverService } from '@/services/driverService';
import { tripService } from '@/services/tripService';
import { maintenanceService } from '@/services/maintenanceService';
import { refuelingService } from '@/services/refuelingService';

interface DashboardStats {
    totalCars: number;
    totalDrivers: number;
    totalTrips: number;
    totalMaintenance: number;
    totalRefuelings: number;
    totalCost: number;
    activeCars: number;
    maintenanceCars: number;
    fuelConsumption: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalCars: 0,
        totalDrivers: 0,
        totalTrips: 0,
        totalMaintenance: 0,
        totalRefuelings: 0,
        totalCost: 0,
        activeCars: 0,
        maintenanceCars: 0,
        fuelConsumption: 0,
    });
    const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
    const [fuelAnomalies, setFuelAnomalies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Загружаем данные параллельно с улучшенной обработкой ошибок
            const [cars, drivers, trips, maintenance, refuelings] = await Promise.all([
                carService.getAll().catch(error => {
                    console.error('Error loading cars:', error);
                    return [];
                }),
                driverService.getAll().catch(error => {
                    console.error('Error loading drivers:', error);
                    return [];
                }),
                tripService.getAll().catch(error => {
                    console.error('Error loading trips:', error);
                    return [];
                }),
                maintenanceService.getAll().catch(error => {
                    console.error('Error loading maintenance:', error);
                    return [];
                }),
                refuelingService.getAll().catch(error => {
                    console.error('Error loading refuelings:', error);
                    return [];
                })
            ]);

            // Расчет статистики
            const totalCost = maintenance.reduce((sum, m) => sum + m.price, 0) +
                refuelings.reduce((sum, r) => sum + r.price, 0);

            const activeCars = cars.filter(car => car.status === 'active').length;
            const maintenanceCars = cars.filter(car => car.status === 'maintenance').length;

            // Расчет среднего расхода топлива
            const totalFuel = trips.reduce((sum, trip) => sum + trip.consumptionLitersFuel, 0);
            const totalDistance = trips.reduce((sum, trip) => sum + trip.traveledKM, 0);
            const avgFuelConsumption = totalDistance > 0 ? (totalFuel / totalDistance) * 100 : 0;

            // Поиск аномалий расхода
            const anomalies = detectFuelAnomalies(trips);

            setStats({
                totalCars: cars.length,
                totalDrivers: drivers.length,
                totalTrips: trips.length,
                totalMaintenance: maintenance.length,
                totalRefuelings: refuelings.length,
                totalCost,
                activeCars,
                maintenanceCars,
                fuelConsumption: avgFuelConsumption,
            });

            setRecentTrips(trips.slice(-5).reverse());
            setFuelAnomalies(anomalies);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const detectFuelAnomalies = (trips: Trip[]): any[] => {
        if (trips.length === 0) return [];

        // Группируем поездки по автомобилям
        const tripsByCar = trips.reduce((acc, trip) => {
            if (!acc[trip.carId]) acc[trip.carId] = [];
            acc[trip.carId].push(trip);
            return acc;
        }, {} as Record<string, Trip[]>);

        const anomalies: any[] = [];

        Object.entries(tripsByCar).forEach(([carId, carTrips]) => {
            if (carTrips.length < 3) return;

            // Рассчитываем средний расход для автомобиля
            const totalFuel = carTrips.reduce((sum, trip) => sum + trip.consumptionLitersFuel, 0);
            const totalDistance = carTrips.reduce((sum, trip) => sum + trip.traveledKM, 0);
            const avgConsumption = totalDistance > 0 ? (totalFuel / totalDistance) * 100 : 0;

            // Проверяем последние 3 поездки на аномалии
            const recentTrips = carTrips.slice(-3);
            recentTrips.forEach(trip => {
                if (trip.traveledKM > 0) {
                    const tripConsumption = (trip.consumptionLitersFuel / trip.traveledKM) * 100;
                    const deviation = Math.abs(tripConsumption - avgConsumption) / avgConsumption;

                    if (deviation > 0.3) { // 30% отклонение
                        anomalies.push({
                            carId,
                            tripId: trip.id,
                            consumption: tripConsumption,
                            avgConsumption,
                            deviation: (deviation * 100).toFixed(1),
                        });
                    }
                }
            });
        });

        return anomalies;
    };

    const StatCard = ({ title, value, subtitle, icon, color, progress }: any) => (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography color="textSecondary" gutterBottom variant="body2">
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="textSecondary">
                                {subtitle}
                            </Typography>
                        )}
                        {progress !== undefined && (
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ mt: 1, height: 6, borderRadius: 3 }}
                                color={progress > 80 ? 'error' : progress > 60 ? 'warning' : 'primary'}
                            />
                        )}
                    </Box>
                    <Box sx={{ color, ml: 2 }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Typography>Загрузка дашборда...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4 }}>
                📊 Обзор автопарка
            </Typography>

            {/* Основная статистика */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Автомобилей"
                        value={stats.totalCars}
                        subtitle={`${stats.activeCars} активно, ${stats.maintenanceCars} на ТО`}
                        icon={<DirectionsCar sx={{ fontSize: 40 }} />}
                        color="#1976d2"
                        progress={(stats.activeCars / stats.totalCars) * 100}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Водителей"
                        value={stats.totalDrivers}
                        icon={<People sx={{ fontSize: 40 }} />}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Поездок"
                        value={stats.totalTrips}
                        icon={<Route sx={{ fontSize: 40 }} />}
                        color="#aa02edff"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Общие затраты"
                        value={`${stats.totalCost.toLocaleString('ru-RU')} ₽`}
                        subtitle={`${stats.totalRefuelings} заправок, ${stats.totalMaintenance} ТО`}
                        icon={<AttachMoney sx={{ fontSize: 40 }} />}
                        color="#d32f2f"
                    />
                </Grid>
            </Grid>

            {/* Аналитика и предупреждения */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Последние поездки */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp /> Последние поездки
                        </Typography>
                        {recentTrips.length === 0 ? (
                            <Typography color="textSecondary" sx={{ py: 2 }}>
                                Нет данных о поездках
                            </Typography>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Авто</TableCell>
                                            <TableCell>Пробег</TableCell>
                                            <TableCell>Расход</TableCell>
                                            <TableCell>л/100км</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentTrips.map((trip) => {
                                            const consumption = trip.traveledKM > 0 ?
                                                ((trip.consumptionLitersFuel / trip.traveledKM) * 100).toFixed(1) : '0';
                                            return (
                                                <TableRow key={trip.id}>
                                                    <TableCell>
                                                        <Chip label={trip.carId} size="small" variant="outlined" />
                                                    </TableCell>
                                                    <TableCell>{trip.traveledKM} км</TableCell>
                                                    <TableCell>{trip.consumptionLitersFuel} л</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={`${consumption} л`}
                                                            size="small"
                                                            color={Number(consumption) > 15 ? 'error' : 'success'}
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Grid>

                {/* Аномалии расхода */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Warning /> Предупреждения
                        </Typography>
                        {fuelAnomalies.length === 0 ? (
                            <Typography color="textSecondary" sx={{ py: 2 }}>
                                Аномалий не обнаружено
                            </Typography>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {fuelAnomalies.slice(0, 3).map((anomaly, index) => (
                                    <Paper key={index} variant="outlined" sx={{ p: 2, borderColor: 'error.main' }}>
                                        <Typography variant="subtitle2" color="error" gutterBottom>
                                            Высокий расход топлива
                                        </Typography>
                                        <Typography variant="body2">
                                            Автомобиль: {anomaly.carId}
                                        </Typography>
                                        <Typography variant="body2">
                                            Расход: {anomaly.consumption.toFixed(1)} л/100км (норма: {anomaly.avgConsumption.toFixed(1)} л/100км)
                                        </Typography>
                                        <Typography variant="body2" color="error">
                                            Отклонение: +{anomaly.deviation}%
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Общая статистика расхода */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            📈 Средний расход топлива
                        </Typography>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h3" color="primary">
                                {stats.fuelConsumption.toFixed(1)}
                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                литров на 100 км
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            🚗 Состояние автопарка
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography>Активные</Typography>
                                <Chip label={stats.activeCars} color="success" size="small" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography>На обслуживании</Typography>
                                <Chip label={stats.maintenanceCars} color="warning" size="small" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography>Неактивные</Typography>
                                <Chip label={stats.totalCars - stats.activeCars - stats.maintenanceCars} color="default" size="small" />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}