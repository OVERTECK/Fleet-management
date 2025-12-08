'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid as Grid,
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
    MenuItem,
    Chip,
    LinearProgress,
} from '@mui/material';
import {
    TableChart,
    Upload,
    Download,
    Assessment,
    Timeline,
    BarChart,
    PieChart,
    InsertDriveFile,
    Delete,
    Visibility,
    Print,
    Share,
    FilterAlt,
    DateRange,
    AttachMoney,
    LocalGasStation,
    DirectionsCar,
    People,
    Add,
} from '@mui/icons-material';

interface Report {
    id: string;
    name: string;
    type: 'trip' | 'maintenance' | 'fuel' | 'general' | 'financial';
    date: string;
    size: string;
    status: 'completed' | 'processing' | 'error';
}

interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [reports, setReports] = useState<Report[]>([
        { id: '1', name: 'Отчет по поездкам за сентябрь', type: 'trip', date: '2024-09-30', size: '2.4 MB', status: 'completed' },
        { id: '2', name: 'Затраты на ТО (Q3 2024)', type: 'maintenance', date: '2024-09-28', size: '1.8 MB', status: 'completed' },
        { id: '3', name: 'Анализ расхода топлива', type: 'fuel', date: '2024-09-25', size: '3.2 MB', status: 'completed' },
        { id: '4', name: 'Общий отчет по автопарку', type: 'general', date: '2024-09-20', size: '4.1 MB', status: 'completed' },
        { id: '5', name: 'Финансовый отчет (август)', type: 'financial', date: '2024-08-31', size: '5.2 MB', status: 'completed' },
        { id: '6', name: 'Отчет по водителям', type: 'general', date: '2024-10-01', size: '2.1 MB', status: 'processing' },
    ]);

    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [reportDateRange, setReportDateRange] = useState({
        start: '',
        end: '',
    });
    const [reportType, setReportType] = useState('trip');
    const [exportFormat, setExportFormat] = useState('excel');

    const reportTemplates: ReportTemplate[] = [
        {
            id: 'trip',
            name: 'Отчет по поездкам',
            description: 'Подробная информация о всех поездках за период',
            icon: <Timeline />,
            color: '#1976d2'
        },
        {
            id: 'maintenance',
            name: 'Затраты на ТО',
            description: 'Анализ расходов на техническое обслуживание',
            icon: <Assessment />,
            color: '#2e7d32'
        },
        {
            id: 'fuel',
            name: 'Расход топлива',
            description: 'Анализ расхода топлива по автомобилям',
            icon: <LocalGasStation />,
            color: '#ed6c02'
        },
        {
            id: 'financial',
            name: 'Финансовый отчет',
            description: 'Общий финансовый анализ автопарка',
            icon: <AttachMoney />,
            color: '#9c27b0'
        },
        {
            id: 'general',
            name: 'Общий отчет',
            description: 'Полная сводка по всем показателям',
            icon: <PieChart />,
            color: '#757575'
        },
    ];

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleGenerateReport = () => {
        if (!reportDateRange.start || !reportDateRange.end) {
            alert('Пожалуйста, выберите период для отчета');
            return;
        }

        const newReport: Report = {
            id: Date.now().toString(),
            name: `${getReportTypeName(reportType)} за период ${formatDate(reportDateRange.start)} - ${formatDate(reportDateRange.end)}`,
            type: reportType as any,
            date: new Date().toISOString().split('T')[0],
            size: '0 MB',
            status: 'processing'
        };

        setReports([newReport, ...reports]);

        // Имитация процесса генерации
        setTimeout(() => {
            setReports(prev => prev.map(r =>
                r.id === newReport.id
                    ? { ...r, size: `${(Math.random() * 5 + 1).toFixed(1)} MB`, status: 'completed' }
                    : r
            ));
        }, 2000);

        alert(`Отчет "${newReport.name}" поставлен в очередь на генерацию`);
    };

    const handleImport = (type: string) => {
        setImportDialogOpen(true);
        alert(`Начало импорта ${type} данных`);
    };

    const handleExport = (format: string, report?: Report) => {
        if (report) {
            setSelectedReport(report);
        }

        const formatName = format === 'excel' ? 'Excel' : format;
        alert(`Функционал экспорта в ${formatName}${report ? ` отчета "${report.name}"` : ''} будет реализован позже`);
    };

    const handleDeleteReport = (id: string) => {
        if (confirm('Вы уверены, что хотите удалить этот отчет?')) {
            setReports(reports.filter(report => report.id !== id));
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

    const handleCloseImportDialog = () => {
        setImportDialogOpen(false);
    };

    const getTypeIcon = (type: string) => {
        const template = reportTemplates.find(t => t.id === type);
        return template?.icon || <InsertDriveFile />;
    };

    const getTypeColor = (type: string) => {
        const template = reportTemplates.find(t => t.id === type);
        return template?.color || '#757575';
    };

    const getReportTypeName = (type: string) => {
        const template = reportTemplates.find(t => t.id === type);
        return template?.name || 'Отчет';
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
                    📊 Отчеты
                </Typography>
                <Chip
                    label={`Всего отчетов: ${reports.length}`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Создание отчетов" />
                <Tab label="История отчетов" />
                <Tab label="Импорт/Экспорт" />
                <Tab label="Шаблоны" />
            </Tabs>

            {activeTab === 0 && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TableChart /> Создание нового отчета
                            </Typography>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                Выберите тип отчета, период и параметры для генерации
                            </Alert>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Тип отчета"
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                        sx={{ mb: 2 }}
                                    >
                                        {reportTemplates.map((template) => (
                                            <MenuItem key={template.id} value={template.id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{ color: template.color }}>
                                                        {template.icon}
                                                    </Box>
                                                    {template.name}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

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
                                    <Typography variant="subtitle2" gutterBottom>
                                        <FilterAlt sx={{ verticalAlign: 'middle', mr: 1 }} />
                                        Дополнительные параметры
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Формат экспорта"
                                                value={exportFormat}
                                                onChange={(e) => setExportFormat(e.target.value)}
                                            >
                                                <MenuItem value="excel">Excel таблица</MenuItem>
                                                <MenuItem value="csv">CSV файл</MenuItem>
                                                <MenuItem value="html">HTML страница</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Детализация"
                                                defaultValue="detailed"
                                            >
                                                <MenuItem value="summary">Сводный отчет</MenuItem>
                                                <MenuItem value="detailed">Детальный отчет</MenuItem>
                                                <MenuItem value="extended">Расширенный отчет</MenuItem>
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {reportTemplates.find(t => t.id === reportType) && (
                                    <Grid size={{ xs: 12 }}>
                                        <Alert severity="info" variant="outlined">
                                            <Typography variant="subtitle2" gutterBottom>
                                                {reportTemplates.find(t => t.id === reportType)?.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                {reportTemplates.find(t => t.id === reportType)?.description}
                                            </Typography>
                                        </Alert>
                                    </Grid>
                                )}

                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<TableChart />}
                                            onClick={handleGenerateReport}
                                            size="large"
                                        >
                                            Создать отчет
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<TableChart />}
                                            onClick={() => handleExport(exportFormat)}
                                            size="large"
                                        >
                                            Предварительный просмотр
                                        </Button>
                                        <Button
                                            variant="text"
                                            startIcon={<Print />}
                                            onClick={() => alert('Функционал печати будет реализован позже')}
                                        >
                                            Печать
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Timeline /> Быстрая статистика
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

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Card>
                                        <CardContent>
                                            <Typography color="textSecondary" variant="body2">
                                                Отчеты по поездкам
                                            </Typography>
                                            <Typography variant="h5">
                                                {reports.filter(r => r.type === 'trip').length}
                                            </Typography>
                                            <Button size="small" sx={{ mt: 1 }} onClick={() => setReportType('trip')}>
                                                Создать →
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Card>
                                        <CardContent>
                                            <Typography color="textSecondary" variant="body2">
                                                Финансовые отчеты
                                            </Typography>
                                            <Typography variant="h5">
                                                {reports.filter(r => r.type === 'financial').length}
                                            </Typography>
                                            <Button size="small" sx={{ mt: 1 }} onClick={() => setReportType('financial')}>
                                                Создать →
                                            </Button>
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
                                                        <ListItemIcon sx={{ minWidth: 36, color: getTypeColor(report.type) }}>
                                                            {getTypeIcon(report.type)}
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
                            📁 История сгенерированных отчетов
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<FilterAlt />}
                                size="small"
                            >
                                Фильтры
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DateRange />}
                                size="small"
                            >
                                Период
                            </Button>
                        </Box>
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
                                    <ListItemIcon sx={{ color: getTypeColor(report.type) }}>
                                        {getTypeIcon(report.type)}
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
                                                onClick={() => handleExport('excel', report)}
                                                title="Скачать Excel"
                                            >
                                                <TableChart />
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
                                <Upload /> Импорт данных
                            </Typography>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                Загрузите файлы для импорта данных в систему. Поддерживаются форматы CSV, Excel.
                            </Alert>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Импорт поездок
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Формат: CSV или Excel. Обязательные колонки: Автомобиль, Водитель, Дата, Пробег
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Upload />}
                                            onClick={() => handleImport('trip')}
                                            fullWidth
                                        >
                                            Загрузить файл
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Импорт записей ТО
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Формат: Excel. Колонки: Автомобиль, Вид работ, Дата, Стоимость
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Upload />}
                                            onClick={() => handleImport('maintenance')}
                                            fullWidth
                                        >
                                            Загрузить файл
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Импорт заправок
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Формат: CSV. Колонки: Автомобиль, Дата, Литры, Стоимость
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Upload />}
                                            onClick={() => handleImport('fuel')}
                                            fullWidth
                                        >
                                            Загрузить файл
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Box>

                            <Alert severity="warning">
                                <Typography variant="body2">
                                    Перед импортом убедитесь, что формат файла соответствует требованиям системы.
                                    Максимальный размер файла: 10MB.
                                </Typography>
                            </Alert>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Download /> Экспорт данных
                            </Typography>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                Экспортируйте данные из системы в различных форматах для дальнейшего анализа.
                            </Alert>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Card>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <TableChart sx={{ fontSize: 48, color: '#2e7d32', mb: 2 }} />
                                            <Typography variant="subtitle1" gutterBottom>
                                                Excel таблица
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                Структурированные данные для анализа
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleExport('excel')}
                                                fullWidth
                                            >
                                                Экспортировать
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Массовый экспорт
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<DirectionsCar />}
                                                    onClick={() => handleExport('cars')}
                                                >
                                                    Экспорт данных об автомобилях
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<People />}
                                                    onClick={() => handleExport('drivers')}
                                                >
                                                    Экспорт данных о водителях
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<Timeline />}
                                                    onClick={() => handleExport('all-trips')}
                                                >
                                                    Экспорт всех поездок
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<Assessment />}
                                                    onClick={() => handleExport('all-maintenance')}
                                                >
                                                    Экспорт всех записей ТО
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
                                * Все отчеты включают данные за выбранный период или все доступные данные
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {activeTab === 3 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        📋 Шаблоны отчетов
                    </Typography>

                    <Alert severity="info" sx={{ mb: 3 }}>
                        Используйте готовые шаблоны отчетов или создайте собственные
                    </Alert>

                    <Grid container spacing={3}>
                        {reportTemplates.map((template) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        border: reportType === template.id ? `2px solid ${template.color}` : undefined,
                                        '&:hover': {
                                            boxShadow: 4,
                                            transform: 'translateY(-2px)',
                                            transition: 'all 0.2s'
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 2
                                        }}>
                                            <Box sx={{
                                                backgroundColor: `${template.color}20`,
                                                p: 1,
                                                borderRadius: 1
                                            }}>
                                                <Box sx={{ color: template.color }}>
                                                    {template.icon}
                                                </Box>
                                            </Box>
                                            <Chip
                                                label={`${reports.filter(r => r.type === template.id).length} шт.`}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>

                                        <Typography variant="h6" gutterBottom>
                                            {template.name}
                                        </Typography>

                                        <Typography variant="body2" color="textSecondary" paragraph>
                                            {template.description}
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                            <Button
                                                variant={reportType === template.id ? "contained" : "outlined"}
                                                size="small"
                                                onClick={() => {
                                                    setReportType(template.id);
                                                    setActiveTab(0);
                                                }}
                                                sx={{
                                                    backgroundColor: reportType === template.id ? template.color : undefined
                                                }}
                                            >
                                                Использовать
                                            </Button>
                                            <Button
                                                variant="text"
                                                size="small"
                                                onClick={() => handleExport('excel')}
                                            >
                                                Пример
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ mt: 4, p: 3, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            Создание собственного шаблона
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Вы можете создать собственный шаблон отчета, выбрав нужные поля и параметры
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => alert('Функционал создания шаблонов будет реализован позже')}
                        >
                            Создать новый шаблон
                        </Button>
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
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Тип отчета
                                </Typography>
                                <Typography variant="body1">
                                    {getReportTypeName(selectedReport.type)}
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
                                    <InsertDriveFile sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="body1" gutterBottom>
                                        Предпросмотр отчета будет доступен после реализации функционала
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        В будущем здесь будет отображаться содержимое отчета
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        Закрыть
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Download />}
                        onClick={() => selectedReport && handleExport('excel', selectedReport)}
                    >
                        Скачать Excel
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Share />}
                        onClick={() => alert('Функционал публикации будет реализован позже')}
                    >
                        Поделиться
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог импорта */}
            <Dialog
                open={importDialogOpen}
                onClose={handleCloseImportDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Импорт данных
                </DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Выберите файл для импорта. Поддерживаются форматы .csv и .xlsx
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
                            Перетащите файл сюда или нажмите для выбора
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Максимальный размер файла: 10MB
                        </Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{ mt: 2 }}
                        >
                            Выбрать файл
                            <input type="file" hidden />
                        </Button>
                    </Box>
                    <Alert severity="warning">
                        <Typography variant="body2">
                            Перед импортом рекомендуется сделать резервную копию данных
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseImportDialog}>
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            alert('Импорт начат. Функционал будет реализован позже');
                            handleCloseImportDialog();
                        }}
                    >
                        Начать импорт
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}