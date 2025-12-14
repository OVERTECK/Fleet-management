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
    Alert,
    Snackbar,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { Driver, CreateDriverRequest } from '@/types';
import { driverService } from '@/services/driverService';
import DriverForm from '@/components/forms/DriverForm';

export default function DriversPage() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        try {
            setLoading(true);
            const data = await driverService.getAll();
            console.log('Loaded drivers:', data);
            setDrivers(data);
        } catch (error) {
            console.error('Error loading drivers:', error);
            setError('Ошибка загрузки водителей');
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
                setSuccess('Водитель успешно удален');
                loadDrivers();
            } catch (error) {
                console.error('Error deleting driver:', error);
                setError('Ошибка удаления водителя');
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDriver(null);
    };

    const handleSubmit = async (driverData: CreateDriverRequest) => {
        console.log('Submitting driver data:', driverData);
        try {
            if (selectedDriver) {
                await driverService.update({
                    ...selectedDriver,
                    ...driverData
                });
                setSuccess('Водитель успешно обновлен');
            } else {
                await driverService.create(driverData);
                setSuccess('Водитель успешно создан');
            }
            handleClose();
            loadDrivers();
        } catch (error: any) {
            console.error('Error saving driver:', error);
            const errorMessage = error.response?.data || error.message || 'Неизвестная ошибка';
            setError(`Ошибка сохранения водителя: ${errorMessage}`);
        }
    };

    const handleCloseSnackbar = () => {
        setError(null);
        setSuccess(null);
    };

    const formatFullName = (driver: Driver) => {
        return `${driver.lastName} ${driver.name} ${driver.pathronymic || ''}`.trim();
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
                                            {driver.contactData}
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

            {/* Уведомления об ошибках и успехе */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar open={!!success} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
}