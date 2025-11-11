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
import { MaintenanceRecord } from '@/types';
import { maintenanceService } from '@/services/maintenanceService';
import MaintenanceForm from '@/components/forms/MaintenanceForm';

export default function MaintenancePage() {
    const [records, setRecords] = useState<MaintenanceRecord[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            setLoading(true);
            const data = await maintenanceService.getAll();
            setRecords(data);
        } catch (error) {
            console.error('Error loading maintenance records:', error);
            alert('Ошибка загрузки записей ТО');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedRecord(null);
        setOpen(true);
    };

    const handleEdit = (record: MaintenanceRecord) => {
        setSelectedRecord(record);
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Вы уверены, что хотите удалить эту запись ТО?')) {
            try {
                await maintenanceService.delete(id);
                loadRecords();
            } catch (error) {
                console.error('Error deleting maintenance record:', error);
                alert('Ошибка удаления записи ТО');
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRecord(null);
    };

    const handleSubmit = async (recordData: any) => {
        try {
            if (selectedRecord) {
                await maintenanceService.update({ ...selectedRecord, ...recordData });
            } else {
                await maintenanceService.create({
                    ...recordData,
                    id: undefined
                });
            }
            handleClose();
            loadRecords();
        } catch (error) {
            console.error('Error saving maintenance record:', error);
            alert('Ошибка сохранения записи ТО');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography>Загрузка записей ТО...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">🔧 Техобслуживание</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreate}
                >
                    Добавить запись ТО
                </Button>
            </Box>

            {records.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Записи ТО не найдены
                    </Typography>
                    <Typography color="textSecondary" sx={{ mb: 2 }}>
                        Добавьте первую запись техобслуживания
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                    >
                        Добавить запись ТО
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Автомобиль</TableCell>
                                <TableCell>Вид работ</TableCell>
                                <TableCell>Дата</TableCell>
                                <TableCell>Стоимость</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.map((record) => (
                                <TableRow key={record.id} hover>
                                    <TableCell>
                                        <Chip label={record.carId} variant="outlined" size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="medium">
                                            {record.typeWork}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(record.date).toLocaleDateString('ru-RU')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${record.price.toLocaleString('ru-RU')} ₽`}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleEdit(record)}
                                            color="primary"
                                            title="Редактировать"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(record.id)}
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
                    {selectedRecord ? '✏️ Редактировать запись ТО' : '➕ Добавить запись ТО'}
                </DialogTitle>
                <DialogContent>
                    <MaintenanceForm record={selectedRecord} onSubmit={handleSubmit} onCancel={handleClose} />
                </DialogContent>
            </Dialog>
        </Box>
    );
}