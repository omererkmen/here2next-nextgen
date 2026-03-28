'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, CheckCircle, TrendingUp, Handshake, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AvatarPlaceholder from '@/components/shared/AvatarPlaceholder';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function MatchingPage() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userStartup, setUserStartup] = useState<any>(null);
  const [userCorporate, setUserCorporate] = useState<any>(null);
  const [requestedMatches, setRequestedMatches] = useState<Set<string>>(new Set());
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const { data, error } = await supabase
        .from('matches_full')
        .select('*')
        .order('score', { ascending: false });
      if (data) setMatches(data);

      // Get user's startup or corporate
      if (user) {
        const { data: startupData } = await supabase
          .from('startups')
          .select('id')
          .eq('profile_id', user.id)
          .single();
        if (startupData) setUserStartup(startupData);

        const { data: corpData } = await supabase
          .from('corporates')
          .select('id')
          .eq('profile_id', user.id)
          .single();
        if (corpData) setUserCorporate(corpData);

        // Check existing match requests
        const { data: existingReqs } = await supabase
          .from('match_requests')
          .select('startup_id, corporate_id');
        if (existingReqs) {
          const reqSet = new Set(existingReqs.map(r => `${r.startup_id}_${r.corporate_id}`));
          setRequestedMatches(reqSet);
        }
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  const handleConnect = async (match: any) => {
    if (!currentUser) { router.push('/login'); return; }

    const startupId = userStartup?.id || match.startup_id;
    const corporateId = userCorporate?.id || match.corporate_id;
    const key = `${match.startup_id}_${match.corporate_id}`;

    if (requestedMatches.has(key)) return;

    setConnectingId(match.id);
    const supabase = createClient();

    const { error } = await supabase.from('match_requests').insert({
      startup_id: match.startup_id,
      corporate_id: match.corporate_id,
      message: lang === 'tr' ? 'Eşleşme üzerinden bağlantı talebi' : 'Connection request via matching',
    });

    if (error) {
      if (error.code === '23505') {
        setRequestedMatches(prev => new Set([...prev, key]));
      } else {
        alert(lang === 'tr' ? 'Bir hata oluştu: ' + error.message : 'An error occurred: ' + error.message);
      }
    } else {
      setRequestedMatches(prev => new Set([...prev, key]));
    }
    setConnectingId(null);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  return (
    <main className="w-full">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={28} />
            <h1 className="text-3xl sm:text-4xl font-bold">
              {lang === 'tr' ? 'AI Destekli Eşleşme Sonuçları' : 'AI-Powered Matching Results'}
            </h1>
          </div>
          <p className="text-emerald-50 max-w-2xl">
            {lang === 'tr'
              ? `Profilinize ve ihtiyaçlarınıza göre ${matches.length} yüksek potansiyelli ortaklık belirledik.`
              : `We've identified ${matches.length} high-potential partnerships based on your profile and needs.`}
          </p>
        </div>
      </section>

      {/* Matches List */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {matches.map((match) => {
              const key = `${match.startup_id}_${match.corporate_id}`;
              const isRequested = requestedMatches.has(key);
              const isConnecting = connectingId === match.id;

              return (
                <Card key={match.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                      {/* Left: Startup */}
                      <Link href={`/startups/${match.startup_slug || match.startup_name?.toLowerCase().replace(/\s+/g, '-')}`} className="flex gap-4 items-center justify-center lg:justify-start hover:opacity-80 transition-opacity">
                        <AvatarPlaceholder name={match.startup_name} size="lg" />
                        <div className="text-center lg:text-left">
                          <h3 className="font-bold text-lg">{match.startup_name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {match.startup_sector}
                          </Badge>
                        </div>
                      </Link>

                      {/* Center: Score */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-emerald-600 mb-2">{match.score}%</div>
                          <p className="text-sm text-gray-600 mb-3">{lang === 'tr' ? 'Eşleşme Skoru' : 'Match Score'}</p>
                          <Progress value={match.score} className="w-full" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold">
                          <CheckCircle size={16} /> {lang === 'tr' ? 'Güçlü Eşleşme' : 'Great match'}
                        </div>
                      </div>

                      {/* Right: Corporate */}
                      <Link href={`/corporates/${match.corporate_slug || match.corporate_name?.toLowerCase().replace(/\s+/g, '-')}`} className="flex gap-4 items-center justify-center lg:justify-end hover:opacity-80 transition-opacity">
                        <div className="text-center lg:text-right">
                          <h3 className="font-bold text-lg">{match.corporate_name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {match.corporate_sector}
                          </Badge>
                        </div>
                        <AvatarPlaceholder name={match.corporate_name} size="lg" />
                      </Link>
                    </div>

                    {/* Reasons */}
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp size={18} /> {lang === 'tr' ? 'Neden Bu Eşleşme?' : 'Why This Match'}
                      </h4>
                      <ul className="space-y-2">
                        {(lang === 'tr' ? match.reasons_tr : match.reasons_en ?? []).map((reason: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                            <span className="text-emerald-600 font-bold mt-0.5">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 flex gap-3">
                      {isRequested ? (
                        <Button className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-100 cursor-default" disabled>
                          <CheckCircle size={16} className="mr-2" />
                          {lang === 'tr' ? 'Talep Gönderildi' : 'Request Sent'}
                        </Button>
                      ) : (
                        <Button
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleConnect(match)}
                          disabled={isConnecting}
                        >
                          {isConnecting ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Handshake size={16} className="mr-2" />}
                          {lang === 'tr' ? 'Bağlantı Kur' : 'Connect'}
                        </Button>
                      )}
                      <Link href={`/startups/${match.startup_slug || match.startup_name?.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          {lang === 'tr' ? 'Detayları Gör' : 'View Details'}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Explanation */}
      <section className="py-8 sm:py-12 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold text-lg mb-4">
                {lang === 'tr' ? 'AI Eşleştirme Nasıl Çalışır?' : 'How Our AI Matching Works'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">{lang === 'tr' ? 'Sektör Analizi' : 'Sector Analysis'}</h3>
                  <p className="text-sm text-gray-600">
                    {lang === 'tr'
                      ? 'Sektör odağı, pazar konumlandırması ve teknoloji yığınlarını analiz ederek tamamlayıcı fırsatları belirliyoruz.'
                      : 'We analyze industry focus, market positioning, and technology stacks to identify complementary opportunities.'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{lang === 'tr' ? 'Ekip & Büyüme Aşaması' : 'Team & Growth Stage'}</h3>
                  <p className="text-sm text-gray-600">
                    {lang === 'tr'
                      ? 'Sürdürülebilir ortaklıklar için ekip uzmanlığı, yatırım aşaması ve büyüme yörüngesini değerlendiriyoruz.'
                      : 'Matching considers team expertise, funding stage, and growth trajectory for sustainable partnerships.'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{lang === 'tr' ? 'Stratejik Uyum' : 'Strategic Fit'}</h3>
                  <p className="text-sm text-gray-600">
                    {lang === 'tr'
                      ? 'Her ortaklık için uzun vadeli stratejik uyumu ve karşılıklı fayda potansiyelini değerlendiriyoruz.'
                      : 'We evaluate long-term strategic alignment and mutual benefit potential for each partnership.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
