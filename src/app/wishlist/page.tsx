'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AvatarPlaceholder from '@/components/shared/AvatarPlaceholder';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function WishlistPage() {
  const { t, lang } = useLang();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchWishlist() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('wishlist_with_counts')
        .select('*')
        .eq('status', 'open');
      if (data) setWishlist(data);
      setLoading(false);
    }
    fetchWishlist();
  }, []);

  const filtered = wishlist.filter(
    (item) =>
      (lang === 'tr' ? item.title_tr : item.title_en).toLowerCase().includes(search.toLowerCase()) ||
      (item.corporate_name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-400">Loading...</div></div>;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Corporate Wishlist</h1>
            <p className="text-gray-600">{filtered.length} open opportunities</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Plus size={18} /> Add New Need
          </Button>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Search by title or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* List */}
          <div className="space-y-4">
            {filtered.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    {/* Left: Corporate info */}
                    <div className="flex-1 flex gap-4 items-start min-w-0">
                      <AvatarPlaceholder name={item.corporate_name ?? 'Corporate'} size="lg" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500 mb-1">{item.corporate_name}</p>
                        <h3 className="font-bold text-lg mb-2">{lang === 'tr' ? item.title_tr : item.title_en}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lang === 'tr' ? item.description_tr : item.description_en}</p>
                        <div className="flex flex-wrap gap-2">
                          {(item.tags ?? []).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Center: Metadata */}
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                          <Clock size={14} /> Deadline
                        </div>
                        <p className="font-semibold">{item.deadline ? new Date(item.deadline).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                          <Users size={14} /> Applicants
                        </div>
                        <p className="font-semibold">{item.application_count || 0}</p>
                      </div>
                    </div>

                    {/* Right: Status and CTA */}
                    <div className="flex flex-col items-end gap-3">
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">{item.status}</Badge>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Apply</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No opportunities found</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
