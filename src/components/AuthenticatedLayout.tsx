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
    Analytics,
    Assessment,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import ClientOnly from '@/components/ClientOnly';

const drawerWidth = 240;

const ROLE_NAMES: Record<number, string> = {
    1: 'Водитель',
    2: 'Диспетчер',
    3: 'Администратор'
};

const baseMenuItems = [
    { text: 'Дашборд', icon: <Dashboard />, path: '/dashboard', roles: [1, 2, 3] },
    { text: 'Поездки', icon: <Route />, path: '/trips', roles: [1, 2, 3] },
];

const managementMenuItems = [
    { text: 'Автомобили', icon: <DirectionsCar />, path: '/cars', roles: [2, 3] },
    { text: 'Водители', icon: <People />, path: '/drivers', roles: [2, 3] },
    { text: 'Назначения', icon: <Assignment />, path: '/assignments', roles: [2, 3] },
    { text: 'Техобслуживание', icon: <Build />, path: '/maintenance', roles: [2, 3] },
    { text: 'Заправки', icon: <LocalGasStation />, path: '/refueling', roles: [2, 3] },
    { text: 'Отчеты', icon: <Assessment />, path: '/reports', roles: [2, 3] },
];

const adminMenuItems = [
    { text: 'Аналитика', icon: <Analytics />, path: '/analytics', roles: [3] },
];

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const getUserRoleName = () => {
        if (!user || !user.roleId) return 'Пользователь';
        return ROLE_NAMES[user.roleId] || 'Пользователь';
    };

    const userRoleName = getUserRoleName();
    const userRoleId = user?.roleId || 0;

    const getMenuItems = () => {
        const allMenuItems = [...baseMenuItems, ...managementMenuItems, ...adminMenuItems];
        return allMenuItems.filter(item => item.roles.includes(userRoleId));
    };

    const menuItems = getMenuItems();

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>Загрузка...</Typography>
            </Box>
        );
    }

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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                                {user.login} ({userRoleName})
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
                        </Box>
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