import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function ScholarsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Scholars & Lessons
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage Islamic scholars, their profiles, and educational content
        </p>
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

