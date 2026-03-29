'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Users, Target, Briefcase, TrendingUp, X, Eye, Lightbulb, Handshake, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AvatarPlaceholder from '@/components/shared/AvatarPlaceholder';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function HomePage() {
  const { t, lang } = useLang();
  const [startups, setStartups] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [corporates, setCorporates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [missionOpen, setMissionOpen] = useState(false);

  useEffect(() => {
    async function fetchAllData() {
      const supabase = createClient();
      const today = new Date().toISOString().split('T')[0];

      const [startupsRes, wishlistRes, eventsRes, newsRes, corporatesRes] = await Promise.all([
        supabase.from('startups').select('*').eq('featured', true).limit(4),
        supabase.from('wishlist_with_counts').select('*').eq('status', 'open').limit(3),
        supabase.from('events_with_counts').select('*').gte('date', today).order('date').limit(3),
        supabase.from('news_articles').select('*').order('published_at', { ascending: false }).limit(3),
        supabase.from('corporates').select('*').eq('is_founder', true),
      ]);

      setStartups(startupsRes.data ?? []);
      setWishlist(wishlistRes.data ?? []);
      setEvents(eventsRes.data ?? []);
      setNews(newsRes.data ?? []);
      setCorporates(corporatesRes.data ?? []);
      setLoading(false);
    }
    fetchAllData();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-slate-600">Loading...</div></div>;

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-20 sm:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=startup">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 w-full">{t('hero.cta.startup')}</Button>
            </Link>
            <Link href="/register?role=corporate">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 w-full">{t('hero.cta.corporate')}</Button>
            </Link>
            <Link href="/startups">
              <Button size="lg" className="bg-transparent border border-white text-white hover:bg-white/10 w-full">{t('hero.cta.explore')}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700">240+</div>
              <p className="text-gray-700 mt-2">{t('stats.startups')}</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700">50+</div>
              <p className="text-gray-700 mt-2">{t('stats.corporates')}</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700">180+</div>
              <p className="text-gray-700 mt-2">{t('stats.matches')}</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700">45+</div>
              <p className="text-gray-700 mt-2">{t('stats.events')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">{t('section.howItWorks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-emerald-700" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('how.step1.title')}</h3>
              <p className="text-gray-700">{t('how.step1.desc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-emerald-700" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('how.step2.title')}</h3>
              <p className="text-gray-700">{t('how.step2.desc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-emerald-700" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('how.step3.title')}</h3>
              <p className="text-gray-700">{t('how.step3.desc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-emerald-700" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('how.step4.title')}</h3>
              <p className="text-gray-700">{t('how.step4.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Startups */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">{t('section.featuredStartups')}</h2>
            <Link href="/startups" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2">
              {t('section.viewAll')} <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {startups.map((startup) => (
              <Card key={startup.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <AvatarPlaceholder name={startup.name} size="lg" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{startup.name}</h3>
                  <Badge variant="secondary" className="mb-3">{startup.sector}</Badge>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-4">{lang === 'tr' ? startup.description_tr : startup.description_en}</p>
                  <div className="pt-4 border-t">
                    <Link href={`/startups/${startup.id}`} className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold">
                      {t('startups.viewProfile')} →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Needs */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">{t('section.corporateNeeds')}</h2>
            <Link href="/wishlist" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2">
              {t('section.viewAll')} <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-2">{item.corporate_name}</p>
                  <h3 className="font-bold text-lg mb-2">{lang === 'tr' ? item.title_tr : item.title_en}</h3>
                  <p className="text-gray-700 text-sm mb-4">{lang === 'tr' ? item.description_tr : item.description_en}</p>
                  <div className="flex gap-2 flex-wrap">
                    {(item.tags ?? []).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">{t('section.upcomingEvents')}</h2>
            <Link href="/events" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2">
              {t('section.viewAll')} <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <p className="text-sm text-emerald-600 font-semibold mb-2">{new Date(event.date).toLocaleDateString()}</p>
                  <h3 className="font-bold text-lg mb-2">{lang === 'tr' ? event.title_tr : event.title_en}</h3>
                  <p className="text-gray-700 text-sm mb-4">{event.location}</p>
                  <p className="text-sm text-gray-600">
                    {event.attendee_count} {lang === 'tr' ? 'katılımcı' : 'attendees'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">{t('section.latestNews')}</h2>
            <Link href="/news" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2">
              {t('section.viewAll')} <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3 text-xs">{article.category}</Badge>
                  <h3 className="font-bold text-lg mb-2">{lang === 'tr' ? article.title_tr : article.title_en}</h3>
                  <p className="text-gray-700 text-sm">{new Date(article.published_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Members */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">{t('section.members')}</h2>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {corporates.map((corp) => (
              <div key={corp.id} className="flex flex-col items-center">
                <AvatarPlaceholder name={corp.name} size="lg" />
                <p className="text-sm font-semibold mt-3 text-center">{corp.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto CTA */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t('section.manifesto')}</h2>
          <p className="text-lg text-emerald-50 mb-8 max-w-2xl mx-auto">
            {t('home.manifesto.desc')}
          </p>
          <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100" onClick={() => setMissionOpen(true)}>
            {t('home.manifesto.cta')}
          </Button>
        </div>
      </section>

      {/* Mission Modal */}
      {missionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setMissionOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-800 to-teal-700 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t('mission.title')}</h2>
              <button onClick={() => setMissionOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              <p className="text-gray-700 leading-relaxed">{t('mission.p1')}</p>
              <p className="text-gray-700 leading-relaxed">{t('mission.p2')}</p>

              {/* Vision */}
              <div className="bg-emerald-50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <Eye className="text-emerald-700" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-800">{t('mission.vision.title')}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{t('mission.vision.desc')}</p>
              </div>

              {/* Values */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('mission.values.title')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'mission.value1', icon: <ShieldCheck className="text-emerald-600" size={20} /> },
                    { key: 'mission.value2', icon: <Handshake className="text-emerald-600" size={20} /> },
                    { key: 'mission.value3', icon: <Lightbulb className="text-emerald-600" size={20} /> },
                    { key: 'mission.value4', icon: <Sparkles className="text-emerald-600" size={20} /> },
                  ].map((v) => (
                    <div key={v.key} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                      <div className="mt-0.5">{v.icon}</div>
                      <p className="text-sm text-gray-700">{t(v.key)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end">
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setMissionOpen(false)}>
                {t('home.manifesto.close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
