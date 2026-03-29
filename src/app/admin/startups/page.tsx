'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, X, Pencil, Search, Rocket, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { sectors, stages } from '@/lib/constants';

interface Startup {
  id: string;
  name: string;
  slug: string;
  sector: string;
  stage: string;
  location: string;
  website: string;
  status: string;
  description_tr: string;
  description_en: string;
  founded_year: number;
  team_size: number;
  funding: string;
  created_at: string;
}

export default function AdminStartupsPage() {
  const { lang } = useLang();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Startup>>({});
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => { fetchStartups(); }, []);

  async function fetchStartups() {
    const supabase = createClient();
    const { data } = await supabase
      .from('startups')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setStartups(data);
    setLoading(false);
  }

  function startEdit(s: Startup) {
    setEditingId(s.id);
    setEditData({
      name: s.name, sector: s.sector, stage: s.stage, location: s.location,
      website: s.website, status: s.status, description_tr: s.description_tr,
      description_en: s.description_en, founded_year: s.founded_year,
      team_size: s.team_size, funding: s.funding,
    });
  }

  function cancelEdit() { setEditingId(null); setEditData({}); }

  async function saveEdit(id: string) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('startups')
      .update(editData)
      .eq('id', id);

    if (error) {
      alert('Hata: ' + error.message);
    } else {
      setStartups(prev => prev.map(s => s.id === id ? { ...s, ...editData } as Startup : s));
      setEditingId(null);
      setEditData({});
    }
    setSaving(false);
  }

  async function deleteStartup(id: string, name: string) {
    const confirmed = window.confirm(
      lang === 'tr' ? `"${name}" startup'ını silmek istediğinize emin misiniz?` : `Delete "${name}"?`
    );
    if (!confirmed) return;
    const supabase = createClient();
    const { error } = await supabase.from('startups').delete().eq('id', id);
    if (error) alert('Hata: ' + error.message);
    else setStartups(prev => prev.filter(s => s.id !== id));
  }

  const statusColor = (s: string) => {
    if (s === 'approved') return 'bg-green-100 text-green-700 border-0';
    if (s === 'pending') return 'bg-amber-100 text-amber-700 border-0';
    return 'bg-red-100 text-red-700 border-0';
  };

  const filtered = startups.filter(s => {
    const matchSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.sector?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-4">
            <ArrowLeft size={14} /> {lang === 'tr' ? 'Admin Paneli' : 'Admin Dashboard'}
          </Link>
          <div className="flex items-center gap-3">
            <Rocket size={28} />
            <h1 className="text-3xl font-bold">
              {lang === 'tr' ? 'Startup Yönetimi' : 'Startup Management'}
            </h1>
            <Badge className="bg-white/20 text-white border-0 ml-2">{startups.length}</Badge>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder={lang === 'tr' ? 'Startup adı veya sektör ara...' : 'Search name or sector...'} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === 'tr' ? 'Tüm Durumlar' : 'All Statuses'}</SelectItem>
                <SelectItem value="approved">{lang === 'tr' ? 'Onaylı' : 'Approved'}</SelectItem>
                <SelectItem value="pending">{lang === 'tr' ? 'Beklemede' : 'Pending'}</SelectItem>
                <SelectItem value="rejected">{lang === 'tr' ? 'Reddedildi' : 'Rejected'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filtered.map((s) => (
              <Card key={s.id} className={editingId === s.id ? 'border-emerald-300 ring-1 ring-emerald-200' : ''}>
                <CardContent className="p-5">
                  {editingId === s.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === 'tr' ? 'Startup Adı' : 'Name'}</label>
                          <Input value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === 'tr' ? 'Sektör' : 'Sector'}</label>
                          <Select value={editData.sector || ''} onValueChange={(v) => setEditData({ ...editData, sector: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {sectors.map(sec => <SelectItem key={sec} value={sec}>{sec}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === 'tr' ? 'Aşama' : 'Stage'}</label>
                          <Select value={editData.stage || ''} onValueChange={(v) => setEditData({ ...editData, stage: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {stages.map(st => <SelectItem key={st.value} value={st.value}>{st.label.tr}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === 'tr' ? 'Lokasyon' : 'Location'}</label>
                          <Input value={editData.location || ''} onChange={(e) => setEditData({ ...editData, location: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">Website</label>
                          <Input value={editData.website || ''} onChange={(e) => setEditData({ ...editData, website: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === 'tr' ? 'Durum' : 'Status'}</label>
                          <Select value={editData.status || ''} onValueChange={(v) => setEditData({ ...editData, status: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="approved">{lang === 'tr' ? 'Onaylı' : 'Approved'}</SelectItem>
                              <SelectItem value="pending">{lang === 'tr' ? 'Beklemede' : 'Pending'}</SelectItem>
                              <SelectItem value="rejected">{lang === 'tr' ? 'Reddedildi' : 'Rejected'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === 'tr' ? 'Kuruluş Yılı' : 'Founded Year'}</label>
                          <Input type="number" value={editData.founded_year || ''} onChange={(e) => setEditData({ ...editData, founded_year: parseInt(e.target.value) })} />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === 'tr' ? 'Ekip Büyüklüğü' : 'Team Size'}</label>
                          <Input type="number" value={editData.team_size || ''} onChange={(e) => setEditData({ ...editData, team_size: parseInt(e.target.value) })} />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === 'tr' ? 'Yatırım' : 'Funding'}</label>
                          <Input value={editData.funding || ''} onChange={(e) => setEditData({ ...editData, funding: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === 'tr' ? 'Açıklama (TR)' : 'Description (TR)'}</label>
                        <textarea className="w-full border rounded-md p-2 text-sm min-h-[60px]" value={editData.description_tr || ''} onChange={(e) => setEditData({ ...editData, description_tr: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === 'tr' ? 'Açıklama (EN)' : 'Description (EN)'}</label>
                        <textarea className="w-full border rounded-md p-2 text-sm min-h-[60px]" value={editData.description_en || ''} onChange={(e) => setEditData({ ...editData, description_en: e.target.value })} />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button onClick={() => saveEdit(s.id)} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 gap-1">
                          <Save size={14} /> {lang === 'tr' ? 'Kaydet' : 'Save'}
                        </Button>
                        <Button variant="outline" onClick={cancelEdit} className="gap-1">
                          <X size={14} /> {lang === 'tr' ? 'İptal' : 'Cancel'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{s.name}</h3>
                          <Badge className={statusColor(s.status)}>{s.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {s.sector} • {s.stage} • {s.location}
                          {s.founded_year ? ` • ${s.founded_year}` : ''}
                          {s.team_size ? ` • ${s.team_size} kişi` : ''}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(s.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link href={`/startups/${s.slug}`}>
                          <Button size="sm" variant="outline" className="h-8 gap-1">
                            <ExternalLink size={14} />
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" onClick={() => startEdit(s)} className="h-8 gap-1">
                          <Pencil size={14} /> {lang === 'tr' ? 'Düzenle' : 'Edit'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteStartup(s.id, s.name)} className="h-8 text-red-600 border-red-200 hover:bg-red-50">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                {lang === 'tr' ? 'Startup bulunamadı' : 'No startups found'}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
