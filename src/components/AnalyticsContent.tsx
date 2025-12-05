'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid as Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Alert,
} from '@mui/material';
import { TrendingUp, Warning, AttachMoney } from '@mui/icons-material';

interface CostRanking {
    carId: string;
    totalCost: number;
    fuelCost: number;
    maintenanceCost: number;
}

export default function AnalyticsContent() {
    const [costRankings, setCostRankings] = useState<CostRanking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Заглушка для демонстрации
        setTimeout(() => {
            setCostRankings([
                {
                    carId: 'ABC123',
                    totalCost: 150000,
                    fuelCost: 80000,
                    maintenanceCost: 70000,
                },
                {
                    carId: 'DEF456',
                    totalCost: 120000,
                    fuelCost: 70000,
                    maintenanceCost: 50000,
                },
                {
                    carId: 'GHI789',
                    totalCost: 90000,
                    fuelCost: 60000,
                    maintenanceCost: 30000,
                },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography>Загрузка аналитики...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4 }}>
                📊 Аналитика
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp /> Рейтинг затрат по автомобилям
                        </Typography>
                        {costRankings.length === 0 ? (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Данные для анализа отсутствуют
                            </Alert>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Автомобиль</TableCell>
                                            <TableCell align="right">Топливо</TableCell>
                                            <TableCell align="right">ТО</TableCell>
                                            <TableCell align="right">Всего</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {costRankings.map((car, index) => (
                                            <TableRow key={car.carId}>
                                                <TableCell>
                                                    <Chip
                                                        label={car.carId}
                                                        size="small"
                                                        color={index === 0 ? 'error' : index === 1 ? 'warning' : 'default'}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    {car.fuelCost.toLocaleString('ru-RU')} ₽
                                                </TableCell>
                                                <TableCell align="right">
                                                    {car.maintenanceCost.toLocaleString('ru-RU')} ₽
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography fontWeight="bold">
                                                        {car.totalCost.toLocaleString('ru-RU')} ₽
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Warning /> Статистика расхода
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Средний расход топлива
                                    </Typography>
                                    <Typography variant="h4" color="primary">
                                        12.5 л/100км
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Самый экономичный
                                    </Typography>
                                    <Typography variant="h6">
                                        ABC123 - 10.2 л/100км
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Наибольший расход
                                    </Typography>
                                    <Typography variant="h6" color="error">
                                        GHI789 - 15.8 л/100км
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}