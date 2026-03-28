'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Award, Globe, ExternalLink, Calendar, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AvatarPlaceholder from '@/components/shared/AvatarPlaceholder';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function CorporateDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { lang } = useLang();
  const [corporate, setCorporate] = useState<any>(null);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: corpData } = await supabase
        .from('corporates')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!corpData) { setLoading(false); return; }
      setCorporate(corpData);

      // Fetch wishlist items
      const { data: wishlist } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('corporate_id', corpData.id)
        .order('created_at', { ascending: false });

      if (wishlist) setWishlistItems(wishlist);

      // Fetch matches
      const { data: matchData } = await supabase
        .from('matches_full')
        .select('*')
        .eq('corporate_id', corpData.id)
        .order('score', { ascending: false })
        .limit(5);

      if (matchData) setMatches(matchData);
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-400">Loading...</div></div>;

  if (!corporate) {
    return (
      <main className="w-full py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{lang === 'tr' ? 'Kurum bulunamadı' : 'Corporate not found'}</h1>
        <Link href="/corporates"><Button variant="outline">{lang === 'tr' ? 'Geri Dön' : 'Go Back'}</Button></Link>
      </main>
    );
  }

  return (
    <main className="w-full">
      {/* Hero */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft size={18} /> {lang === 'tr' ? 'Geri' : 'Back'}
          </button>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <AvatarPlaceholder name={corporate.name} size="xl" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold">{corporate.name}</h1>
                {corporate.is_founder && (
                  <div className="flex items-center gap-1">
                    <Award className="text-amber-500" size={20} />
                    <Badge className="bg-amber-100 text-amber-700 border-0">
                      {lang === 'tr' ? 'Kurucu Üye' : 'Founding Member'}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary">{corporate.sector}</Badge>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} /> {corporate.location}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar size={14} /> {lang === 'tr' ? 'Üyelik:' : 'Member since:'} {corporate.member_since}
                </span>
              </div>
              <p className="text-gray-600 text-lg">
                {lang === 'tr' ? corporate.description_tr : corporate.description_en}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wishlist */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ListChecks className="text-emerald-600" size={20} />
                    <h3 className="font-semibold text-lg">
                      {lang === 'tr' ? 'İhtiyaç Listesi' : 'Wishlist'} ({wishlistItems.length})
                    </h3>
                  </div>
                  {wishlistItems.length > 0 ? (
                    <div className="space-y-3">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="flex items-start justify-between p-4 rounded-lg bg-gray-50">
                          <div className="flex-1">
                            <h4 className="font-medium">{lang === 'tr' ? item.title_tr : item.title_en}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {lang === 'tr' ? item.description_tr : item.description_en}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">{item.sector}</Badge>
                              {item.deadline && (
                                <span className="text-xs text-gray-500">
                                  {lang === 'tr' ? 'Son:' : 'Deadline:'} {new Date(item.deadline).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge className={
                            item.status === 'open' ? 'bg-green-100 text-green-700 border-0' :
                            item.status === 'reviewing' ? 'bg-amber-100 text-amber-700 border-0' :
                            'bg-gray-100 text-gray-700 border-0'
                          }>
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {lang === 'tr' ? 'Henüz ihtiyaç listesi eklenmemiş' : 'No wishlist items yet'}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Matches */}
              {matches.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">{lang === 'tr' ? 'Eşleşmeler' : 'Matches'}</h3>
                    <div className="space-y-4">
                      {matches.map((match) => (
                        <div key={match.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                          <AvatarPlaceholder name={match.startup_name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{match.startup_name}</p>
                            <p className="text-xs text-gray-500">{match.startup_sector}</p>
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
                  {corporate.website && (
                    <a
                      href={corporate.website.startsWith('http') ? corporate.website : `https://${corporate.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                    >
                      <Globe size={16} /> {corporate.website} <ExternalLink size={12} />
                    </a>
                  )}
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    {lang === 'tr' ? 'İletişime Geç' : 'Get in Touch'}
                  </Button>
                  <Link href="/wishlist" className="block">
                    <Button variant="outline" className="w-full">
                      {lang === 'tr' ? 'Wishlist\'e Git' : 'View Wishlist'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
