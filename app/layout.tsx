import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import ErrorBoundary from '@/components/error-boundary';
import AuthProvider from '@/components/AuthProvider';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VoiceVibe - Record Your Music',
  description: 'Record, upload, and share your music with VoiceVibe',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between">
                  <Link href="/" className="text-white font-bold">VoiceVibe</Link>
                  <Link href="/my-page" className="text-white">My Page</Link>
                </div>
              </nav>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}