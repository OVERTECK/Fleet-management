import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProviderServerWrapper } from './auth-provider-server-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Управление автопарком',
  description: 'Система управления автопарком',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className} suppressHydrationWarning>
        <AuthProviderServerWrapper>
          {children}
        </AuthProviderServerWrapper>
      </body>
    </html>
  );
}