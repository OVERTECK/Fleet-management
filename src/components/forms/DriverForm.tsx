'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    MenuItem,
    Grid as Grid,
    Chip,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    SelectChangeEvent,
} from '@mui/material';
import { Driver, CreateDriverRequest } from '@/types';

interface DriverFormProps {
    driver?: Driver | null;
    onSubmit: (data: CreateDriverRequest) => void;
    onCancel: () => void;
}

// Доступные категории прав
const licenseCategories = [
    'A', 'A1', 'B', 'B1', 'C', 'C1', 'D', 'D1', 'BE', 'CE', 'C1E', 'DE', 'D1E', 'M', 'Tm', 'Tb'
];

export default function DriverForm({ driver, onSubmit, onCancel }: DriverFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<CreateDriverRequest>();

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useEffect(() => {
        if (driver) {
            // При редактировании - заполняем форму данными водителя
            reset({
                name: driver.name,
                lastName: driver.lastName,
                pathronymic: driver.pathronymic || '', // Изменено поле
                contactData: driver.contactData,
                categoryDrive: driver.categoryDrive,
            });
            // Парсим категории из строки в массив
            const categories = driver.categoryDrive.split(',').map(cat => cat.trim()).filter(Boolean);
            setSelectedCategories(categories);
        } else {
            // При создании - пустая форма
            reset({
                name: '',
                lastName: '',
                pathronymic: '',
                contactData: '',
                categoryDrive: '',
            });
            setSelectedCategories([]);
        }
    }, [driver, reset]);

    // Обработчик изменения выбранных категорий
    const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;
        const categories = typeof value === 'string' ? value.split(',') : value;
        setSelectedCategories(categories);
        setValue('categoryDrive', categories.join(', '));
    };

    // Удаление категории
    const handleDeleteCategory = (categoryToDelete: string) => {
        const newCategories = selectedCategories.filter(category => category !== categoryToDelete);
        setSelectedCategories(newCategories);
        setValue('categoryDrive', newCategories.join(', '));
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        fullWidth
                        label="Фамилия"
                        variant="outlined"
                        {...register('lastName', {
                            required: 'Фамилия обязательна',
                            minLength: { value: 1, message: 'Фамилия не может быть пустой' }
                        })}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        fullWidth
                        label="Имя"
                        variant="outlined"
                        {...register('name', {
                            required: 'Имя обязательно',
                            minLength: { value: 1, message: 'Имя не может быть пустым' }
                        })}
                        error={!!errors.name}
                        helperText={errors.name?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        fullWidth
                        label="Отчество"
                        variant="outlined"
                        {...register('pathronymic')} // Изменено поле
                        error={!!errors.pathronymic}
                        helperText={errors.pathronymic?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        label="Контактные данные"
                        variant="outlined"
                        placeholder="Телефон или email"
                        {...register('contactData', {
                            required: 'Контактные данные обязательны',
                            minLength: { value: 3, message: 'Контактные данные слишком короткие' }
                        })}
                        error={!!errors.contactData}
                        helperText={errors.contactData?.message as string}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth error={!!errors.categoryDrive}>
                        <InputLabel id="category-drive-label">Категории прав</InputLabel>
                        <Select
                            labelId="category-drive-label"
                            multiple
                            value={selectedCategories}
                            onChange={handleCategoryChange}
                            input={<OutlinedInput label="Категории прав" />}
                            renderValue={() => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selectedCategories.map((category) => (
                                        <Chip
                                            key={category}
                                            label={category}
                                            size="small"
                                            onDelete={() => handleDeleteCategory(category)}
                                            onMouseDown={(event) => event.stopPropagation()}
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {licenseCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <input
                        type="hidden"
                        {...register('categoryDrive', {
                            required: 'Выберите хотя бы одну категорию',
                            validate: (value) => value && value.trim().length > 0 || 'Выберите хотя бы одну категорию'
                        })}
                    />
                    {errors.categoryDrive && (
                        <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.5 }}>
                            {errors.categoryDrive.message as string}
                        </Box>
                    )}
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    disabled={isSubmitting}
                >
                    Отмена
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Сохранение...' : (driver ? 'Обновить' : 'Создать')}
                </Button>
            </Box>
        </Box>
    );
}