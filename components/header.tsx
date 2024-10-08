"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MicIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import AuthButton from './auth-button';

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <MicIcon className="h-6 w-6" />
          <span className="font-bold text-xl">VoiceVibe</span>
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/my-page">My Page</Link></li>
            <li>
              <Button variant="outline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                Toggle Theme
              </Button>
            </li>
            <li><AuthButton /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}