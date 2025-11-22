'use client';

import { useState } from 'react';
import {
    Box,
    Paper,
    Tab,
    Tabs,
    Typography,
    Container,
    Alert,
} from '@mui/material';
import LoginForm from '@/components/forms/LoginForm';
import RegistrationForm from '@/components/forms/RegistrationForm';
import { useAuth } from '@/components/AuthProvider';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`auth-tabpanel-${index}`}
            aria-labelledby={`auth-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function AuthPage() {
    const [tabValue, setTabValue] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { setIsAuthenticated } = useAuth();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setError(null);
        setSuccess(null);
    };

    const handleAuthSuccess = (message: string) => {
        setSuccess(message);
        setError(null);
        setIsAuthenticated(true);
    };

    const handleAuthError = (message: string) => {
        setError(message);
        setSuccess(null);
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: '100vh',
                    py: 4,
                }}
            >
                <Paper elevation={3} sx={{ width: '100%', maxWidth: 400 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} centered>
                            <Tab label="Вход" />
                            <Tab label="Регистрация" />
                        </Tabs>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ m: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ m: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <TabPanel value={tabValue} index={0}>
                        <LoginForm
                            onSuccess={handleAuthSuccess}
                            onError={handleAuthError}
                        />
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <RegistrationForm
                            onSuccess={handleAuthSuccess}
                            onError={handleAuthError}
                        />
                    </TabPanel>
                </Paper>
            </Box>
        </Container>
    );
}