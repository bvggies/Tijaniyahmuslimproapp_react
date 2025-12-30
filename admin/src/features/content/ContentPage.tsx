import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
        <p className="text-muted-foreground">Manage duas, wazifa, dhikr, streams, and announcements.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center bg-primary-50 dark:bg-primary-900/50 rounded-xl">
            <p className="text-muted-foreground">Content CRUD interfaces will be here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

