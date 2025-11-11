'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Chip,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { Trip } from '@/types';
import { tripService } from '@/services/tripService';
import TripForm from '@/components/forms/TripForm';

export default function TripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        try {
            setLoading(true);
            const data = await tripService.getAll();
            setTrips(data);
        } catch (error) {
            console.error('Error loading trips:', error);
            alert('Ошибка загрузки поездок');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedTrip(null);
        setOpen(true);
    };

    const handleEdit = (trip: Trip) => {
        setSelectedTrip(trip);
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Вы уверены, что хотите удалить эту поездку?')) {
            try {
                await tripService.delete(id);
                loadTrips();
            } catch (error) {
                console.error('Error deleting trip:', error);
                alert('Ошибка удаления поездки');
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTrip(null);
    };

    const handleSubmit = async (tripData: any) => {
        try {
            if (selectedTrip) {
                await tripService.update({ ...selectedTrip, ...tripData });
            } else {
                await tripService.create({
                    ...tripData,
                    id: undefined
                });
            }
            handleClose();
            loadTrips();
        } catch (error) {
            console.error('Error saving trip:', error);
            alert('Ошибка сохранения поездки');
        }
    };

    // Расчет расхода топлива на 100км
    const calculateFuelConsumption = (trip: Trip) => {
        if (trip.traveledKM === 0) return 0;
        return ((trip.consumptionLitersFuel / trip.traveledKM) * 100).toFixed(1);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography>Загрузка поездок...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">🛣️ Поездки</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreate}
                >
                    Добавить поездку
                </Button>
            </Box>

            {trips.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Поездки не найдены
                    </Typography>
                    <Typography color="textSecondary" sx={{ mb: 2 }}>
                        Добавьте первую поездку в систему
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                    >
                        Добавить поездку
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Автомобиль</TableCell>
                                <TableCell>Водитель</TableCell>
                                <TableCell>Период</TableCell>
                                <TableCell>Пробег (км)</TableCell>
                                <TableCell>Расход (л)</TableCell>
                                <TableCell>л/100км</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {trips.map((trip) => (
                                <TableRow key={trip.id} hover>
                                    <TableCell>
                                        <Chip label={trip.carId} variant="outlined" size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={trip.driverId} variant="outlined" size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(trip.timeStart).toLocaleDateString('ru-RU')}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {new Date(trip.timeStart).toLocaleTimeString('ru-RU')} - {new Date(trip.timeEnd).toLocaleTimeString('ru-RU')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="medium">
                                            {trip.traveledKM} км
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            {trip.consumptionLitersFuel} л
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${calculateFuelConsumption(trip)} л/100км`}
                                            color={Number(calculateFuelConsumption(trip)) > 15 ? 'error' : 'success'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleEdit(trip)}
                                            color="primary"
                                            title="Редактировать"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(trip.id)}
                                            color="error"
                                            title="Удалить"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>
                    {selectedTrip ? '✏️ Редактировать поездку' : '➕ Добавить поездку'}
                </DialogTitle>
                <DialogContent>
                    <TripForm trip={selectedTrip} onSubmit={handleSubmit} onCancel={handleClose} />
                </DialogContent>
            </Dialog>
        </Box>
    );
}