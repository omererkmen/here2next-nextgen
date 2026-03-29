'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Building2, Users, Calendar, FileText, TrendingUp, Clock, Rocket, ListChecks, Zap, MessageSquareWarning, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const { lang } = useLang();
  const [stats, setStats] = useState({ startups: 0, corporates: 0, events: 0, news: 0, matches: 0, applications: 0, feedback: 0 });
  const [recentStartups, setRecentStartups] = useState<any[]>([]);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Fetch counts in parallel
      const [startups, corporates, events, news, matches, applications, feedback] = await Promise.all([
        supabase.from('startups').select('*', { count: 'exact', head: true }),
        supabase.from('corporates').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('news_articles').select('*', { count: 'exact', head: true }),
        supabase.from('match_results').select('*', { count: 'exact', head: true }),
        supabase.from('wishlist_applications').select('*', { count: 'exact', head: true }),
        supabase.from('feedback').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        startups: startups.count || 0,
        corporates: corporates.count || 0,
        events: events.count || 0,
        news: news.count || 0,
        matches: matches.count || 0,
        applications: applications.count || 0,
        feedback: feedback.count || 0,
      });

      // Recent startups
      const { data: recentS } = await supabase
        .from('startups')
        .select('id, name, sector, slug, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      if (recentS) setRecentStartups(recentS);

      // Recent applications
      const { data: recentA } = await supabase
        .from('wishlist_applications')
        .select('id, status, created_at, message, startups(name), wishlist_items(title_tr, title_en)')
        .order('created_at', { ascending: false })
        .limit(5);
      if (recentA) setRecentApps(recentA);

      setLoading(false);
    }
    fetchData();
  }, []);

  const statCards = [
    { label: lang === 'tr' ? 'Startup' : 'Startups', value: stats.startups, icon: Rocket, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: lang === 'tr' ? 'Kurum' : 'Corporates', value: stats.corporates, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: lang === 'tr' ? 'Eşleşme' : 'Matches', value: stats.matches, icon: Zap, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: lang === 'tr' ? 'Başvuru' : 'Applications', value: stats.applications, icon: ListChecks, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: lang === 'tr' ? 'Etkinlik' : 'Events', value: stats.events, icon: Calendar, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { label: lang === 'tr' ? 'Haber' : 'News', value: stats.news, icon: FileText, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {lang === 'tr' ? 'Yönetim Paneli' : 'Admin Dashboard'}
          </h1>
          <p className="text-gray-600">{lang === 'tr' ? 'Here2Next platform yönetimi' : 'Manage the Here2Next platform'}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="p-4 text-center">
                    <div className={`${stat.bg} w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <Icon className={stat.color} size={20} />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Startups */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{lang === 'tr' ? 'Son Eklenen Startup\'lar' : 'Recent Startups'}</h3>
                  <Link href="/startups" className="text-sm text-emerald-600 hover:text-emerald-700">
                    {lang === 'tr' ? 'Tümü' : 'View All'}
                  </Link>
                </div>
                <div className="divide-y">
                  {recentStartups.map((s) => (
                    <Link key={s.id} href={`/startups/${s.slug}`} className="flex items-center gap-3 py-3 hover:bg-gray-50 -mx-2 px-2 rounded">
                      <Rocket size={16} className="text-emerald-500" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{s.name}</p>
                        <p className="text-xs text-gray-600">{s.sector}</p>
                      </div>
                      <span className="text-xs text-gray-600">
                        {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{lang === 'tr' ? 'Son Başvurular' : 'Recent Applications'}</h3>
                  <Link href="/wishlist" className="text-sm text-emerald-600 hover:text-emerald-700">
                    {lang === 'tr' ? 'Tümü' : 'View All'}
                  </Link>
                </div>
                <div className="divide-y">
                  {recentApps.map((app) => (
                    <div key={app.id} className="flex items-center gap-3 py-3">
                      <ListChecks size={16} className="text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{(app.startups as any)?.name}</p>
                        <p className="text-xs text-gray-600 truncate">
                          {lang === 'tr' ? (app.wishlist_items as any)?.title_tr : (app.wishlist_items as any)?.title_en}
                        </p>
                      </div>
                      <Badge className={
                        app.status === 'pending' ? 'bg-amber-100 text-amber-700 border-0' :
                        app.status === 'accepted' ? 'bg-green-100 text-green-700 border-0' :
                        'bg-red-100 text-red-700 border-0'
                      }>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">{lang === 'tr' ? 'Hızlı İşlemler' : 'Quick Actions'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/startups">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <Rocket size={24} className="text-emerald-600" />
                <span>{lang === 'tr' ? 'Startup\'ları Yönet' : 'Manage Startups'}</span>
              </Button>
            </Link>
            <Link href="/corporates">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <Building2 size={24} className="text-blue-600" />
                <span>{lang === 'tr' ? 'Kurumları Yönet' : 'Manage Corporates'}</span>
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <Calendar size={24} className="text-amber-600" />
                <span>{lang === 'tr' ? 'Etkinlikler' : 'Events'}</span>
              </Button>
            </Link>
            <Link href="/news">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <FileText size={24} className="text-purple-600" />
                <span>{lang === 'tr' ? 'Haberler' : 'News'}</span>
              </Button>
            </Link>
            <Link href="/admin/feedback">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 border-orange-200 hover:bg-orange-50">
                <MessageSquareWarning size={24} className="text-orange-600" />
                <span>{lang === 'tr' ? `Geri Bildirim (${stats.feedback})` : `Feedback (${stats.feedback})`}</span>
              </Button>
            </Link>
            <Link href="/admin/logs">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 border-slate-200 hover:bg-slate-50">
                <Activity size={24} className="text-slate-600" />
                <span>{lang === 'tr' ? 'Aktivite Logları' : 'Activity Logs'}</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
