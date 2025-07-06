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
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li>
            <Link href="/transactions" className="hover:text-primary transition-colors">Transactions</Link>
          </li>
          <li>
            <Link href="/budget" className="hover:text-primary transition-colors">Categories</Link>
          </li>
          <li>

          </li>
        </ul>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <div className="hidden md:block text-sm text-primary">
            Hi there 
          </div>

          
        </div>
      </nav>
    </header>
  );
}
