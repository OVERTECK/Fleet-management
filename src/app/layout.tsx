'use client';

import { Inter } from 'next/font/google';
import './globals.css';
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
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="ru">
      <body className={inter.className}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                🚗 Управление автопарком
              </Typography>
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
      </body>
    </html>
  );
}