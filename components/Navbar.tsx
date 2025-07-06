'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="w-full border-b shadow-sm bg-background fixed z-10">
      <nav className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">

        <Link href="/" className="text-lg font-semibold">
          M<span className="text-primary">Wave</span>
        </Link>

        <ul className="hidden md:flex space-x-6 text-sm font-medium">
          <li>
            <Link href="/home" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li>
            <Link href="/students" className="hover:text-primary transition-colors">Students</Link>
          </li>
          <li>
            <Link href="/companies" className="hover:text-primary transition-colors">Companies</Link>
          </li>
          <li>
            <Link href="/notice" className="hover:text-primary transition-colors">Notice</Link>
          </li>
        </ul>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <div className="hidden md:block text-sm text-primary">
            Hi there 
          </div>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push('/home')}>Home</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/students')}>Students</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/companies')}>Companies</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/notice')}>Notice</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
}
