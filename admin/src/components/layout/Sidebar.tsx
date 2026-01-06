import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  GraduationCap,
  Bell,
  DollarSign,
  FileText,
  Newspaper,
  Settings,
  ChevronLeft,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Radio,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../lib/store';
import { useAuthStore } from '../../lib/auth';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { getInitials } from '../../lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Users', href: '/users', icon: Users, roles: ['ADMIN', 'MODERATOR'] },
  { title: 'Events', href: '/events', icon: Calendar },
  { title: 'Posts', href: '/posts', icon: MessageSquare },
  { title: 'Scholars', href: '/scholars', icon: GraduationCap },
  { title: 'Notifications', href: '/notifications', icon: Bell, roles: ['ADMIN', 'MODERATOR'] },
  { title: 'Makkah Live', href: '/makkah-live', icon: Radio, roles: ['ADMIN', 'MODERATOR'] },
  { title: 'Donations', href: '/donations', icon: DollarSign, roles: ['ADMIN'] },
  { title: 'Content', href: '/content', icon: FileText },
  { title: 'News', href: '/news', icon: Newspaper },
  { title: 'Settings', href: '/settings', icon: Settings, roles: ['ADMIN'] },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, theme, setTheme, sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  const { user, logout, hasAnyRole } = useAuthStore();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return hasAnyRole(item.roles as any[]);
  });

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen transition-all duration-300 ease-in-out',
          'bg-card/90 dark:bg-card/95 backdrop-blur-xl border-r border-border',
          sidebarCollapsed ? 'w-20' : 'w-64',
          // Mobile styles
          'lg:translate-x-0',
          sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/appicon.png" 
                  alt="Tijaniyah Muslim Pro" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to gradient if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
                  }}
                />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">Tijaniyah</span>
                  <span className="text-xs text-muted-foreground">Admin Panel</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleSidebar}
              className="hidden lg:flex"
            >
              <ChevronLeft
                className={cn(
                  'h-4 w-4 transition-transform',
                  sidebarCollapsed && 'rotate-180'
                )}
              />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    onClick={() => setSidebarMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        'hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
                        isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                        sidebarCollapsed && 'justify-center px-2'
                      )
                    }
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!sidebarCollapsed && <span>{item.title}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'flex items-center gap-3 w-full rounded-xl p-2 transition-colors',
                    'hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
                    sidebarCollapsed && 'justify-center'
                  )}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name ? getInitials(user.name) : 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Theme
                </DropdownMenuLabel>
                {themeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      'gap-2',
                      theme === option.value && 'bg-emerald-100 dark:bg-emerald-900/30'
                    )}
                  >
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 dark:text-red-400 gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
}

