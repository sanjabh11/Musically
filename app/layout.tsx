import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider"
import ErrorBoundary from '@/components/error-boundary';

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
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}