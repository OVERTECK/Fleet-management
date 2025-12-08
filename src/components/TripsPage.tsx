'use client';

import { useState, useEffect, useRef } from 'react';
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
    Menu,
    MenuItem,
    Card,
    CardContent,
    ListItemIcon,
} from '@mui/material';
import {
    Edit,
    Delete,
    Add,
    Upload,
    Download,
    TableChart,
    MoreVert,
    Map,
    Route,
    Timeline,
} from '@mui/icons-material';
import { Trip, CreateTripRequest } from '@/types';
import { tripService } from '@/services/tripService';
import TripForm from '@/components/forms/TripForm';
import { useAuth } from '@/components/AuthProvider';

export default function TripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [reportStartDate, setReportStartDate] = useState('');
    const [reportEndDate, setReportEndDate] = useState('');
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedMenuTrip, setSelectedMenuTrip] = useState<Trip | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, trip: Trip) => {
        setMenuAnchor(event.currentTarget);
        setSelectedMenuTrip(trip);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedMenuTrip(null);
    };

    const handleExport = (format: string) => {
        alert(`Функционал экспорта в ${format} будет реализован позже`);
        handleMenuClose();
    };

    const handleImport = () => {
        alert('Функционал импорта будет реализован позже');
    };

    const handleViewMap = () => {
        if (selectedMenuTrip?.routes && selectedMenuTrip.routes.length > 0) {
            alert('Просмотр маршрута на карте будет реализован позже');
        } else {
            alert('Для этой поездки нет данных о маршруте');
        }
        handleMenuClose();
    };

    const filterTrips = () => {
        if (!reportStartDate || !reportEndDate) return trips;
        const start = new Date(reportStartDate);
        const end = new Date(reportEndDate);
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
                <Typography>Загрузка поездок...</Typography>
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
                        startIcon={<Upload />}
                        onClick={handleImport}
                    >
                        Импорт
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
                                С маршрутом
                            </Typography>
                            <Typography variant="h5">
                                {trips.filter(t => t.routes && t.routes.length > 0).length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Фильтры для отчетов */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    📅 Фильтры для отчета
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        label="С даты"
                        type="date"
                        size="small"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        value={reportStartDate}
                        onChange={(e) => setReportStartDate(e.target.value)}
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
                        value={reportEndDate}
                        onChange={(e) => setReportEndDate(e.target.value)}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<TableChart />}
                        onClick={() => handleExport('excel')}
                    >
                        Экспорт Excel
                    </Button>
                    {(reportStartDate || reportEndDate) && (
                        <Button
                            size="small"
                            onClick={() => {
                                setReportStartDate('');
                                setReportEndDate('');
                            }}
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
                        {reportStartDate || reportEndDate ?
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
                                <TableCell>Маршрут</TableCell>
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
                                        {trip.routes && trip.routes.length > 0 ? (
                                            <Chip
                                                icon={<Map />}
                                                label={`${trip.routes.length} `}
                                                size="small"
                                                color="info"
                                                variant="outlined"
                                            />
                                        ) : (
                                            <Typography variant="caption" color="textSecondary">
                                                Нет данных
                                            </Typography>
                                        )}
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
                                            onClick={(e) => handleMenuOpen(e, trip)}
                                            size="small"
                                            title="Дополнительно"
                                        >
                                            <MoreVert />
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
                    {selectedTrip ? '✏️ Редактирование поездки' : '➕ Создание новой поездки'}
                </DialogTitle>
                <DialogContent>
                    <TripForm trip={selectedTrip} onSubmit={handleSubmit} onCancel={handleClose} />
                </DialogContent>
            </Dialog>

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleViewMap}>
                    <ListItemIcon>
                        <Map fontSize="small" />
                    </ListItemIcon>
                    Просмотр маршрута
                </MenuItem>
                <MenuItem onClick={() => handleExport('excel')}>
                    <ListItemIcon>
                        <TableChart fontSize="small" />
                    </ListItemIcon>
                    Экспорт в Excel
                </MenuItem>
                <MenuItem onClick={() => selectedMenuTrip && handleDelete(selectedMenuTrip.id)} sx={{ color: 'error.main' }}>
                    <ListItemIcon sx={{ color: 'error.main' }}>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    Удалить
                </MenuItem>
            </Menu>

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