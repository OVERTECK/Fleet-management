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
import { Car } from '@/types';
import { carService } from '@/services/carService';
import CarForm from '@/components/forms/CarForm';

const statusColors = {
    active: 'success',
    maintenance: 'warning',
    inactive: 'error',
} as const;

const statusLabels = {
    active: 'Активный',
    maintenance: 'Обслуживание',
    inactive: 'Неактивный',
} as const;

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCars();
    }, []);

    const loadCars = async () => {
        try {
            setLoading(true);
            const data = await carService.getAll();
            setCars(data);
        } catch (error) {
            console.error('Error loading cars:', error);
            alert('Ошибка загрузки автомобилей');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedCar(null);
        setOpen(true);
    };

    const handleEdit = (car: Car) => {
        setSelectedCar(car);
        setOpen(true);
    };

    const handleDelete = async (vin: string) => {
        if (confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
            try {
                await carService.delete(vin);
                loadCars();
            } catch (error) {
                console.error('Error deleting car:', error);
                alert('Ошибка удаления автомобиля');
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCar(null);
    };

    const handleSubmit = async (carData: any) => {
        try {
            if (selectedCar) {
                await carService.update({ ...selectedCar, ...carData });
            } else {
                await carService.create(carData);
            }
            handleClose();
            loadCars();
        } catch (error) {
            console.error('Error saving car:', error);
            alert('Ошибка сохранения автомобиля');
        }
    };

    if (loading) {
        return <Typography>Загрузка...</Typography>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">🚗 Автомобили</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreate}
                >
                    Добавить автомобиль
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>VIN</TableCell>
                            <TableCell>Модель</TableCell>
                            <TableCell>Госномер</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Пробег (км)</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cars.map((car) => (
                            <TableRow key={car.vin} hover>
                                <TableCell>{car.vin}</TableCell>
                                <TableCell>{car.model}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={car.number}
                                        variant="outlined"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={statusLabels[car.status]}
                                        color={statusColors[car.status]}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{car.totalKM.toLocaleString('ru-RU')}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleEdit(car)}
                                        color="primary"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(car.vin)}
                                        color="error"
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedCar ? '✏️ Редактировать автомобиль' : '➕ Добавить автомобиль'}
                </DialogTitle>
                <DialogContent>
                    <CarForm car={selectedCar} onSubmit={handleSubmit} onCancel={handleClose} />
                </DialogContent>
            </Dialog>
        </Box>
    );
}