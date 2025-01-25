import React from 'react';
import { FileText, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  patientName: string;
  patientId: string;
  createdAt: Date;
  type: 'created' | 'updated';
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                SOAP Note {activity.type === 'created' ? 'created' : 'updated'} for {activity.patientName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Patient ID: {activity.patientId}</p>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
};