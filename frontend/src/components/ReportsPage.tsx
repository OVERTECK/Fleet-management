'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    Button,
    Tabs,
    Tab,
    Alert,
    List,
    ListItem,
    ListItemIcon,
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    TableChart,
    Download,
    Assessment,
    Timeline,
    InsertDriveFile,
    Delete,
    Visibility,
    Summarize,
} from '@mui/icons-material';
import { reportService } from '@/services/reportService';

interface Report {
    id: string;
    name: string;
    type: 'trips' | 'common';
    date: string;
    size: string;
    status: 'completed' | 'processing' | 'error';
}

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [reports, setReports] = useState<Report[]>([
        { id: '1', name: 'Отчет по поездкам', type: 'trips', date: new Date().toISOString().split('T')[0], size: '2.4 MB', status: 'completed' },
        { id: '2', name: 'Общий отчет', type: 'common', date: new Date().toISOString().split('T')[0], size: '2.6 MB', status: 'completed' },
    ]);

    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [reportType, setReportType] = useState<'trips' | 'common'>('trips');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [loading, setLoading] = useState({ export: false });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleGenerateReport = async (type: 'trips' | 'common') => {
        setLoading({ export: true });

        try {
            let blob: Blob;

            if (type === 'trips') {
                blob = await reportService.exportTripsReport();
            } else {
                blob = await reportService.exportCommonReport();
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = type === 'trips' ? 'отчет_поездок.xlsx' : 'общий_отчет.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            const newReport: Report = {
                id: Date.now().toString(),
                name: type === 'trips' ? 'Отчет по поездкам' : 'Общий отчет',
                type,
                date: new Date().toISOString().split('T')[0],
                size: `${(blob.size / 1024 / 1024).toFixed(1)} MB`,
                status: 'completed'
            };

            setReports([newReport, ...reports]);
            setSnackbar({
                open: true,
                message: type === 'trips' ? 'Отчет по поездкам успешно сгенерирован' : 'Общий отчет успешно сгенерирован',
                severity: 'success'
            });

        } catch (error: any) {
            console.error('Error generating report:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Ошибка при генерации отчета',
                severity: 'error'
            });
        } finally {
            setLoading({ export: false });
        }
    };

    const handleExport = async (report?: Report) => {
        setLoading({ export: true });

        try {
            let blob: Blob;

            if (report?.type === 'common' || (!report && reportType === 'common')) {
                blob = await reportService.exportCommonReport();
            } else {
                blob = await reportService.exportTripsReport();
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = report ? `${report.name}.xlsx` : (reportType === 'trips' ? 'отчет_поездок.xlsx' : 'общий_отчет.xlsx');
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setSnackbar({ open: true, message: 'Экспорт успешно выполнен', severity: 'success' });

        } catch (error: any) {
            console.error('Error exporting report:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Ошибка при экспорте данных',
                severity: 'error'
            });
        } finally {
            setLoading({ export: false });
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

    const getReportTypeText = (type: string) => {
        switch (type) {
            case 'trips': return 'Отчет по поездкам';
            case 'common': return 'Общий отчет';
            default: return 'Неизвестно';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    📊 Отчеты
                </Typography>
                <Chip
                    label={`Всего отчетов: ${reports.length}`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Генерация отчетов" />
                <Tab label="История отчетов" />
                <Tab label="Экспорт" />
            </Tabs>

            {activeTab === 0 && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TableChart /> Генерация отчетов
                    </Typography>

                    <Alert severity="info" sx={{ mb: 3 }}>
                        Выберите тип отчета для генерации в формате Excel
                    </Alert>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                            Выберите тип отчета
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Тип отчета</InputLabel>
                            <Select
                                value={reportType}
                                label="Тип отчета"
                                onChange={(e) => setReportType(e.target.value as 'trips' | 'common')}
                            >
                                <MenuItem value="trips">Отчет по поездкам</MenuItem>
                                <MenuItem value="common">Общий отчет</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        {reportType === 'trips' ? (
                            <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    📋 Отчет по поездкам
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Будет сгенерирован Excel файл со всеми поездками. Содержит следующие колонки:
                                    Id поездки, Пробег в км, Количество потраченного топлива,
                                    Время начала, Время конца, Id пользователя, Id водителя, Id машины
                                </Typography>
                            </Alert>
                        ) : (
                            <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    📊 Общий отчет
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Будет сгенерирован Excel файл с общей статистикой по поездкам.
                                    Содержит детали поездок плюс общие показатели: общий пробег,
                                    общее количество затраченного топлива и общее количество поездок.
                                </Typography>
                            </Alert>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={loading.export ? <CircularProgress size={20} color="inherit" /> :
                                (reportType === 'trips' ? <TableChart /> : <Summarize />)}
                            onClick={() => handleGenerateReport(reportType)}
                            size="large"
                            disabled={loading.export}
                        >
                            {loading.export ? 'Генерация...' :
                                (reportType === 'trips' ? 'Создать отчет по поездкам' : 'Создать общий отчет')}
                        </Button>
                    </Box>
                </Paper>
            )}

            {activeTab === 1 && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">
                            📁 История отчетов
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
                                    <ListItemIcon sx={{ color: report.type === 'trips' ? 'primary.main' : 'secondary.main' }}>
                                        {report.type === 'trips' ? <TableChart /> : <Summarize />}
                                    </ListItemIcon>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <Typography variant="body1" fontWeight="medium">
                                                {report.name}
                                            </Typography>
                                            <Chip
                                                label={getReportTypeText(report.type)}
                                                size="small"
                                                color={report.type === 'trips' ? 'primary' : 'secondary'}
                                                variant="outlined"
                                            />
                                            <Chip
                                                label={getStatusText(report.status)}
                                                size="small"
                                                color={getStatusColor(report.status) as any}
                                                variant="outlined"
                                            />
                                        </Box>
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
                                    </Box>
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
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Download /> Экспорт отчетов
                    </Typography>

                    <Alert severity="info" sx={{ mb: 3 }}>
                        Экспортируйте данные в Excel для дальнейшего анализа
                    </Alert>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                            Выберите тип отчета для экспорта
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Тип отчета</InputLabel>
                            <Select
                                value={reportType}
                                label="Тип отчета"
                                onChange={(e) => setReportType(e.target.value as 'trips' | 'common')}
                            >
                                <MenuItem value="trips">Отчет по поездкам</MenuItem>
                                <MenuItem value="common">Общий отчет</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                            <Card variant="outlined" sx={{ flex: 1 }}>
                                <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <TableChart sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h6" gutterBottom>
                                        Отчет по поездкам
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3, flexGrow: 1 }}>
                                        Экспорт всех поездок с детальной информацией
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={loading.export ? <CircularProgress size={20} color="inherit" /> : <Download />}
                                        onClick={() => handleExport()}
                                        disabled={loading.export}
                                        fullWidth
                                        sx={{ mt: 'auto' }}
                                    >
                                        {loading.export ? 'Экспорт...' : 'Экспортировать отчет по поездкам'}
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card variant="outlined" sx={{ flex: 1 }}>
                                <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Summarize sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                                    <Typography variant="h6" gutterBottom>
                                        Общий отчет
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3, flexGrow: 1 }}>
                                        Экспорт общей статистики по всем поездкам
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        startIcon={loading.export ? <CircularProgress size={20} color="inherit" /> : <Download />}
                                        onClick={() => {
                                            setReportType('common');
                                            handleExport();
                                        }}
                                        disabled={loading.export}
                                        fullWidth
                                        sx={{ mt: 'auto' }}
                                    >
                                        {loading.export ? 'Экспорт...' : 'Экспортировать общий отчет'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Box>

                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    Формат отчетов
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary" component="div">
                                            <strong>Отчет по поездкам:</strong>
                                            <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                                                <li>Id поездки</li>
                                                <li>Пробег в км</li>
                                                <li>Количество потраченного топлива (литры)</li>
                                                <li>Время начала и окончания</li>
                                                <li>Id пользователя, водителя, машины</li>
                                            </Box>
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" color="textSecondary" component="div">
                                            <strong>Общий отчет:</strong>
                                            <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                                                <li>Все данные из отчета по поездкам</li>
                                                <li>Общее количество пробега</li>
                                                <li>Общее количество затраченного топлива</li>
                                                <li>Общее количество поездок</li>
                                            </Box>
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Paper>
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
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Тип отчета
                                    </Typography>
                                    <Typography variant="body1">
                                        {getReportTypeText(selectedReport.type)}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Дата создания
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(selectedReport.date)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Размер файла
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedReport.size}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Статус
                                    </Typography>
                                    <Chip
                                        label={getStatusText(selectedReport.status)}
                                        color={getStatusColor(selectedReport.status) as any}
                                    />
                                </Box>
                            </Box>
                            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                                {selectedReport.type === 'trips' ?
                                    <TableChart sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} /> :
                                    <Summarize sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                                }
                                <Typography variant="body1" gutterBottom>
                                    {selectedReport.type === 'trips' ? 'Отчет по поездкам' : 'Общий отчет'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                    {selectedReport.type === 'trips'
                                        ? 'Содержит детальную информацию о всех поездках'
                                        : 'Содержит общую статистику по всем поездкам'}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color={selectedReport.type === 'trips' ? 'primary' : 'secondary'}
                                    startIcon={<Download />}
                                    onClick={() => handleExport(selectedReport)}
                                >
                                    Скачать Excel файл
                                </Button>
                            </Paper>
                        </Box>
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