import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Database,
  Server,
  Cloud,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn, formatDateTime } from '../../lib/utils';
import { toast } from '../../components/ui/use-toast';

const mockAuditLogs = [
  { id: '1', action: 'USER_ROLE_UPDATED', entityType: 'User', entityId: 'user_123', userId: 'admin_1', userName: 'Super Admin', createdAt: '2024-01-28T10:30:00Z' },
  { id: '2', action: 'EVENT_CREATED', entityType: 'Event', entityId: 'event_456', userId: 'admin_1', userName: 'Super Admin', createdAt: '2024-01-28T09:15:00Z' },
  { id: '3', action: 'POST_HIDDEN', entityType: 'Post', entityId: 'post_789', userId: 'mod_2', userName: 'Content Moderator', createdAt: '2024-01-27T16:45:00Z' },
  { id: '4', action: 'SCHOLAR_VERIFIED', entityType: 'Scholar', entityId: 'scholar_101', userId: 'admin_1', userName: 'Super Admin', createdAt: '2024-01-27T14:20:00Z' },
  { id: '5', action: 'NOTIFICATION_SENT', entityType: 'Notification', entityId: 'notif_102', userId: 'mod_2', userName: 'Content Moderator', createdAt: '2024-01-26T11:00:00Z' },
];

const systemStatus = {
  database: true,
  api: true,
  storage: true,
  cache: true,
  version: '1.0.0',
  uptime: '99.9%',
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'system' | 'audit' | 'roles'>('system');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsRefreshing(false);
    toast.success('Status refreshed', 'All systems are operational');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings & Admin Tools</h1>
        <p className="text-muted-foreground">System settings, roles, and audit logs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <Button
          variant={activeTab === 'system' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('system')}
        >
          <Activity className="h-4 w-4 mr-2" />
          System Status
        </Button>
        <Button
          variant={activeTab === 'audit' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('audit')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Audit Logs
        </Button>
        <Button
          variant={activeTab === 'roles' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('roles')}
        >
          <Shield className="h-4 w-4 mr-2" />
          Roles & Permissions
        </Button>
      </div>

      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* System Status Cards */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">System Health</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Database', icon: Database, status: systemStatus.database },
              { name: 'API Server', icon: Server, status: systemStatus.api },
              { name: 'File Storage', icon: Cloud, status: systemStatus.storage },
              { name: 'Cache', icon: Activity, status: systemStatus.cache },
            ].map((item) => (
              <Card key={item.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        item.status ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-red-100 dark:bg-red-900/50'
                      )}>
                        <item.icon className={cn(
                          'h-5 w-5',
                          item.status ? 'text-emerald-600' : 'text-red-600'
                        )} />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.status ? 'Operational' : 'Down'}
                        </p>
                      </div>
                    </div>
                    {item.status ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="font-medium">{systemStatus.version}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="font-medium">{systemStatus.uptime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">API Endpoint</p>
                  <p className="font-medium text-sm">
                    {process.env.REACT_APP_API_BASE_URL || 'https://tijaniyahmuslimproapp-backend.vercel.app'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'audit' && (
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>Recent administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    <div>
                      <p className="text-sm font-medium">
                        <span className="text-primary-600">{log.userName}</span>
                        {' performed '}
                        <Badge variant="secondary" className="mx-1">{log.action}</Badge>
                        {' on '}
                        <span className="text-muted-foreground">{log.entityType}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(log.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{log.entityId}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'roles' && (
        <Card>
          <CardHeader>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Overview of system roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { role: 'ADMIN', desc: 'Full system access', color: 'bg-red-100 text-red-700' },
                { role: 'MODERATOR', desc: 'Content moderation, user management', color: 'bg-amber-100 text-amber-700' },
                { role: 'SCHOLAR', desc: 'Create lessons, verify content', color: 'bg-purple-100 text-purple-700' },
                { role: 'SUPPORT', desc: 'View reports, assist users', color: 'bg-blue-100 text-blue-700' },
                { role: 'VIEWER', desc: 'Read-only dashboard access', color: 'bg-gray-100 text-gray-700' },
              ].map((item) => (
                <div
                  key={item.role}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={item.color}>{item.role}</Badge>
                    <span className="text-sm text-muted-foreground">{item.desc}</span>
                  </div>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
