'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Users, DollarSign, Calendar, Globe, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AvatarPlaceholder from '@/components/shared/AvatarPlaceholder';
import { stageLabels } from '@/lib/constants';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function StartupDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { lang } = useLang();
  const [startup, setStartup] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: startupData } = await supabase
        .from('startups')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!startupData) { setLoading(false); return; }
      setStartup(startupData);

      // Fetch matches for this startup
      const { data: matchData } = await supabase
        .from('matches_full')
        .select('*')
        .eq('startup_id', startupData.id)
        .order('score', { ascending: false })
        .limit(5);

      if (matchData) setMatches(matchData);
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-400">Loading...</div></div>;

  if (!startup) {
    return (
      <main className="w-full py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{lang === 'tr' ? 'Startup bulunamadı' : 'Startup not found'}</h1>
        <Link href="/startups"><Button variant="outline">{lang === 'tr' ? 'Geri Dön' : 'Go Back'}</Button></Link>
      </main>
    );
  }

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft size={18} /> {lang === 'tr' ? 'Geri' : 'Back'}
          </button>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <AvatarPlaceholder name={startup.name} size="xl" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold">{startup.name}</h1>
                {startup.featured && (
                  <Badge className="bg-amber-100 text-amber-700 border-0">Featured</Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary">{startup.sector}</Badge>
                <Badge variant="outline">{stageLabels[startup.stage as keyof typeof stageLabels]}</Badge>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} /> {startup.location}
                </span>
              </div>
              <p className="text-gray-600 text-lg">
                {lang === 'tr' ? startup.description_tr : startup.description_en}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="mx-auto mb-2 text-emerald-600" size={24} />
                    <p className="text-sm text-gray-500">{lang === 'tr' ? 'Kuruluş' : 'Founded'}</p>
                    <p className="text-xl font-bold">{startup.founded_year || '-'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="mx-auto mb-2 text-blue-600" size={24} />
                    <p className="text-sm text-gray-500">{lang === 'tr' ? 'Ekip' : 'Team'}</p>
                    <p className="text-xl font-bold">{startup.team_size || '-'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="mx-auto mb-2 text-amber-600" size={24} />
                    <p className="text-sm text-gray-500">{lang === 'tr' ? 'Yatırım' : 'Funding'}</p>
                    <p className="text-xl font-bold">{startup.funding || '-'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Zap className="mx-auto mb-2 text-purple-600" size={24} />
                    <p className="text-sm text-gray-500">{lang === 'tr' ? 'Aşama' : 'Stage'}</p>
                    <p className="text-xl font-bold">{stageLabels[startup.stage as keyof typeof stageLabels]}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tags */}
              {startup.tags && startup.tags.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">{lang === 'tr' ? 'Teknolojiler & Etiketler' : 'Technologies & Tags'}</h3>
                    <div className="flex flex-wrap gap-2">
                      {startup.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="px-3 py-1">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Matches */}
              {matches.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">{lang === 'tr' ? 'Eşleşmeler' : 'Matches'}</h3>
                    <div className="space-y-4">
                      {matches.map((match) => (
                        <div key={match.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                          <AvatarPlaceholder name={match.corporate_name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{match.corporate_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={match.score} className="h-2 flex-1" />
                              <span className="text-sm font-semibold text-emerald-600">{match.score}%</span>
                            </div>
                          </div>
                          <Badge className={
                            match.status === 'connected' ? 'bg-green-100 text-green-700 border-0' :
                            match.status === 'accepted' ? 'bg-blue-100 text-blue-700 border-0' :
                            'bg-gray-100 text-gray-700 border-0'
                          }>
                            {match.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">{lang === 'tr' ? 'İletişim' : 'Contact'}</h3>
                  {startup.website && (
                    <a
                      href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                    >
                      <Globe size={16} /> {startup.website} <ExternalLink size={12} />
                    </a>
                  )}
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    {lang === 'tr' ? 'Eşleşme Talep Et' : 'Request Match'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    {lang === 'tr' ? 'Mesaj Gönder' : 'Send Message'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
