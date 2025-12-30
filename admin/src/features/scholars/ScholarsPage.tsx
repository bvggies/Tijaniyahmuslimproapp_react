import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function ScholarsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Scholars & Lessons</h1>
        <p className="text-muted-foreground">Manage scholars and their lessons.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Scholars
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center bg-primary-50 dark:bg-primary-900/50 rounded-xl">
            <p className="text-muted-foreground">Scholars CRUD interface will be here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

