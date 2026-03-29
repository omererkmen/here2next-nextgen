'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, X, Pencil, Search, Building2, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { sectors } from '@/lib/constants';

interface Corporate {
  id: string;
  name: string;
  slug: string;
  sector: string;
  location: string;
  website: string;
  status: string;
  description_tr: string;
  description_en: string;
  is_founder: boolean;
  created_at: string;
}

export default function AdminCorporatesPage() {
  const { lang } = useLang();
  const [corporates, setCorporates] = useState<Corporate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Corporate>>({});
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => { fetchCorporates(); }, []);

  async function fetchCorporates() {
    const supabase = createClient();
    const { data } = await supabase
      .from('corporates')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setCorporates(data);
    setLoading(false);
  }

  function startEdit(c: Corporate) {
    setEditingId(c.id);
    setEditData({
      name: c.name, sector: c.sector, location: c.location,
      website: c.website, status: c.status, description_tr: c.description_tr,
      description_en: c.description_en, is_founder: c.is_founder,
    });
  }

  function cancelEdit() { setEditingId(null); setEditData({}); }

  async function saveEdit(id: string) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('corporates')
      .update(editData)
      .eq('id', id);

    if (error) {
      alert('Hata: ' + error.message);
    } else {
      setCorporates(prev => prev.map(c => c.id === id ? { ...c, ...editData } as Corporate : c));
      setEditingId(null);
      setEditData({});
    }
    setSaving(false);
  }

  async function deleteCorporate(id: string, name: string) {
    const confirmed = window.confirm(
      lang === 'tr' ? `"${name}" kurumunu silmek istediğinize emin misiniz?` : `Delete "${name}"?`
    );
    if (!confirmed) return;
    const supabase = createClient();
    const { error } = await supabase.from('corporates').delete().eq('id', id);
    if (error) alert('Hata: ' + error.message);
    else setCorporates(prev => prev.filter(c => c.id !== id));
  }

  const statusColor = (s: string) => {
    if (s === 'approved') return 'bg-green-100 text-green-700 border-0';
    if (s === 'pending') return 'bg-amber-100 text-amber-700 border-0';
    return 'bg-red-100 text-red-700 border-0';
  };

  const filtered = corporates.filter(c => {
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.sector?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-4">
            <ArrowLeft size={14} /> {lang === 'tr' ? 'Admin Paneli' : 'Admin Dashboard'}
          </Link>
          <div className="flex items-center gap-3">
            <Building2 size={28} />
            <h1 className="text-3xl font-bold">
              {lang === 'tr' ? 'Kurum Yönetimi' : 'Corporate Management'}
            </h1>
            <Badge className="bg-white/20 text-white border-0 ml-2">{corporates.length}</Badge>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder={lang === 'tr' ? 'Kurum adı veya sektör ara...' : 'Search name or sector...'} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
            {filtered.map((c) => (
              <Card key={c.id} className={editingId === c.id ? 'border-blue-300 ring-1 ring-blue-200' : ''}>
                <CardContent className="p-5">
                  {editingId === c.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === 'tr' ? 'Kurum Adı' : 'Name'}</label>
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
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{lang === 'tr' ? 'Lokasyon' : 'Location'}</label>
                          <Input value={editData.location || ''} onChange={(e) => setEditData({ ...editData, location: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">Website</label>
                          <Input value={editData.website || ''} onChange={(e) => setEditData({ ...editData, website: e.target.value })} />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editData.is_founder || false}
                              onChange={(e) => setEditData({ ...editData, is_founder: e.target.checked })}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{lang === 'tr' ? 'Kurucu Üye' : 'Founding Member'}</span>
                          </label>
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
                        <Button onClick={() => saveEdit(c.id)} disabled={saving} className="bg-blue-600 hover:bg-blue-700 gap-1">
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
                          <h3 className="font-semibold">{c.name}</h3>
                          <Badge className={statusColor(c.status)}>{c.status}</Badge>
                          {c.is_founder && <Badge className="bg-amber-100 text-amber-700 border-0">{lang === 'tr' ? 'Kurucu' : 'Founder'}</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">
                          {c.sector} • {c.location}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(c.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link href={`/corporates/${c.slug}`}>
                          <Button size="sm" variant="outline" className="h-8 gap-1">
                            <ExternalLink size={14} />
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" onClick={() => startEdit(c)} className="h-8 gap-1">
                          <Pencil size={14} /> {lang === 'tr' ? 'Düzenle' : 'Edit'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteCorporate(c.id, c.name)} className="h-8 text-red-600 border-red-200 hover:bg-red-50">
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
                {lang === 'tr' ? 'Kurum bulunamadı' : 'No corporates found'}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
