'use client';

import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    CssBaseline,
} from '@mui/material';
import {
    DirectionsCar,
    People,
    Route,
    Build,
    LocalGasStation,
    Assignment,
    Dashboard,
    ExitToApp,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import ClientOnly from '@/components/ClientOnly';

const drawerWidth = 240;

const menuItems = [
    { text: 'Дашборд', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Автомобили', icon: <DirectionsCar />, path: '/cars' },
    { text: 'Водители', icon: <People />, path: '/drivers' },
    { text: 'Поездки', icon: <Route />, path: '/trips' },
    { text: 'Техобслуживание', icon: <Build />, path: '/maintenance' },
    { text: 'Заправки', icon: <LocalGasStation />, path: '/refueling' },
    { text: 'Назначения', icon: <Assignment />, path: '/assignments' },
];

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { setIsAuthenticated } = useAuth();

    const handleLogout = () => {
        // Удаляем токен
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setIsAuthenticated(false);
        router.push('/auth');
    };

    return (
        <ClientOnly>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                >
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" noWrap component="div">
                            🚗 Управление автопарком
                        </Typography>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: 'auto', mr: 1 }}>
                                <ExitToApp />
                            </ListItemIcon>
                            <ListItemText primary="Выйти" />
                        </ListItemButton>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            {menuItems.map((item) => (
                                <ListItemButton
                                    key={item.text}
                                    component={Link}
                                    href={item.path}
                                    selected={pathname === item.path}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    {children}
                </Box>
            </Box>
        </ClientOnly>
    );
}