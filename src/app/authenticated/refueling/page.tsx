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
import { Refueling } from '@/types';
import { refuelingService } from '@/services/refuelingService';
import RefuelingForm from '@/components/forms/RefuelingForm';

export default function RefuelingPage() {
    const [refuelings, setRefuelings] = useState<Refueling[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedRefueling, setSelectedRefueling] = useState<Refueling | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        loadRefuelings();
    }, []);

    const loadRefuelings = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await refuelingService.getAll();
            setRefuelings(data);
        } catch (error: any) {
            console.error('Error loading refuelings:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Ошибка загрузки заправок';
            setError(`Ошибка загрузки заправок: ${errorMessage}`);
            setRefuelings([]); // Устанавливаем пустой массив в случае ошибки
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedRefueling(null);
        setOpen(true);
    };

    const handleEdit = (refueling: Refueling) => {
        setSelectedRefueling(refueling);
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Вы уверены, что хотите удалить эту запись о заправке?')) {
            try {
                await refuelingService.delete(id);
                setSuccess('Заправка успешно удалена');
                loadRefuelings();
            } catch (error: any) {
                console.error('Error deleting refueling:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка';
                setError(`Ошибка удаления заправки: ${errorMessage}`);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRefueling(null);
    };

    const handleSubmit = async (refuelingData: any) => {
        try {
            if (selectedRefueling) {
                await refuelingService.update({ ...selectedRefueling, ...refuelingData });
                setSuccess('Заправка успешно обновлена');
            } else {
                await refuelingService.create(refuelingData);
                setSuccess('Заправка успешно создана');
            }
            handleClose();
            loadRefuelings();
        } catch (error: any) {
            console.error('Error saving refueling:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка';
            setError(`Ошибка сохранения заправки: ${errorMessage}`);
        }
    };

    const handleCloseSnackbar = () => {
        setError(null);
        setSuccess(null);
    };

    // Расчет стоимости за литр
    const calculatePricePerLiter = (refueling: Refueling) => {
        if (refueling.refilledLiters === 0) return 0;
        return (refueling.price / refueling.refilledLiters).toFixed(2);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography>Загрузка заправок...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">⛽ Заправки</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreate}
                >
                    Добавить заправку
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {refuelings.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        {error ? 'Не удалось загрузить заправки' : 'Заправки не найдены'}
                    </Typography>
                    <Typography color="textSecondary" sx={{ mb: 2 }}>
                        {error ? 'Попробуйте обновить страницу' : 'Добавьте первую запись о заправке'}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                    >
                        Добавить заправку
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Автомобиль</TableCell>
                                <TableCell>Дата</TableCell>
                                <TableCell>Количество (л)</TableCell>
                                <TableCell>Стоимость</TableCell>
                                <TableCell>Цена за литр</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {refuelings.map((refueling) => (
                                <TableRow key={refueling.id} hover>
                                    <TableCell>
                                        <Chip label={refueling.carId} variant="outlined" size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(refueling.date).toLocaleDateString('ru-RU')}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {new Date(refueling.date).toLocaleTimeString('ru-RU')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="medium">
                                            {refueling.refilledLiters} л
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${refueling.price.toLocaleString('ru-RU')} ₽`}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography color="textSecondary">
                                            {calculatePricePerLiter(refueling)} ₽/л
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleEdit(refueling)}
                                            color="primary"
                                            title="Редактировать"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(refueling.id)}
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
                    {selectedRefueling ? '✏️ Редактировать заправку' : '➕ Добавить заправку'}
                </DialogTitle>
                <DialogContent>
                    <RefuelingForm refueling={selectedRefueling} onSubmit={handleSubmit} onCancel={handleClose} />
                </DialogContent>
            </Dialog>

            {/* Уведомления об ошибках и успехе */}
            <Snackbar open={!!success} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
}