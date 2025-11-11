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
import { Driver } from '@/types';
import { driverService } from '@/services/driverService';
import DriverForm from '@/components/forms/DriverForm';

// Категории прав с иконками
const licenseCategories = [
    'A', 'A1', 'B', 'B1', 'C', 'C1', 'D', 'D1', 'BE', 'CE', 'C1E', 'DE', 'D1E', 'M', 'Tm', 'Tb'
];

export default function DriversPage() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        try {
            setLoading(true);
            const data = await driverService.getAll();
            setDrivers(data);
        } catch (error) {
            console.error('Error loading drivers:', error);
            alert('Ошибка загрузки водителей');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedDriver(null);
        setOpen(true);
    };

    const handleEdit = (driver: Driver) => {
        setSelectedDriver(driver);
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Вы уверены, что хотите удалить этого водителя?')) {
            try {
                await driverService.delete(id);
                loadDrivers();
            } catch (error) {
                console.error('Error deleting driver:', error);
                alert('Ошибка удаления водителя');
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDriver(null);
    };

    const handleSubmit = async (driverData: any) => {
        try {
            if (selectedDriver) {
                await driverService.update({ ...selectedDriver, ...driverData });
            } else {
                await driverService.create({
                    ...driverData,
                    id: undefined // ID сгенерируется на бэкенде
                });
            }
            handleClose();
            loadDrivers();
        } catch (error) {
            console.error('Error saving driver:', error);
            alert('Ошибка сохранения водителя');
        }
    };

    // Функция для форматирования ФИО
    const formatFullName = (driver: Driver) => {
        return `${driver.lastName} ${driver.name} ${driver.patronymic || ''}`.trim();
    };

    // Функция для форматирования контактных данных
    const formatContactData = (contactData: string) => {
        // Простая валидация - если это номер телефона, форматируем
        const phoneRegex = /^[\d\+\(\)\s-]+$/;
        if (phoneRegex.test(contactData)) {
            return contactData.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
        }
        return contactData;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography>Загрузка водителей...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">👨‍💼 Водители</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreate}
                >
                    Добавить водителя
                </Button>
            </Box>

            {drivers.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Водители не найдены
                    </Typography>
                    <Typography color="textSecondary" sx={{ mb: 2 }}>
                        Добавьте первого водителя в систему
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                    >
                        Добавить водителя
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ФИО</TableCell>
                                <TableCell>Контактные данные</TableCell>
                                <TableCell>Категории прав</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {drivers.map((driver) => (
                                <TableRow key={driver.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            {formatFullName(driver)}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            ID: {driver.id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatContactData(driver.contactData)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {driver.categoryDrive.split(',').map((category) => (
                                                <Chip
                                                    key={category.trim()}
                                                    label={category.trim()}
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleEdit(driver)}
                                            color="primary"
                                            title="Редактировать"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(driver.id)}
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

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedDriver ? '✏️ Редактировать водителя' : '➕ Добавить водителя'}
                </DialogTitle>
                <DialogContent>
                    <DriverForm driver={selectedDriver} onSubmit={handleSubmit} onCancel={handleClose} />
                </DialogContent>
            </Dialog>
        </Box>
    );
}