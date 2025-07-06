'use client';

import { Github, Linkedin } from 'lucide-react';
import Link from 'next/link';


export default function Footer() {
  
  return (
    <footer className="border-t fixed bottom-0 left-0 right-0 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col  justify-between items-center gap-3 text-sm text-muted-foreground">
        

       

        

     
        <div className="flex space-x-4">
          <Link href="https://github.com/Rheosta561" target="_blank" rel="noopener noreferrer">
            <Github className="w-5 h-5 hover:text-primary transition-colors" />
          </Link>
          <Link href="https://www.linkedin.com/in/anubhav-mishra-2b8175285/" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-5 h-5 hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>

      <div className="text-center text-xs py-4 border-t text-muted-foreground">
        © {new Date().getFullYear()} Developed By Anubhav Mishra.
      </div>
    </footer>
  );
}
