import React from 'react';
import { Menu, Bell, Search, Sun, Moon, Monitor } from 'lucide-react';
import { useUIStore } from '../../lib/store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { setSidebarMobileOpen, unreadNotifications, theme, setTheme } = useUIStore();

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 border-b border-border',
        'bg-background/95 backdrop-blur-xl',
        'transition-all duration-300'
      )}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Page title */}
          <div>
            {title && (
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-64 pl-9 h-9 bg-background"
            />
          </div>

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                {theme === 'light' ? (
                  <Sun className="h-5 w-5" />
                ) : theme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {themeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    'gap-2 cursor-pointer',
                    theme === option.value && 'bg-accent text-accent-foreground'
                  )}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
              >
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

