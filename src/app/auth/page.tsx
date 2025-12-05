'use client';

import { useState } from 'react';
import { Box, Paper, Tab, Tabs, Typography, Container, Alert } from '@mui/material';
import LoginForm from '@/components/forms/LoginForm';
import RegistrationForm from '@/components/forms/RegistrationForm';
import ClientOnly from '@/components/ClientOnly';

function TabPanel({ children, value, index }: any) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function AuthPage() {
    const [tabValue, setTabValue] = useState(0);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleTabChange = (e: any, newValue: number) => {
        setTabValue(newValue);
        setError('');
        setSuccess('');
    };

    return (
        <ClientOnly>
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                onSuccess={(msg) => {
                                    setSuccess(msg);
                                    setError('');
                                }}
                                onError={(msg) => {
                                    setError(msg);
                                    setSuccess('');
                                }}
                            />
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <RegistrationForm
                                onSuccess={(msg) => {
                                    setSuccess(msg);
                                    setError('');
                                }}
                                onError={(msg) => {
                                    setError(msg);
                                    setSuccess('');
                                }}
                            />
                        </TabPanel>
                    </Paper>
                </Box>
            </Container>
        </ClientOnly>
    );
}