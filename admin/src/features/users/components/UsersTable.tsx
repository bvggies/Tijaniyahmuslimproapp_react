import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  Shield,
  UserX,
  UserCheck,
  Trash2,
  Eye,
  Bell,
  Crown,
  Flame,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { User, UserRole } from '../../../lib/api/types';
import { cn, formatDate, getInitials } from '../../../lib/utils';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onViewUser: (user: User) => void;
  onChangeRole: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onNotifyUser?: (user: User) => void;
  selectedUserIds?: string[];
  onSelectUser?: (userId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
}

const columnHelper = createColumnHelper<User>();

const roleColors: Record<UserRole, string> = {
  ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  MODERATOR: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  SCHOLAR: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  SUPPORT: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  VIEWER: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  USER: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
};

export function UsersTable({
  users,
  isLoading,
  onViewUser,
  onChangeRole,
  onToggleStatus,
  onDeleteUser,
  onNotifyUser,
  selectedUserIds = [],
  onSelectUser,
  onSelectAll,
}: UsersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const allSelected = users.length > 0 && selectedUserIds.length === users.length;
  const someSelected = selectedUserIds.length > 0 && selectedUserIds.length < users.length;

  const columns = React.useMemo(
    () => [
      // Selection column
      columnHelper.display({
        id: 'select',
        header: () => (
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected;
            }}
            onChange={(e) => onSelectAll?.(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedUserIds.includes(row.original.id)}
            onChange={(e) => onSelectUser?.(row.original.id, e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        ),
      }),
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-medium">{user.name}</p>
                  {user.isPremium && (
                    <Crown className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  {user.streakCount && user.streakCount > 7 && (
                    <span className="flex items-center text-xs text-orange-500">
                      <Flame className="h-3 w-3" />
                      {user.streakCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ getValue }) => {
          const role = getValue();
          return (
            <Badge className={cn('font-medium', roleColors[role])}>
              {role}
            </Badge>
          );
        },
      }),
      columnHelper.accessor('tier', {
        header: 'Tier',
        cell: ({ getValue, row }) => {
          const tier = getValue();
          const isPremium = row.original.isPremium;
          return (
            <Badge 
              variant={isPremium ? 'default' : 'secondary'}
              className={isPremium ? 'bg-gradient-to-r from-amber-500 to-amber-600' : ''}
            >
              {tier || 'Free'}
            </Badge>
          );
        },
      }),
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: ({ getValue, row }) => {
          const isActive = getValue();
          const isVerified = row.original.emailVerified;
          return (
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? 'success' : 'destructive'}>
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
              {!isVerified && (
                <Badge variant="warning" className="text-xs">
                  Unverified
                </Badge>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor('country', {
        header: 'Location',
        cell: ({ row }) => {
          const { city, country } = row.original;
          if (!city && !country) return <span className="text-muted-foreground">—</span>;
          return (
            <span className="text-sm">
              {city && country ? `${city}, ${country}` : city || country}
            </span>
          );
        },
      }),
      columnHelper.accessor('createdAt', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Joined
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => {
          const user = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onViewUser(user)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                {onNotifyUser && (
                  <DropdownMenuItem onClick={() => onNotifyUser(user)}>
                    <Bell className="mr-2 h-4 w-4" />
                    Send Notification
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onChangeRole(user)}>
                  <Shield className="mr-2 h-4 w-4" />
                  Change Role
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleStatus(user)}>
                  {user.isActive ? (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteUser(user)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
    ],
    [onViewUser, onChangeRole, onToggleStatus, onDeleteUser, onNotifyUser, selectedUserIds, onSelectUser, onSelectAll, allSelected, someSelected]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <UserX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No users found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'hover:bg-muted/30 transition-colors',
                  selectedUserIds.includes(row.original.id) && 'bg-primary-50 dark:bg-primary-950/20'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {users.length} users
          {selectedUserIds.length > 0 && (
            <span className="ml-2 text-primary-600">
              ({selectedUserIds.length} selected)
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
