'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    Tabs,
    Tab,
    TextField,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    LinearProgress,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import {
    TableChart,
    Upload,
    Download,
    Assessment,
    Timeline,
    InsertDriveFile,
    Delete,
    Visibility,
    DateRange,
} from '@mui/icons-material';
import { reportService } from '@/services/reportService';

interface Report {
    id: string;
    name: string;
    type: 'trip';
    date: string;
    size: string;
    status: 'completed' | 'processing' | 'error';
}

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [reports, setReports] = useState<Report[]>([
        { id: '1', name: 'Отчет по поездкам за сентябрь', type: 'trip', date: '2024-09-30', size: '2.4 MB', status: 'completed' },
        { id: '2', name: 'Отчет по поездкам за октябрь', type: 'trip', date: '2024-10-31', size: '2.6 MB', status: 'completed' },
    ]);

    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [reportDateRange, setReportDateRange] = useState({
        start: '',
        end: '',
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [loading, setLoading] = useState({ export: false, import: false });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleGenerateReport = async () => {
        if (!reportDateRange.start || !reportDateRange.end) {
            setSnackbar({ open: true, message: 'Пожалуйста, выберите период для отчета', severity: 'error' });
            return;
        }

        setLoading({ ...loading, export: true });

        try {
            // Получаем данные из бэкенда
            const blob = await reportService.exportTripsByDate(reportDateRange.start, reportDateRange.end);

            // Создаем ссылку для скачивания
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `отчет_поездок_${reportDateRange.start}_${reportDateRange.end}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Добавляем отчет в историю
            const newReport: Report = {
                id: Date.now().toString(),
                name: `Отчет по поездкам за период ${formatDate(reportDateRange.start)} - ${formatDate(reportDateRange.end)}`,
                type: 'trip',
                date: new Date().toISOString().split('T')[0],
                size: `${(blob.size / 1024 / 1024).toFixed(1)} MB`,
                status: 'completed'
            };

            setReports([newReport, ...reports]);
            setSnackbar({ open: true, message: 'Отчет успешно сгенерирован и скачан', severity: 'success' });

        } catch (error: any) {
            console.error('Error generating report:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Ошибка при генерации отчета',
                severity: 'error'
            });
        } finally {
            setLoading({ ...loading, export: false });
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Проверяем расширение файла
        if (!file.name.match(/\.(xlsx|xls)$/i)) {
            setSnackbar({ open: true, message: 'Пожалуйста, выберите файл Excel (.xlsx или .xls)', severity: 'error' });
            return;
        }

        setLoading({ ...loading, import: true });

        try {
            // Отправляем файл на бэкенд
            const result = await reportService.importTrips(file);

            setSnackbar({
                open: true,
                message: `Успешно импортировано ${result.importedCount || 'данные'} поездок`,
                severity: 'success'
            });

        } catch (error: any) {
            console.error('Error importing trips:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Ошибка при импорте данных',
                severity: 'error'
            });
        } finally {
            setLoading({ ...loading, import: false });
            // Очищаем input
            event.target.value = '';
        }
    };

    const handleExport = async (report?: Report) => {
        setLoading({ ...loading, export: true });

        try {
            // Экспорт всех поездок
            const blob = await reportService.exportTrips();

            // Создаем ссылку для скачивания
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = report ? `${report.name}.xlsx` : 'все_поездки.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setSnackbar({ open: true, message: 'Экспорт успешно выполнен', severity: 'success' });

        } catch (error: any) {
            console.error('Error exporting trips:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Ошибка при экспорте данных',
                severity: 'error'
            });
        } finally {
            setLoading({ ...loading, export: false });
        }
    };

    const handleDeleteReport = (id: string) => {
        if (confirm('Вы уверены, что хотите удалить этот отчет?')) {
            setReports(reports.filter(report => report.id !== id));
            setSnackbar({ open: true, message: 'Отчет удален', severity: 'success' });
        }
    };

    const handleViewReport = (report: Report) => {
        setSelectedReport(report);
        setReportDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setReportDialogOpen(false);
        setSelectedReport(null);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'success';
            case 'processing': return 'warning';
            case 'error': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Готов';
            case 'processing': return 'В обработке';
            case 'error': return 'Ошибка';
            default: return 'Неизвестно';
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    📊 Отчеты по поездкам
                </Typography>
                <Chip
                    label={`Всего отчетов: ${reports.length}`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Создание отчета" />
                <Tab label="История отчетов" />
                <Tab label="Импорт/Экспорт" />
            </Tabs>

            {activeTab === 0 && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TableChart /> Создание отчета по поездкам
                            </Typography>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                Выберите период для генерации отчета по поездкам в формате Excel
                            </Alert>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        <DateRange sx={{ verticalAlign: 'middle', mr: 1 }} />
                                        Период отчета
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                label="Начальная дата"
                                                slotProps={{
                                                    inputLabel: {
                                                        shrink: true
                                                    }
                                                }}
                                                value={reportDateRange.start}
                                                onChange={(e) => setReportDateRange({ ...reportDateRange, start: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                label="Конечная дата"
                                                slotProps={{
                                                    inputLabel: {
                                                        shrink: true
                                                    }
                                                }}
                                                value={reportDateRange.end}
                                                onChange={(e) => setReportDateRange({ ...reportDateRange, end: e.target.value })}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Alert severity="info" variant="outlined">
                                        <Typography variant="subtitle2" gutterBottom>
                                            Отчет по поездкам
                                        </Typography>
                                        <Typography variant="body2">
                                            Будет сгенерирован Excel файл со всеми поездками за выбранный период
                                        </Typography>
                                    </Alert>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={loading.export ? <CircularProgress size={20} color="inherit" /> : <TableChart />}
                                            onClick={handleGenerateReport}
                                            size="large"
                                            disabled={loading.export || !reportDateRange.start || !reportDateRange.end}
                                        >
                                            {loading.export ? 'Генерация...' : 'Создать отчет Excel'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Timeline /> Статистика
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box>
                                                    <Typography color="textSecondary" variant="body2">
                                                        Всего отчетов
                                                    </Typography>
                                                    <Typography variant="h4">
                                                        {reports.length}
                                                    </Typography>
                                                </Box>
                                                <Assessment sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Card>
                                        <CardContent>
                                            <Typography color="textSecondary" variant="body2" gutterBottom>
                                                Последние отчеты
                                            </Typography>
                                            <List dense>
                                                {reports.slice(0, 3).map((report) => (
                                                    <ListItem key={report.id} disablePadding sx={{ py: 0.5 }}>
                                                        <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                                                            <InsertDriveFile />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={report.name}
                                                            primaryTypographyProps={{ variant: 'body2' }}
                                                        />
                                                        <Chip
                                                            label={getStatusText(report.status)}
                                                            size="small"
                                                            color={getStatusColor(report.status) as any}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {activeTab === 1 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">
                            📁 История отчетов по поездкам
                        </Typography>
                    </Box>

                    {reports.length === 0 ? (
                        <Alert severity="info">
                            У вас еще нет созданных отчетов
                        </Alert>
                    ) : (
                        <List>
                            {reports.map((report) => (
                                <ListItem
                                    key={report.id}
                                    divider
                                    sx={{
                                        '&:hover': { backgroundColor: 'action.hover' },
                                        py: 2
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'primary.main' }}>
                                        <InsertDriveFile />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography fontWeight="medium">
                                                    {report.name}
                                                </Typography>
                                                <Chip
                                                    label={getStatusText(report.status)}
                                                    size="small"
                                                    color={getStatusColor(report.status) as any}
                                                    variant="outlined"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Создан: {formatDate(report.date)}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Размер: {report.size}
                                                </Typography>
                                                {report.status === 'processing' && (
                                                    <LinearProgress sx={{ width: 100 }} />
                                                )}
                                            </Box>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleViewReport(report)}
                                                title="Просмотр"
                                            >
                                                <Visibility />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleExport(report)}
                                                title="Скачать Excel"
                                            >
                                                <Download />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleDeleteReport(report.id)}
                                                title="Удалить"
                                                sx={{ color: 'error.main' }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            )}

            {activeTab === 2 && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Upload /> Импорт поездок из Excel
                            </Typography>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                Загрузите Excel файл с данными о поездках для импорта в систему
                            </Alert>

                            <Box sx={{
                                border: '2px dashed',
                                borderColor: 'divider',
                                borderRadius: 2,
                                p: 4,
                                textAlign: 'center',
                                mb: 3
                            }}>
                                <Upload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="body1" gutterBottom>
                                    Перетащите Excel файл сюда или нажмите для выбора
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
                                    Поддерживаемые форматы: .xlsx, .xls
                                </Typography>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={loading.import ? <CircularProgress size={20} color="inherit" /> : <Upload />}
                                    disabled={loading.import}
                                >
                                    {loading.import ? 'Импорт...' : 'Выбрать Excel файл'}
                                    <input
                                        type="file"
                                        hidden
                                        accept=".xlsx,.xls"
                                        onChange={handleImport}
                                        disabled={loading.import}
                                    />
                                </Button>
                            </Box>

                            <Alert severity="warning">
                                <Typography variant="body2">
                                    Файл должен содержать следующие колонки: Id поездки, Пробег (км), Расход топлива (л),
                                    Время начала, Время окончания, Id пользователя, Id водителя, Id машины
                                </Typography>
                            </Alert>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Download /> Экспорт поездок в Excel
                            </Typography>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                Экспортируйте данные о поездках в Excel для дальнейшего анализа
                            </Alert>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Card variant="outlined">
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <TableChart sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                            <Typography variant="h6" gutterBottom>
                                                Экспорт всех поездок
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
                                                Будет создан Excel файл со всеми поездками из системы
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                startIcon={loading.export ? <CircularProgress size={20} color="inherit" /> : <Download />}
                                                onClick={() => handleExport()}
                                                disabled={loading.export}
                                                fullWidth
                                            >
                                                {loading.export ? 'Экспорт...' : 'Экспортировать в Excel'}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Инструкция по формату файла
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                                                    <li>Формат: Excel (.xlsx)</li>
                                                    <li>Первая строка должна содержать заголовки колонок</li>
                                                    <li>Обязательные колонки: Id поездки, Пробег, Расход топлива</li>
                                                    <li>Даты должны быть в формате ГГГГ-ММ-ДД ЧЧ:ММ:СС</li>
                                                </Box>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Диалог просмотра отчета */}
            <Dialog
                open={reportDialogOpen}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedReport?.name}
                </DialogTitle>
                <DialogContent>
                    {selectedReport && (
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Тип отчета
                                </Typography>
                                <Typography variant="body1">
                                    Отчет по поездкам
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Дата создания
                                </Typography>
                                <Typography variant="body1">
                                    {formatDate(selectedReport.date)}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Размер файла
                                </Typography>
                                <Typography variant="body1">
                                    {selectedReport.size}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Статус
                                </Typography>
                                <Chip
                                    label={getStatusText(selectedReport.status)}
                                    color={getStatusColor(selectedReport.status) as any}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                                    <TableChart sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="body1" gutterBottom>
                                        Excel отчет по поездкам
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                        Содержит данные о поездках за выбранный период
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Download />}
                                        onClick={() => selectedReport && handleExport(selectedReport)}
                                    >
                                        Скачать Excel файл
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}