'use client';

import Link from 'next/link';
import { Plus, Building2, Users, Calendar, FileText, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/context/LanguageContext';

const mockStats = [
  { label: 'Active Startups', value: 240, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { label: 'Corporate Partners', value: 50, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Upcoming Events', value: 12, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-100' },
  { label: 'News Articles', value: 48, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
];

const mockActivity = [
  {
    id: '1',
    type: 'startup_joined',
    title: 'New Startup: CloudSync AI',
    description: 'AI-powered cloud synchronization platform',
    timestamp: '2 hours ago',
    user: 'Elif Kaya',
  },
  {
    id: '2',
    type: 'partnership',
    title: 'Partnership: Türk Telekom + HealthTech Startup',
    description: 'New partnership agreement signed',
    timestamp: '5 hours ago',
    user: 'Admin',
  },
  {
    id: '3',
    type: 'event_created',
    title: 'Event Created: AI Summit 2026',
    description: 'New annual AI conference scheduled',
    timestamp: 'Yesterday',
    user: 'Event Team',
  },
  {
    id: '4',
    type: 'corporate_joined',
    title: 'New Corporate Member: Vestel',
    description: 'Electronics manufacturer joins platform',
    timestamp: '2 days ago',
    user: 'Admin',
  },
  {
    id: '5',
    type: 'milestone',
    title: 'Platform Milestone: 200+ Startups',
    description: 'Platform reached 200 active startups',
    timestamp: '3 days ago',
    user: 'System',
  },
];

const getActivityIcon = (type: string) => {
  const icons: Record<string, typeof Plus> = {
    startup_joined: Building2,
    partnership: Users,
    event_created: Calendar,
    corporate_joined: Users,
    milestone: TrendingUp,
  };
  return icons[type] || Plus;
};

export default function AdminPage() {
  const { t } = useLang();

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the StartupEco platform</p>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm text-gray-600 font-medium">{stat.label}</h3>
                      <div className={`${stat.bg} p-2 rounded`}>
                        <Icon className={`${stat.color}`} size={20} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold">{stat.value}+</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="bg-emerald-600 hover:bg-emerald-700 h-auto py-4 flex flex-col items-center justify-center gap-2">
              <Plus size={24} />
              <span>Add Startup</span>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 h-auto py-4 flex flex-col items-center justify-center gap-2">
              <Plus size={24} />
              <span>Add Corporate</span>
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700 h-auto py-4 flex flex-col items-center justify-center gap-2">
              <Plus size={24} />
              <span>Create Event</span>
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 h-auto py-4 flex flex-col items-center justify-center gap-2">
              <Plus size={24} />
              <span>Write Article</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {mockActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="p-6 flex gap-4 hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Icon className="text-emerald-600" size={18} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{activity.user}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Management Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Startup Management</h3>
                <div className="space-y-2 mb-6">
                  <Link href="#" className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    View All Startups
                  </Link>
                  <Link href="#" className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    Pending Approvals (3)
                  </Link>
                  <Link href="#" className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    Featured Management
                  </Link>
                </div>
                <Button variant="outline" className="w-full">
                  Manage Startups
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Corporate Management</h3>
                <div className="space-y-2 mb-6">
                  <Link href="#" className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    View All Corporates
                  </Link>
                  <Link href="#" className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    Pending Approvals (1)
                  </Link>
                  <Link href="#" className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    Member Directory
                  </Link>
                </div>
                <Button variant="outline" className="w-full">
                  Manage Corporates
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Content Management</h3>
                <div className="space-y-2 mb-6">
                  <Link href="#" className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    All Articles
                  </Link>
                  <Link href="#" className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    Draft Articles (2)
                  </Link>
                  <Link href="#" className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    Categories
                  </Link>
                </div>
                <Button variant="outline" className="w-full">
                  Manage Content
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Events & Matches</h3>
                <div className="space-y-2 mb-6">
                  <Link href="#" className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    All Events
                  </Link>
                  <Link href="#" className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    Matching Results
                  </Link>
                  <Link href="#" className="block text-emerald-600 hover:text-emerald-700 text-sm">
                    Partnership Tracking
                  </Link>
                </div>
                <Button variant="outline" className="w-full">
                  Manage Events
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
