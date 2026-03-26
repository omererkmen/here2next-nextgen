'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AvatarPlaceholder from '@/components/shared/AvatarPlaceholder';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function CorporatesPage() {
  const { t } = useLang();
  const [corporates, setCorporates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCorporate, setSelectedCorporate] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Fetch corporates
      const { data: corpsData } = await supabase
        .from('corporates')
        .select('*')
        .order('is_founder', { ascending: false })
        .order('name', { ascending: true });

      // Fetch wishlist counts
      const { data: wishlistData } = await supabase
        .from('wishlist_items')
        .select('corporate_id');

      // Count wishlist items per corporate
      const wishlistCounts = (wishlistData ?? []).reduce((acc: any, item: any) => {
        acc[item.corporate_id] = (acc[item.corporate_id] || 0) + 1;
        return acc;
      }, {});

      // Merge wishlist counts with corporates
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

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-400">Loading...</div></div>;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Corporate Directory</h1>
          <p className="text-gray-600">{filtered.length} corporate partners</p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Search corporates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((corp) => (
              <Card
                key={corp.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCorporate(corp)}
              >
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
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{corp.description_en}</p>
                  <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} /> {corp.location}
                    </div>
                    <p>Member since {corp.memberSince}</p>
                    <p className="font-semibold text-emerald-600">{corp.wishlistCount} open needs</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Dialog */}
      {selectedCorporate && (
        <Dialog open={!!selectedCorporate} onOpenChange={() => setSelectedCorporate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4">
                <AvatarPlaceholder name={selectedCorporate.name} size="lg" />
                <div>
                  <h2 className="text-2xl font-bold">{selectedCorporate.name}</h2>
                  {selectedCorporate.is_founder && (
                    <div className="flex items-center gap-2 mt-1">
                      <Award className="text-amber-500" size={16} />
                      <span className="text-sm text-amber-600 font-semibold">Founding Member</span>
                    </div>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-600">{selectedCorporate.description_en}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Sector</p>
                  <p className="font-semibold">{selectedCorporate.sector}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">{selectedCorporate.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-semibold">{selectedCorporate.memberSince}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Open Needs</p>
                  <p className="font-semibold">{selectedCorporate.wishlistCount} items</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">View Wishlist</Button>
                <Button variant="outline" className="flex-1">
                  Contact
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
