'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Users, Target, Briefcase, TrendingUp } from 'lucide-react';
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

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-slate-400">Loading...</div></div>;

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-20 sm:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Connect Bold Startups with Visionary Corporates
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Where innovation meets enterprise. Discover partnerships that drive transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 w-full">Join as Startup</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 w-full">Join as Corporate</Button>
            </Link>
            <Link href="/startups">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full">Explore Startups</Button>
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
              <p className="text-gray-600 mt-2">Active Startups</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700">50+</div>
              <p className="text-gray-600 mt-2">Corporate Partners</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700">180+</div>
              <p className="text-gray-600 mt-2">Successful Matches</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700">45+</div>
              <p className="text-gray-600 mt-2">Events Hosted</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-emerald-700" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Create Profile</h3>
              <p className="text-gray-600">Sign up and tell us about your company or startup</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-emerald-700" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Define Needs</h3>
              <p className="text-gray-600">Specify what you're looking for or offer</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-emerald-700" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Matched</h3>
              <p className="text-gray-600">AI-powered matching finds perfect partners</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-emerald-700" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Collaborate</h3>
              <p className="text-gray-600">Connect and build together</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Startups */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Featured Startups</h2>
            <Link href="/startups" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2">
              View All <ArrowRight size={20} />
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
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{lang === 'tr' ? startup.description_tr : startup.description_en}</p>
                  <div className="pt-4 border-t">
                    <Link href={`/startups/${startup.id}`} className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold">
                      Learn More →
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
            <h2 className="text-3xl sm:text-4xl font-bold">What Corporates Need</h2>
            <Link href="/wishlist" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2">
              View All <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{item.corporate_name}</p>
                  <h3 className="font-bold text-lg mb-2">{lang === 'tr' ? item.title_tr : item.title_en}</h3>
                  <p className="text-gray-600 text-sm mb-4">{lang === 'tr' ? item.description_tr : item.description_en}</p>
                  <div className="flex gap-2 flex-wrap">
                    {(item.tags ?? []).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
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
            <h2 className="text-3xl sm:text-4xl font-bold">Upcoming Events</h2>
            <Link href="/events" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2">
              View All <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <p className="text-sm text-emerald-600 font-semibold mb-2">{new Date(event.date).toLocaleDateString()}</p>
                  <h3 className="font-bold text-lg mb-2">{lang === 'tr' ? event.title_tr : event.title_en}</h3>
                  <p className="text-gray-600 text-sm mb-4">📍 {event.location}</p>
                  <p className="text-sm text-gray-500">{event.attendee_count} attendees</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold">Latest News</h2>
            <Link href="/news" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2">
              View All <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3 text-[10px]">{article.category}</Badge>
                  <h3 className="font-bold text-lg mb-2">{lang === 'tr' ? article.title_tr : article.title_en}</h3>
                  <p className="text-gray-600 text-sm">{new Date(article.published_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Members */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Founding Corporate Members</h2>
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Manifesto</h2>
          <p className="text-lg text-emerald-50 mb-8 max-w-2xl mx-auto">
            We believe in the power of collaboration. Startups bring innovation. Corporates bring scale. Together, they create transformation.
          </p>
          <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100">
            Read Our Mission
          </Button>
        </div>
      </section>
    </main>
  );
}
