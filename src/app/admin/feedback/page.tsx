'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bug, Lightbulb, MessageCircle, ArrowLeft, Filter, Loader2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

const statusOptions = [
  { value: 'open', label: { tr: 'Açık', en: 'Open' }, color: 'bg-blue-100 text-blue-700' },
  { value: 'in_progress', label: { tr: 'İşleniyor', en: 'In Progress' }, color: 'bg-amber-100 text-amber-700' },
  { value: 'resolved', label: { tr: 'Çözüldü', en: 'Resolved' }, color: 'bg-green-100 text-green-700' },
  { value: 'closed', label: { tr: 'Kapatıldı', en: 'Closed' }, color: 'bg-gray-100 text-gray-700' },
  { value: 'wont_fix', label: { tr: 'Yapılmayacak', en: "Won't Fix" }, color: 'bg-red-100 text-red-700' },
];

const priorityOptions = [
  { value: 'low', label: { tr: 'Düşük', en: 'Low' }, color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: { tr: 'Orta', en: 'Medium' }, color: 'bg-amber-100 text-amber-700' },
  { value: 'high', label: { tr: 'Yüksek', en: 'High' }, color: 'bg-orange-100 text-orange-700' },
  { value: 'critical', label: { tr: 'Kritik', en: 'Critical' }, color: 'bg-red-100 text-red-700' },
];

