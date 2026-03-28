'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Users, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import AvatarPlaceholder from '@/components/shared/AvatarPlaceholder';
import { sectors, stages, stageLabels } from '@/lib/constants';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function StartupsPage() {
  const { t, lang } = useLang();
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedStartup, setSelectedStartup] = useState<any>(null);

  useEffect(() => {
    async function fetchStartups() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (data) setStartups(data);
      setLoading(false);
    }
    fetchStartups();
  }, []);

  const filtered = startups.filter((startup) => {
    const matchesSearch = startup.name.toLowerCase().includes(search.toLowerCase());
    const matchesSector = !selectedSector || startup.sector === selectedSector;
    const matchesStage = !selectedStage || startup.stage === selectedStage;
    return matchesSearch && matchesSector && matchesStage;
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-400">Loading...</div></div>;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Startup Directory</h1>
          <p className="text-gray-600">{filtered.length} startups found</p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Search startups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Stages</SelectItem>
                {Object.entries(stageLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((startup) => (
              <Link key={startup.id} href={`/startups/${startup.slug}`}>
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer h-full"
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <AvatarPlaceholder name={startup.name} size="lg" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{startup.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {startup.sector}
                  </Badge>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {lang === 'tr' ? startup.description_tr : startup.description_en}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(startup.tags ?? []).slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} /> {startup.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} /> {startup.team_size} team
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Dialog */}
      {selectedStartup && (
        <Dialog open={!!selectedStartup} onOpenChange={() => setSelectedStartup(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4">
                <AvatarPlaceholder name={selectedStartup.name} size="lg" />
                <div>
                  <h2 className="text-2xl font-bold">{selectedStartup.name}</h2>
                  <Badge variant="secondary">{selectedStartup.sector}</Badge>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-600">
                  {lang === 'tr' ? selectedStartup.description_tr : selectedStartup.description_en}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Founded</p>
                  <p className="font-semibold">{selectedStartup.founded_year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Team Size</p>
                  <p className="font-semibold">{selectedStartup.team_size} people</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Funding Raised</p>
                  <p className="font-semibold">{selectedStartup.funding}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stage</p>
                  <p className="font-semibold">{stageLabels[selectedStartup.stage as keyof typeof stageLabels]}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedStartup.tags ?? []).map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">Request Match</Button>
                <a href={`https://${selectedStartup.website}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Visit Website
                  </Button>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
