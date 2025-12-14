'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
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
    TextField,
    Card,
    CardContent,
    CircularProgress,
} from '@mui/material';
import {
    Edit,
    Delete,
    Add,
    Upload,
    Download,
    TableChart,
} from '@mui/icons-material';
import { Trip, CreateTripRequest } from '@/types';
import { tripService } from '@/services/tripService';
import { reportService } from '@/services/reportService';
import TripForm from '@/components/forms/TripForm';
import { useAuth } from '@/components/AuthProvider';

export default function TripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [reportDateRange, setReportDateRange] = useState({
        start: '',
        end: '',
    });

    const { user } = useAuth();

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        try {
            setLoading(true);
            const data = await tripService.getAll();
            setTrips(data);
        } catch (error: any) {
            console.error('Error loading trips:', error);
            setError('Ошибка загрузки поездок');
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

    const handleClose = () => {
        setOpen(false);
        setSelectedTrip(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Вы уверены, что хотите удалить эту поездку?')) {
            try {
                await tripService.delete(id);
                setSuccess('Поездка успешно удалена');
                loadTrips();
            } catch (error: any) {
                setError('Ошибка удаления поездки');
            }
        }
    };

    const handleSubmit = async (data: CreateTripRequest) => {
        try {
            if (selectedTrip) {
                await tripService.update({ ...selectedTrip, ...data } as Trip);
                setSuccess('Поездка успешно обновлена');
            } else {
                await tripService.create({ ...data, createdUserId: data.createdUserId || user?.id });
                setSuccess('Поездка успешно создана');
            }
            handleClose();
            loadTrips();
        } catch (error: any) {
            setError(error.response?.data || error.message || 'Ошибка сохранения поездки');
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.match(/\.(xlsx|xls)$/i)) {
            setError('Пожалуйста, выберите файл Excel (.xlsx или .xls)');
            return;
        }

        setImportLoading(true);

        try {
            const result = await reportService.importTrips(file);

            setSuccess(`Успешно импортировано ${result.importedCount || 'данные'} поездок`);

            loadTrips();

        } catch (error: any) {
            console.error('Error importing trips:', error);
            setError(error.response?.data?.message || 'Ошибка при импорте данных');
        } finally {
            setImportLoading(false);
            event.target.value = '';
        }
    };

    const handleExport = async (filtered = false) => {
        setExportLoading(true);

        try {
            let blob;

            if (filtered && reportDateRange.start && reportDateRange.end) {
                blob = await reportService.exportTripsByDate(reportDateRange.start, reportDateRange.end);
            } else {
                blob = await reportService.exportTripsReport();
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filtered
                ? `поездки_${reportDateRange.start}_${reportDateRange.end}.xlsx`
                : 'все_поездки.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setSuccess('Экспорт успешно выполнен');

        } catch (error: any) {
            console.error('Error exporting trips:', error);
            setError(error.response?.data?.message || 'Ошибка при экспорте данных');
        } finally {
            setExportLoading(false);
        }
    };

    const filterTrips = () => {
        if (!reportDateRange.start || !reportDateRange.end) return trips;
        const start = new Date(reportDateRange.start);
        const end = new Date(reportDateRange.end);
        end.setHours(23, 59, 59);
        return trips.filter(t => new Date(t.timeStart) >= start && new Date(t.timeStart) <= end);
    };

    const calculateConsumption = (trip: Trip) => {
        if (trip.traveledKM === 0) return '0';
        return ((trip.consumptionLitersFuel / trip.traveledKM) * 100).toFixed(1);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
            </Box>
        );
    }

    const filteredTrips = filterTrips();

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    🚗 Поездки
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={importLoading ? <CircularProgress size={20} color="inherit" /> : <Upload />}
                        component="label"
                        disabled={importLoading}
                    >
                        {importLoading ? 'Импорт...' : 'Импорт Excel'}
                        <input
                            type="file"
                            hidden
                            accept=".xlsx,.xls"
                            onChange={handleImport}
                            disabled={importLoading}
                        />
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                    >
                        Добавить поездку
                    </Button>
                </Box>
            </Box>

            {/* Карточки с общей статистикой */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" variant="body2">
                                Всего поездок
                            </Typography>
                            <Typography variant="h5">
                                {trips.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" variant="body2">
                                Общий пробег
                            </Typography>
                            <Typography variant="h5">
                                {trips.reduce((sum, t) => sum + t.traveledKM, 0).toLocaleString('ru-RU')} км
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" variant="body2">
                                Средний расход
                            </Typography>
                            <Typography variant="h5">
                                {trips.length > 0 ?
                                    (trips.reduce((sum, t) => sum + t.consumptionLitersFuel, 0) /
                                        trips.reduce((sum, t) => sum + t.traveledKM, 0) * 100).toFixed(1) : '0'} л/100км
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" variant="body2">
                                За период
                            </Typography>
                            <Typography variant="h5">
                                {filteredTrips.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Фильтры для экспорта */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    📅 Экспорт поездок в Excel
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        label="С даты"
                        type="date"
                        size="small"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        value={reportDateRange.start}
                        onChange={(e) => setReportDateRange({ ...reportDateRange, start: e.target.value })}
                    />
                    <TextField
                        label="По дату"
                        type="date"
                        size="small"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        value={reportDateRange.end}
                        onChange={(e) => setReportDateRange({ ...reportDateRange, end: e.target.value })}
                    />
                    <Button
                        variant="outlined"
                        startIcon={exportLoading ? <CircularProgress size={20} color="inherit" /> : <TableChart />}
                        onClick={() => handleExport(true)}
                        disabled={exportLoading || !reportDateRange.start || !reportDateRange.end}
                    >
                        Экспорт за период
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={exportLoading ? <CircularProgress size={20} color="inherit" /> : <Download />}
                        onClick={() => handleExport(false)}
                        disabled={exportLoading}
                    >
                        Экспорт всех
                    </Button>
                    {(reportDateRange.start || reportDateRange.end) && (
                        <Button
                            size="small"
                            onClick={() => setReportDateRange({ start: '', end: '' })}
                        >
                            Сбросить фильтры
                        </Button>
                    )}
                </Box>
            </Paper>

            {filteredTrips.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Поездки не найдены
                    </Typography>
                    <Typography color="textSecondary" sx={{ mb: 2 }}>
                        {reportDateRange.start || reportDateRange.end ?
                            'Нет поездок за выбранный период' :
                            'Добавьте первую поездку в систему'}
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
                                <TableCell>Дата</TableCell>
                                <TableCell>Пробег</TableCell>
                                <TableCell>Расход</TableCell>
                                <TableCell>л/100км</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTrips.map((trip) => (
                                <TableRow key={trip.id} hover>
                                    <TableCell>
                                        <Chip label={trip.car.model + " " + trip.car.number} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={trip.driver.lastName + " " + trip.driver.name + ' ' + trip.driver.pathronymic} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(trip.timeStart).toLocaleDateString('ru-RU')}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {new Date(trip.timeStart).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="medium">
                                            {trip.traveledKM} км
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {trip.consumptionLitersFuel} л
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${calculateConsumption(trip)} л/100км`}
                                            color={Number(calculateConsumption(trip)) > 15 ? 'error' : 'success'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleEdit(trip)}
                                            color="primary"
                                            size="small"
                                            title="Редактировать"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(trip.id)}
                                            color="error"
                                            size="small"
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

            {/* Диалог для создания/редактирования поездки */}
            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>
                    {selectedTrip ? '✏️ Редактирование поездки' : '➕ Создание новой поездки'}
                </DialogTitle>
                <DialogContent>
                    <TripForm trip={selectedTrip} onSubmit={handleSubmit} onCancel={handleClose} />
                </DialogContent>
            </Dialog>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess(null)}>
                <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
}