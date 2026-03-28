'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, Building2, Rocket, FileText, Zap, ListChecks, Calendar,
  Settings, LogOut, ExternalLink, Send, Clock, CheckCircle2, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AvatarPlaceholder from '@/components/shared/AvatarPlaceholder';
import { stageLabels } from '@/lib/constants';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const { lang } = useLang();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [incomingApps, setIncomingApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileData) { router.push('/login'); return; }
      setProfile(profileData);

      if (profileData.role === 'startup') {
        // Get startup
        const { data: startup } = await supabase
          .from('startups')
          .select('*')
          .eq('profile_id', user.id)
          .single();

        if (!startup) { router.push('/onboarding'); return; }
        setCompany(startup);

        // My applications (as startup)
        const { data: apps } = await supabase
          .from('wishlist_applications')
          .select('*, wishlist_items(title_tr, title_en, status, corporates:corporate_id(name))')
          .eq('startup_id', startup.id)
          .order('created_at', { ascending: false });
        if (apps) setApplications(apps);

        // My matches
        const { data: matchData } = await supabase
          .from('matches_full')
          .select('*')
          .eq('startup_id', startup.id)
          .order('score', { ascending: false });
        if (matchData) setMatches(matchData);

      } else if (profileData.role === 'corporate') {
        // Get corporate
        const { data: corp } = await supabase
          .from('corporates')
          .select('*')
          .eq('profile_id', user.id)
          .single();

        if (!corp) { router.push('/onboarding'); return; }
        setCompany(corp);

        // Incoming applications to my wishlist items
        const { data: wishItems } = await supabase
          .from('wishlist_items')
          .select('id, title_tr, title_en')
          .eq('corporate_id', corp.id);

        if (wishItems && wishItems.length > 0) {
          const itemIds = wishItems.map(w => w.id);
          const { data: incoming } = await supabase
            .from('wishlist_applications')
            .select('*, startups(name, sector), wishlist_items(title_tr, title_en)')
            .in('wishlist_item_id', itemIds)
            .order('created_at', { ascending: false });
          if (incoming) setIncomingApps(incoming);
        }

        // My matches
        const { data: matchData } = await supabase
          .from('matches_full')
          .select('*')
          .eq('corporate_id', corp.id)
          .order('score', { ascending: false });
        if (matchData) setMatches(matchData);
      }

      // My event registrations
      const { data: regs } = await supabase
        .from('event_registrations')
        .select('*, events(title_tr, title_en, date, location, type)')
        .eq('profile_id', user.id);
      if (regs) setEvents(regs);

      setLoading(false);
    }
    fetchAll();
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  const isStartup = profile?.role === 'startup';
  const isCorporate = profile?.role === 'corporate';

  const statusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} className="text-amber-500" />;
      case 'accepted': return <CheckCircle2 size={14} className="text-green-500" />;
      case 'rejected': return <XCircle size={14} className="text-red-500" />;
      default: return <Clock size={14} className="text-gray-600" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-0';
      case 'accepted': return 'bg-green-100 text-green-700 border-0';
      case 'rejected': return 'bg-red-100 text-red-700 border-0';
      case 'connected': return 'bg-emerald-100 text-emerald-700 border-0';
      default: return 'bg-gray-100 text-gray-700 border-0';
    }
  };

  return (
    <main className="w-full">
      {/* Header */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <AvatarPlaceholder name={company?.name || profile?.full_name || 'U'} size="xl" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{company?.name || profile?.full_name}</h1>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary">
                  {isStartup ? (lang === 'tr' ? 'Startup' : 'Startup') : (lang === 'tr' ? 'Kurumsal' : 'Corporate')}
                </Badge>
                {isStartup && company?.stage && (
                  <Badge variant="outline">{stageLabels[company.stage as keyof typeof stageLabels]}</Badge>
                )}
                {isCorporate && company?.is_founder && (
                  <Badge className="bg-amber-100 text-amber-700 border-0">{lang === 'tr' ? 'Kurucu Üye' : 'Founding Member'}</Badge>
                )}
              </div>
              <p className="text-gray-600">{profile?.email}</p>
              {company?.sector && <p className="text-sm text-gray-600 mt-1">{company.sector} • {company.location}</p>}
            </div>
            <div className="flex gap-2">
              <Link href={isStartup ? `/startups/${company?.slug}` : `/corporates/${company?.slug}`}>
                <Button variant="outline" className="gap-2">
                  <ExternalLink size={16} /> {lang === 'tr' ? 'Profili Gör' : 'View Profile'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 border-b">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-emerald-600">{matches.length}</p>
                <p className="text-sm text-gray-600">{lang === 'tr' ? 'Eşleşme' : 'Matches'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {isStartup ? applications.length : incomingApps.length}
                </p>
                <p className="text-sm text-gray-600">
                  {isStartup ? (lang === 'tr' ? 'Başvuru' : 'Applications') : (lang === 'tr' ? 'Gelen Başvuru' : 'Incoming')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">{events.length}</p>
                <p className="text-sm text-gray-600">{lang === 'tr' ? 'Etkinlik Kaydı' : 'Event Registrations'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">
                  {matches.filter(m => m.status === 'connected').length}
                </p>
                <p className="text-sm text-gray-600">{lang === 'tr' ? 'Bağlantı' : 'Connections'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tabs Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full max-w-lg grid-cols-3 mb-8">
              <TabsTrigger value="applications">
                {isStartup
                  ? (lang === 'tr' ? 'Başvurularım' : 'My Applications')
                  : (lang === 'tr' ? 'Gelen Başvurular' : 'Incoming Apps')}
              </TabsTrigger>
              <TabsTrigger value="matches">
                {lang === 'tr' ? 'Eşleşmeler' : 'Matches'}
              </TabsTrigger>
              <TabsTrigger value="events">
                {lang === 'tr' ? 'Etkinlikler' : 'Events'}
              </TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications">
              {isStartup ? (
                applications.length > 0 ? (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <Card key={app.id}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {lang === 'tr' ? app.wishlist_items?.title_tr : app.wishlist_items?.title_en}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {app.wishlist_items?.corporates?.name}
                            </p>
                            {app.message && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-1">{app.message}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={statusColor(app.status)}>{app.status}</Badge>
                            <span className="text-xs text-gray-600">
                              {new Date(app.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-600">
                      <Send className="mx-auto mb-4 text-gray-300" size={48} />
                      <p>{lang === 'tr' ? 'Henüz başvuru yapmadınız' : 'No applications yet'}</p>
                      <Link href="/wishlist">
                        <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                          {lang === 'tr' ? 'Wishlist\'e Git' : 'Browse Wishlist'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              ) : (
                incomingApps.length > 0 ? (
                  <div className="space-y-3">
                    {incomingApps.map((app) => (
                      <Card key={app.id}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <AvatarPlaceholder name={app.startups?.name || '?'} size="sm" />
                          <div className="flex-1">
                            <h4 className="font-medium">{app.startups?.name}</h4>
                            <p className="text-xs text-gray-600">{app.startups?.sector}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {lang === 'tr' ? 'İhtiyaç:' : 'Need:'} {lang === 'tr' ? app.wishlist_items?.title_tr : app.wishlist_items?.title_en}
                            </p>
                            {app.message && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-1 italic">"{app.message}"</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={statusColor(app.status)}>{app.status}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-600">
                      <ListChecks className="mx-auto mb-4 text-gray-300" size={48} />
                      <p>{lang === 'tr' ? 'Henüz gelen başvuru yok' : 'No incoming applications yet'}</p>
                      <Link href="/wishlist">
                        <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                          {lang === 'tr' ? 'İhtiyaç Ekle' : 'Add a Need'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              )}
            </TabsContent>

            {/* Matches Tab */}
            <TabsContent value="matches">
              {matches.length > 0 ? (
                <div className="space-y-3">
                  {matches.map((match) => (
                    <Card key={match.id}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <AvatarPlaceholder name={isStartup ? match.corporate_name : match.startup_name} size="sm" />
                        <div className="flex-1">
                          <h4 className="font-medium">{isStartup ? match.corporate_name : match.startup_name}</h4>
                          {!isStartup && <p className="text-xs text-gray-600">{match.startup_sector}</p>}
                          <div className="flex items-center gap-2 mt-2">
                            <Progress value={match.score} className="h-2 flex-1 max-w-[200px]" />
                            <span className="text-sm font-semibold text-emerald-600">{match.score}%</span>
                          </div>
                        </div>
                        <Badge className={statusColor(match.status)}>{match.status}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-600">
                    <Zap className="mx-auto mb-4 text-gray-300" size={48} />
                    <p>{lang === 'tr' ? 'Henüz eşleşme yok' : 'No matches yet'}</p>
                    <Link href="/matching">
                      <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                        {lang === 'tr' ? 'Eşleşmelere Git' : 'View Matching'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((reg) => (
                    <Card key={reg.id}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-emerald-100 flex flex-col items-center justify-center">
                          <Calendar className="text-emerald-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{lang === 'tr' ? reg.events?.title_tr : reg.events?.title_en}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {reg.events?.date && new Date(reg.events.date).toLocaleDateString()} • {reg.events?.location}
                          </p>
                        </div>
                        <Badge variant="outline">{reg.events?.type}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-600">
                    <Calendar className="mx-auto mb-4 text-gray-300" size={48} />
                    <p>{lang === 'tr' ? 'Henüz etkinlik kaydınız yok' : 'No event registrations yet'}</p>
                    <Link href="/events">
                      <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                        {lang === 'tr' ? 'Etkinliklere Git' : 'Browse Events'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
