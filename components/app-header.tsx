'use client';

import { useAuth } from '@/lib/auth-context';
import { RoleBadge } from './role-badge';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function AppHeader() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { label: 'Chat', href: '/chat' },
      { label: 'Knowledge Base', href: '/knowledge-base' },
    ];

    if (user.role === 'admin') {
      return [
        ...baseItems,
        { label: 'Analytics', href: '/analytics' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Settings', href: '/settings' },
      ];
    }

    return [...baseItems, { label: 'Settings', href: '/settings' }];
  };

  const navItems = getNavItems();

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                O
              </span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">
              OnboardAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="hidden sm:flex items-center gap-2 flex-row">
                  <div className="text-right flex-row flex gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    <RoleBadge role={user.role} size="sm" />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
