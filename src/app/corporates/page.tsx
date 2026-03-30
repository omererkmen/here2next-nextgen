'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AvatarPlaceholder from '@/components/shared/AvatarPlaceholder';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function CorporatesPage() {
  const { t, lang } = useLang();
  const [corporates, setCorporates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: corpsData } = await supabase
        .from('corporates')
        .select('*')
        .order('is_founder', { ascending: false })
        .order('name', { ascending: true });

      const { data: wishlistData } = await supabase
        .from('wishlist_items')
        .select('corporate_id');

      const wishlistCounts = (wishlistData ?? []).reduce((acc: any, item: any) => {
        acc[item.corporate_id] = (acc[item.corporate_id] || 0) + 1;
        return acc;
      }, {});

      const merged = (corpsData ?? []).map((corp: any) => ({
        ...corp,
        wishlistCount: wishlistCounts[corp.id] || 0,
        memberSince: new Date(corp.member_since).getFullYear(),
      }));

      setCorporates(merged);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = corporates.filter((corp) =>
    corp.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {lang === 'tr' ? 'Kurum Rehberi' : 'Corporate Directory'}
          </h1>
          <p className="text-gray-600">
            {lang === 'tr' ? `${filtered.length} kurumsal partner` : `${filtered.length} corporate partners`}
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 text-gray-600" size={18} />
              <Input
                placeholder={lang === 'tr' ? 'Kurum ara...' : 'Search corporates...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((corp) => (
              <Link key={corp.id} href={`/corporates/${corp.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <AvatarPlaceholder name={corp.name} size="lg" />
                      {corp.is_founder && (
                        <Award className="text-amber-500" size={20} />
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{corp.name}</h3>
                    <Badge variant="secondary" className="mb-3">
                      {corp.sector}
                    </Badge>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {lang === 'tr' ? corp.description_tr : corp.description_en}
                    </p>
                    <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} /> {corp.location}
                      </div>
                      <p>{lang === 'tr' ? `${corp.memberSince}'dan beri üye` : `Member since ${corp.memberSince}`}</p>
                      <p className="font-semibold text-[#1B3A7B]">
                        {lang === 'tr' ? `${corp.wishlistCount} açık ihtiyaç` : `${corp.wishlistCount} open needs`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
