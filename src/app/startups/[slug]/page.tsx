'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Users, DollarSign, Calendar, Globe, Zap, ExternalLink, Send, Handshake, CheckCircle, Loader2 } from 'lucide-react';
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

  // Action states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userCorporate, setUserCorporate] = useState<any>(null);
  const [matchRequested, setMatchRequested] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgSent, setMsgSent] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

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

      // If user is corporate, check if already requested match
      if (user) {
        const { data: corpData } = await supabase
          .from('corporates')
          .select('id')
          .eq('profile_id', user.id)
          .single();

        if (corpData) {
          setUserCorporate(corpData);
          const { data: existingReq } = await supabase
            .from('match_requests')
            .select('id')
            .eq('startup_id', startupData.id)
            .eq('corporate_id', corpData.id)
            .single();
          if (existingReq) setMatchRequested(true);
        }
      }

      setLoading(false);
    }
    fetchData();
  }, [slug]);

  const handleRequestMatch = async () => {
    if (!currentUser) { router.push('/login'); return; }
    if (!userCorporate) { alert(lang === 'tr' ? 'Eşleşme talebi göndermek için kurumsal hesabınız olmalıdır.' : 'You need a corporate account to request a match.'); return; }

    setMatchLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('match_requests').insert({
      startup_id: startup.id,
      corporate_id: userCorporate.id,
      message: lang === 'tr' ? 'Eşleşme talebi gönderildi.' : 'Match request sent.',
    });

    if (error) {
      if (error.code === '23505') {
        setMatchRequested(true);
      } else {
        alert(lang === 'tr' ? 'Bir hata oluştu: ' + error.message : 'An error occurred: ' + error.message);
      }
    } else {
      setMatchRequested(true);
    }
    setMatchLoading(false);
  };

  const handleSendMessage = async () => {
    if (!currentUser) { router.push('/login'); return; }
    if (!msgText.trim()) return;
    if (!startup.profile_id) {
      alert(lang === 'tr' ? 'Bu startup henüz bir kullanıcı hesabına bağlı değil.' : 'This startup is not linked to a user account yet.');
      return;
    }

    setMsgLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: startup.profile_id,
      content: msgText.trim(),
    });

    if (error) {
      alert(lang === 'tr' ? 'Mesaj gönderilemedi: ' + error.message : 'Failed to send message: ' + error.message);
    } else {
      setMsgSent(true);
      setMsgText('');
      setTimeout(() => { setMsgOpen(false); setMsgSent(false); }, 2000);
    }
    setMsgLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

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
      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
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
                    <Calendar className="mx-auto mb-2 text-[#1B3A7B]" size={24} />
                    <p className="text-sm text-gray-600">{lang === 'tr' ? 'Kuruluş' : 'Founded'}</p>
                    <p className="text-xl font-bold">{startup.founded_year || '-'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="mx-auto mb-2 text-blue-600" size={24} />
                    <p className="text-sm text-gray-600">{lang === 'tr' ? 'Ekip' : 'Team'}</p>
                    <p className="text-xl font-bold">{startup.team_size || '-'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="mx-auto mb-2 text-amber-600" size={24} />
                    <p className="text-sm text-gray-600">{lang === 'tr' ? 'Yatırım' : 'Funding'}</p>
                    <p className="text-xl font-bold">{startup.funding || '-'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Zap className="mx-auto mb-2 text-purple-600" size={24} />
                    <p className="text-sm text-gray-600">{lang === 'tr' ? 'Aşama' : 'Stage'}</p>
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
                              <span className="text-sm font-semibold text-[#1B3A7B]">{match.score}%</span>
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
                      className="flex items-center gap-2 text-[#1B3A7B] hover:text-[#1B3A7B]"
                    >
                      <Globe size={16} /> {startup.website} <ExternalLink size={12} />
                    </a>
                  )}

                  {/* Request Match Button */}
                  {matchRequested ? (
                    <Button className="w-full bg-gray-100 text-gray-600 cursor-default hover:bg-gray-100" disabled>
                      <CheckCircle size={16} className="mr-2" />
                      {lang === 'tr' ? 'Talep Gönderildi' : 'Request Sent'}
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-[#1B3A7B] hover:bg-[#122858]"
                      onClick={handleRequestMatch}
                      disabled={matchLoading}
                    >
                      {matchLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Handshake size={16} className="mr-2" />}
                      {lang === 'tr' ? 'Eşleşme Talep Et' : 'Request Match'}
                    </Button>
                  )}

                  {/* Send Message Button */}
                  <Button variant="outline" className="w-full" onClick={() => {
                    if (!currentUser) { router.push('/login'); return; }
                    setMsgOpen(!msgOpen);
                  }}>
                    <Send size={16} className="mr-2" />
                    {lang === 'tr' ? 'Mesaj Gönder' : 'Send Message'}
                  </Button>

                  {/* Message Input */}
                  {msgOpen && (
                    <div className="space-y-3 pt-2 border-t">
                      <textarea
                        className="w-full min-h-[80px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2A4FA0] focus:border-[#2A4FA0]"
                        placeholder={lang === 'tr' ? 'Mesajınızı yazın...' : 'Write your message...'}
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                      />
                      {msgSent ? (
                        <div className="flex items-center gap-2 text-[#1B3A7B] text-sm font-medium">
                          <CheckCircle size={16} />
                          {lang === 'tr' ? 'Mesaj gönderildi!' : 'Message sent!'}
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-[#1B3A7B] hover:bg-[#122858]"
                          onClick={handleSendMessage}
                          disabled={msgLoading || !msgText.trim()}
                        >
                          {msgLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Send size={16} className="mr-2" />}
                          {lang === 'tr' ? 'Gönder' : 'Send'}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
