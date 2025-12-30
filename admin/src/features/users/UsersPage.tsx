import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Download, 
  RefreshCw,
  Bell,
  Send,
  Crown,
  Users,
  UserCheck,
  UserX,
  Activity,
  Clock,
  Mail,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { UsersTable } from './components/UsersTable';
import {
  useUsers,
  useUpdateUserRole,
  useActivateUser,
  useDeactivateUser,
  useDeleteUser,
  mockUsers,
  userCategories,
  filterUsersByCategory,
  getUniqueCountries,
} from './hooks/useUsers';
import { User, UserRole } from '../../lib/api/types';
import { toast } from '../../components/ui/use-toast';
import { formatDate, formatNumber, cn } from '../../lib/utils';

const roleOptions: UserRole[] = ['ADMIN', 'MODERATOR', 'SCHOLAR', 'SUPPORT', 'VIEWER', 'USER'];

// Category icons mapping
const categoryIcons: Record<string, React.ElementType> = {
  all: Users,
  premium: Crown,
  free: Users,
  new: UserPlus,
  new_30: UserPlus,
  active: Activity,
  inactive: Clock,
  verified: UserCheck,
  unverified: UserX,
  has_streak: Activity,
  donors: Crown,
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogType, setDialogType] = useState<'view' | 'role' | 'delete' | 'notify' | 'bulk-notify' | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('USER');
  const [useMockData, setUseMockData] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');

  // API Queries
  const { data, isLoading, error, refetch } = useUsers({
    search,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    country: countryFilter !== 'all' ? countryFilter : undefined,
  });

  // Mutations
  const updateRoleMutation = useUpdateUserRole();
  const activateMutation = useActivateUser();
  const deactivateMutation = useDeactivateUser();
  const deleteMutation = useDeleteUser();

  // Use mock data as fallback
  useEffect(() => {
    if (error) {
      setUseMockData(true);
    }
  }, [error]);

  // Filter mock data when API is not available
  const users = useMemo(() => {
    let filteredUsers = useMockData ? [...mockUsers] : (data?.data || []);
    
    // Apply search filter
    if (search) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      filteredUsers = filteredUsers.filter((user) => user.role === roleFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filteredUsers = filterUsersByCategory(filteredUsers, categoryFilter);
    }
    
    // Apply country filter
    if (countryFilter !== 'all') {
      filteredUsers = filteredUsers.filter((user) => user.country === countryFilter);
    }
    
    return filteredUsers;
  }, [useMockData, data, search, roleFilter, categoryFilter, countryFilter]);

  // Get unique countries for filter
  const countries = useMemo(() => getUniqueCountries(mockUsers), []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const allUsers = useMockData ? mockUsers : (data?.data || mockUsers);
    return userCategories.map(cat => ({
      ...cat,
      count: filterUsersByCategory(allUsers, cat.value).length,
    }));
  }, [useMockData, data]);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setDialogType('view');
  };

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setDialogType('role');
  };

  const handleToggleStatus = async (user: User) => {
    if (useMockData) {
      toast.info('Demo mode', 'Status changes are simulated in demo mode');
      return;
    }
    
    try {
      if (user.isActive) {
        await deactivateMutation.mutateAsync(user.id);
      } else {
        await activateMutation.mutateAsync(user.id);
      }
    } catch {
      // Error handled by mutation
    }
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDialogType('delete');
  };

  const handleNotifyUser = (user: User) => {
    setSelectedUser(user);
    setNotificationTitle('');
    setNotificationBody('');
    setDialogType('notify');
  };

  const handleBulkNotify = () => {
    if (selectedUserIds.length === 0) {
      toast.error('No users selected', 'Please select users to notify');
      return;
    }
    setNotificationTitle('');
    setNotificationBody('');
    setDialogType('bulk-notify');
  };

  const handleSelectUser = (userId: string, selected: boolean) => {
    setSelectedUserIds(prev => 
      selected ? [...prev, userId] : prev.filter(id => id !== userId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedUserIds(selected ? users.map(u => u.id) : []);
  };

  const confirmRoleChange = async () => {
    if (!selectedUser || useMockData) {
      if (useMockData) {
        toast.info('Demo mode', 'Role changes are simulated in demo mode');
      }
      setDialogType(null);
      return;
    }

    try {
      await updateRoleMutation.mutateAsync({ id: selectedUser.id, role: newRole });
      setDialogType(null);
    } catch {
      // Error handled by mutation
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser || useMockData) {
      if (useMockData) {
        toast.info('Demo mode', 'Delete operations are simulated in demo mode');
      }
      setDialogType(null);
      return;
    }

    try {
      await deleteMutation.mutateAsync(selectedUser.id);
      setDialogType(null);
    } catch {
      // Error handled by mutation
    }
  };

  const sendNotification = () => {
    if (!notificationTitle || !notificationBody) {
      toast.error('Missing fields', 'Please fill in both title and message');
      return;
    }

    if (dialogType === 'notify' && selectedUser) {
      toast.success('Notification sent', `Notification sent to ${selectedUser.name}`);
    } else if (dialogType === 'bulk-notify') {
      toast.success('Notifications sent', `Notification sent to ${selectedUserIds.length} users`);
      setSelectedUserIds([]);
    }
    setDialogType(null);
  };

  const clearFilters = () => {
    setRoleFilter('all');
    setCategoryFilter('all');
    setCountryFilter('all');
    setSearch('');
  };

  const hasActiveFilters = roleFilter !== 'all' || categoryFilter !== 'all' || countryFilter !== 'all' || search;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedUserIds.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleBulkNotify}>
              <Bell className="h-4 w-4 mr-2" />
              Notify ({selectedUserIds.length})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Demo data indicator */}
      {useMockData && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center gap-2">
          <Filter className="h-4 w-4 text-amber-600" />
          <span className="text-sm text-amber-700 dark:text-amber-300">
            Showing demo data. Connect to API for live user management.
          </span>
        </div>
      )}

      {/* Category Quick Filters */}
      <div className="flex gap-2 flex-wrap">
        {categoryCounts.slice(0, 8).map((cat) => {
          const Icon = categoryIcons[cat.value] || Users;
          const isActive = categoryFilter === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(isActive ? 'all' : cat.value)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all',
                isActive
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                  : 'border-border hover:border-primary-300 hover:bg-muted/50'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{cat.label}</span>
              <Badge variant="secondary" className="text-xs">
                {cat.count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryCounts.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Users ({users.length})</span>
            {selectedUserIds.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedUserIds.length} selected
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUserIds([])}
                >
                  Clear selection
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            isLoading={isLoading && !useMockData}
            onViewUser={handleViewUser}
            onChangeRole={handleChangeRole}
            onToggleStatus={handleToggleStatus}
            onDeleteUser={handleDeleteUser}
            onNotifyUser={handleNotifyUser}
            selectedUserIds={selectedUserIds}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
          />
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={dialogType === 'view'} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-700 dark:text-primary-300">
                    {selectedUser.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <Badge>{selectedUser.role}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant={selectedUser.isActive ? 'success' : 'destructive'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Subscription</p>
                  <Badge variant={selectedUser.isPremium ? 'default' : 'secondary'}>
                    {selectedUser.tier || 'Free'}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Email Verified</p>
                  <Badge variant={selectedUser.emailVerified ? 'success' : 'warning'}>
                    {selectedUser.emailVerified ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p>
                    {selectedUser.city && selectedUser.country
                      ? `${selectedUser.city}, ${selectedUser.country}`
                      : selectedUser.city || selectedUser.country || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p>{formatDate(selectedUser.createdAt)}</p>
                </div>
                {selectedUser.streakCount !== undefined && (
                  <div>
                    <p className="text-muted-foreground">Streak</p>
                    <p>{selectedUser.streakCount} days 🔥</p>
                  </div>
                )}
                {selectedUser.donationsTotal !== undefined && (
                  <div>
                    <p className="text-muted-foreground">Donations</p>
                    <p>${selectedUser.donationsTotal}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Close
            </Button>
            {selectedUser && (
              <Button onClick={() => handleNotifyUser(selectedUser)}>
                <Bell className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={dialogType === 'role'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button
              onClick={confirmRoleChange}
              isLoading={updateRoleMutation.isPending}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogType === 'delete'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Notification Dialog (Individual) */}
      <Dialog open={dialogType === 'notify'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>
              Send a push notification to {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notify-title">Title</Label>
              <Input
                id="notify-title"
                placeholder="Notification title"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notify-body">Message</Label>
              <textarea
                id="notify-body"
                placeholder="Notification message..."
                className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={notificationBody}
                onChange={(e) => setNotificationBody(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button onClick={sendNotification}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Notification Dialog */}
      <Dialog open={dialogType === 'bulk-notify'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Bulk Notification</DialogTitle>
            <DialogDescription>
              Send a push notification to {selectedUserIds.length} selected users
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground">Recipients:</p>
              <p className="font-medium">{selectedUserIds.length} users selected</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-notify-title">Title</Label>
              <Input
                id="bulk-notify-title"
                placeholder="Notification title"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-notify-body">Message</Label>
              <textarea
                id="bulk-notify-body"
                placeholder="Notification message..."
                className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={notificationBody}
                onChange={(e) => setNotificationBody(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button onClick={sendNotification}>
              <Send className="h-4 w-4 mr-2" />
              Send to {selectedUserIds.length} users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