export default function AdminFeedbackPage() {
  const { lang } = useLang();
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Check admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') { router.push('/dashboard'); return; }

      const { data } = await supabase
        .from('feedback')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });

      if (data) {
        setFeedbackList(data);
        const notes: Record<string, string> = {};
        data.forEach((fb: any) => { notes[fb.id] = fb.admin_notes || ''; });
        setAdminNotes(notes);
      }
      setLoading(false);
    }
    fetchAll();
  }, [router]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setSavingId(id);
    const supabase = createClient();
    const { error } = await supabase
      .from('feedback')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setFeedbackList(prev => prev.map(fb => fb.id === id ? { ...fb, status: newStatus } : fb));
    }
    setSavingId(null);
  };

  const handleSaveNotes = async (id: string) => {
    setSavingId(id);
    const supabase = createClient();
    const { error } = await supabase
      .from('feedback')
      .update({ admin_notes: adminNotes[id], updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      alert(lang === 'tr' ? 'Kayıt başarısız' : 'Save failed');
    }
    setSavingId(null);
  };

  const typeIcon = (t: string) => {
    switch (t) {
      case 'bug': return <Bug size={16} className="text-red-600" />;
      case 'feature': return <Lightbulb size={16} className="text-amber-600" />;
      case 'comment': return <MessageCircle size={16} className="text-blue-600" />;
      default: return null;
    }
  };

  const typeLabel = (t: string) => {
    const map: Record<string, { tr: string; en: string }> = {
      bug: { tr: 'Bug', en: 'Bug' },
      feature: { tr: 'Özellik', en: 'Feature' },
      comment: { tr: 'Yorum', en: 'Comment' },
    };
    return map[t]?.[lang] || t;
  };

  const filtered = feedbackList.filter(fb => {
    if (filterType && fb.type !== filterType) return false;
    if (filterStatus && fb.status !== filterStatus) return false;
    return true;
  });

  // Stats
  const stats = {
    total: feedbackList.length,
    open: feedbackList.filter(f => f.status === 'open').length,
    bugs: feedbackList.filter(f => f.type === 'bug').length,
    features: feedbackList.filter(f => f.type === 'feature').length,
    critical: feedbackList.filter(f => f.priority === 'critical' || f.priority === 'high').length,
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  return (
    <main className="w-full">
      {/* Header */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft size={18} /> {lang === 'tr' ? 'Admin Panel' : 'Admin Panel'}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {lang === 'tr' ? 'Geri Bildirim Yönetimi' : 'Feedback Management'}
          </h1>
          <p className="text-gray-600">
            {lang === 'tr' ? `${stats.total} toplam geri bildirim` : `${stats.total} total feedback items`}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 border-b">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card><CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.open}</p>
              <p className="text-sm text-gray-600">{lang === 'tr' ? 'Açık' : 'Open'}</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{stats.bugs}</p>
              <p className="text-sm text-gray-600">Bug</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{stats.features}</p>
              <p className="text-sm text-gray-600">{lang === 'tr' ? 'Özellik' : 'Feature'}</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-orange-600">{stats.critical}</p>
              <p className="text-sm text-gray-600">{lang === 'tr' ? 'Yüksek/Kritik' : 'High/Critical'}</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-gray-600">{stats.total}</p>
              <p className="text-sm text-gray-600">{lang === 'tr' ? 'Toplam' : 'Total'}</p>
            </CardContent></Card>
          </div>
        </div>
      </section>

      {/* Filters + List */}
      <section className="py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={lang === 'tr' ? 'Tüm Türler' : 'All Types'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{lang === 'tr' ? 'Tüm Türler' : 'All Types'}</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">{lang === 'tr' ? 'Özellik' : 'Feature'}</SelectItem>
                <SelectItem value="comment">{lang === 'tr' ? 'Yorum' : 'Comment'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={lang === 'tr' ? 'Tüm Durumlar' : 'All Statuses'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{lang === 'tr' ? 'Tüm Durumlar' : 'All Statuses'}</SelectItem>
                {statusOptions.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label[lang]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Feedback List */}
          <div className="space-y-3">
            {filtered.map((fb) => {
              const isExpanded = expandedId === fb.id;
              const sOpt = statusOptions.find(s => s.value === fb.status);
              const pOpt = priorityOptions.find(p => p.value === fb.priority);

              return (
                <Card key={fb.id} className={fb.priority === 'critical' ? 'border-red-300' : fb.priority === 'high' ? 'border-orange-200' : ''}>
                  <CardContent className="p-4">
                    {/* Summary Row */}
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : fb.id)}
                    >
                      <div className="flex-shrink-0">{typeIcon(fb.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate">{fb.title}</h4>
                        </div>
                        <p className="text-xs text-gray-600">
                          {fb.profiles?.full_name || fb.profiles?.email || 'Anonymous'} • {new Date(fb.created_at).toLocaleDateString()}
                          {fb.page_url && ` • ${fb.page_url}`}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">{typeLabel(fb.type)}</Badge>
                      <Badge className={`${pOpt?.color} border-0 text-xs`}>{pOpt?.label[lang]}</Badge>
                      <Badge className={`${sOpt?.color} border-0 text-xs`}>{sOpt?.label[lang]}</Badge>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {lang === 'tr' ? 'Açıklama:' : 'Description:'}
                          </p>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{fb.description}</p>
                        </div>

                        {/* Status Change */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">
                            {lang === 'tr' ? 'Durum:' : 'Status:'}
                          </span>
                          <div className="flex gap-2">
                            {statusOptions.map((s) => (
                              <button
                                key={s.value}
                                onClick={() => handleStatusChange(fb.id, s.value)}
                                disabled={savingId === fb.id}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                  fb.status === s.value
                                    ? `${s.color} ring-2 ring-offset-1 ring-gray-400`
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {s.label[lang]}
                              </button>
                            ))}
                          </div>
                          {savingId === fb.id && <Loader2 size={14} className="animate-spin text-gray-400" />}
                        </div>

                        {/* Admin Notes */}
                        <div>
                          <label className="text-sm font-medium text-gray-900 mb-1 block">
                            {lang === 'tr' ? 'Admin Notu:' : 'Admin Notes:'}
                          </label>
                          <textarea
                            className="w-full min-h-[60px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2A5CB8]"
                            placeholder={lang === 'tr' ? 'Yanıt veya not ekleyin...' : 'Add a response or note...'}
                            value={adminNotes[fb.id] || ''}
                            onChange={(e) => setAdminNotes(prev => ({ ...prev, [fb.id]: e.target.value }))}
                          />
                          <Button
                            size="sm"
                            className="mt-2 bg-[#183690] hover:bg-[#102668] gap-1"
                            onClick={() => handleSaveNotes(fb.id)}
                            disabled={savingId === fb.id}
                          >
                            {savingId === fb.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {lang === 'tr' ? 'Kaydet' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {filtered.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-gray-600">
                  <Filter className="mx-auto mb-4 text-gray-300" size={48} />
                  <p>{lang === 'tr' ? 'Filtrelerinize uygun geri bildirim bulunamadı' : 'No feedback matching your filters'}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
