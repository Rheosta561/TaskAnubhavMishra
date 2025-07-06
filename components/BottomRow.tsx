'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Repeat, Wallet, BarChart3 } from 'lucide-react'

const tabs = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    name: 'Transactions',
    icon: Repeat,
    href: '/transactions',
  },
  {
    name: 'Budget',
    icon: Wallet,
    href: '/budget',
  },
  {
    name: 'Insights',
    icon: BarChart3,
    href: '/budget#insights',
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'fixed bottom-4 left-2 right-2 z-50 rounded-lg bg-background border border-primary/30 shadow-md',
        'md:inset-x-0 md:mx-auto md:max-w-md md:rounded-xl md:border md:shadow-lg'
      )}
    >
      <div className="flex justify-around items-center h-16">
        {tabs.map(({ name, icon: Icon, href }) => {
          const isActive = pathname === href

          return (
            <Link
              key={name}
              href={href}
              className="group flex flex-col items-center gap-1 text-xs relative"
            >
              <Icon
                className={cn(
                  'w-6 h-6 transition-all',
                  isActive ? 'text-primary' : 'text-primary/70 group-hover:text-primary'
                )}
              />
              <span
                className={cn(
                  'transition-opacity text-xs mt-1',
                  'md:absolute md:-bottom-6 md:opacity-0 md:group-hover:opacity-100',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                )}
              >
                {name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
