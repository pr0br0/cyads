import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/ThemeProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../app/globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin', 'greek', 'cyrillic'] });

export const metadata = {
  title: 'CYADS - Classified Ads Platform',
  description: 'Buy and sell items in your local community',
  keywords: 'classifieds, cyprus, ads, property, jobs, services, vehicles',
  authors: [{ name: 'CyAds Team' }],
  creator: 'CyAds',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 