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
import { Assignment } from '@/types';
import { assignmentService } from '@/services/assignmentService';
import AssignmentForm from '@/components/forms/AssignmentForm';

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            setLoading(true);
            const data = await assignmentService.getAll();
            setAssignments(data);
        } catch (error) {
            console.error('Error loading assignments:', error);
            alert('Ошибка загрузки назначений');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedAssignment(null);
        setOpen(true);
    };

    const handleEdit = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Вы уверены, что хотите удалить это назначение?')) {
            try {
                await assignmentService.delete(id);
                loadAssignments();
            } catch (error) {
                console.error('Error deleting assignment:', error);
                alert('Ошибка удаления назначения');
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedAssignment(null);
    };

    const handleSubmit = async (assignmentData: any) => {
        try {
            if (selectedAssignment) {
                await assignmentService.update({ ...selectedAssignment, ...assignmentData });
            } else {
                await assignmentService.create({
                    ...assignmentData,
                    id: undefined
                });
            }
            handleClose();
            loadAssignments();
        } catch (error) {
            console.error('Error saving assignment:', error);
            alert('Ошибка сохранения назначения');
        }
    };

    // Проверка активного назначения
    const isActiveAssignment = (assignment: Assignment) => {
        const now = new Date();
        const start = new Date(assignment.start);
        const end = new Date(assignment.end);
        return now >= start && now <= end;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography>Загрузка назначений...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">📋 Назначения</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreate}
                >
                    Добавить назначение
                </Button>
            </Box>

            {assignments.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Назначения не найдены
                    </Typography>
                    <Typography color="textSecondary" sx={{ mb: 2 }}>
                        Добавьте первое назначение водителя на автомобиль
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                    >
                        Добавить назначение
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
                                <TableCell>Статус</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assignments.map((assignment) => (
                                <TableRow key={assignment.id} hover>
                                    <TableCell>
                                        <Chip label={assignment.carId} variant="outlined" size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={assignment.driverId} variant="outlined" size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(assignment.start).toLocaleDateString('ru-RU')}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            до {new Date(assignment.end).toLocaleDateString('ru-RU')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={isActiveAssignment(assignment) ? 'Активно' : 'Завершено'}
                                            color={isActiveAssignment(assignment) ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleEdit(assignment)}
                                            color="primary"
                                            title="Редактировать"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(assignment.id)}
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
                    {selectedAssignment ? '✏️ Редактировать назначение' : '➕ Добавить назначение'}
                </DialogTitle>
                <DialogContent>
                    <AssignmentForm assignment={selectedAssignment} onSubmit={handleSubmit} onCancel={handleClose} />
                </DialogContent>
            </Dialog>
        </Box>
    );
}