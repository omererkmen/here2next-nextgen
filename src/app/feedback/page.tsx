'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bug, Lightbulb, MessageCircle, Send, CheckCircle, Loader2, ArrowLeft, AlertTriangle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

const feedbackTypes = [
  { value: 'bug', icon: Bug, color: 'text-red-700 bg-white border-red-200 hover:border-red-400 hover:bg-red-50', activeColor: 'border-red-500 bg-red-50 ring-2 ring-red-300 text-red-700' },
  { value: 'feature', icon: Lightbulb, color: 'text-amber-700 bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50', activeColor: 'border-amber-500 bg-amber-50 ring-2 ring-amber-300 text-amber-700' },
  { value: 'comment', icon: MessageCircle, color: 'text-blue-700 bg-white border-blue-200 hover:border-blue-400 hover:bg-blue-50', activeColor: 'border-blue-500 bg-blue-50 ring-2 ring-blue-300 text-blue-700' },
];

const priorities = [
  { value: 'low', label: { tr: 'Düşük', en: 'Low' }, color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: { tr: 'Orta', en: 'Medium' }, color: 'bg-amber-100 text-amber-800' },
  { value: 'high', label: { tr: 'Yüksek', en: 'High' }, color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: { tr: 'Kritik', en: 'Critical' }, color: 'bg-red-100 text-red-800' },
];

export default function FeedbackPage() {
  const { lang } = useLang();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [type, setType] = useState<string>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myFeedback, setMyFeedback] = useState<any[]>([]);
  const [allFeedback, setAllFeedback] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push('/login'); return; }
      setUser(u);

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', u.id)
        .single();
      const admin = profile?.role === 'admin';
      setIsAdmin(admin);

      if (admin) {
        // Admin sees ALL feedback
        const { data } = await supabase
          .from('feedback')
          .select('*, profiles(full_name, email)')
          .order('created_at', { ascending: false });
        if (data) {
          setAllFeedback(data);
          setMyFeedback(data.filter((fb: any) => fb.profile_id === u.id));
        }
      } else {
        // Regular user sees only own feedback
        const { data } = await supabase
          .from('feedback')
          .select('*')
          .eq('profile_id', u.id)
          .order('created_at', { ascending: false });
        if (data) setMyFeedback(data);
      }
    }
    init();
  }, [router]);

  const validate = () => {
    const errs: { title?: string; description?: string } = {};
    if (!title.trim()) errs.title = lang === 'tr' ? 'Başlık zorunlu' : 'Title is required';
    if (!description.trim()) errs.description = lang === 'tr' ? 'Açıklama zorunlu' : 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const supabase = createClient();

    const { data, error } = await supabase.from('feedback').insert({
      profile_id: user.id,
      type,
      title: title.trim(),
      description: description.trim(),
      page_url: pageUrl.trim() || null,
      priority,
    }).select().single();

    if (error) {
      alert(lang === 'tr' ? 'Gönderilemedi: ' + error.message : 'Failed: ' + error.message);
    } else {
      setSubmitted(true);
      if (data) setMyFeedback(prev => [data, ...prev]);
      // Reset form
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setPageUrl('');
        setPriority('medium');
        setSubmitted(false);
        setErrors({});
      }, 3000);
    }
    setSubmitting(false);
  };

  const handleStatusChange = async (feedbackId: string, newStatus: string) => {
    setUpdatingId(feedbackId);
    const supabase = createClient();
    const { error } = await supabase
      .from('feedback')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', feedbackId);

    if (!error) {
      // Update both lists
      const updateList = (list: any[]) =>
        list.map((fb) => fb.id === feedbackId ? { ...fb, status: newStatus } : fb);
      setAllFeedback(updateList);
      setMyFeedback(updateList);
    }
    setUpdatingId(null);
  };

  const statuses = ['open', 'in_progress', 'resolved', 'closed', 'wont_fix'];

  const typeLabels: Record<string, { tr: string; en: string }> = {
    bug: { tr: 'Bug / Hata', en: 'Bug Report' },
    feature: { tr: 'Özellik Talebi', en: 'Feature Request' },
    comment: { tr: 'Yorum / Görüş', en: 'Comment' },
  };

  const statusLabel = (status: string) => {
    const map: Record<string, { tr: string; en: string }> = {
      open: { tr: 'Açık', en: 'Open' },
      in_progress: { tr: 'İşleniyor', en: 'In Progress' },
      resolved: { tr: 'Çözüldü', en: 'Resolved' },
      closed: { tr: 'Kapatıldı', en: 'Closed' },
      wont_fix: { tr: 'Yapılmayacak', en: "Won't Fix" },
    };
    return map[status]?.[lang] || status;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-0';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-0';
      case 'resolved': return 'bg-green-100 text-green-800 border-0';
      case 'closed': return 'bg-gray-200 text-gray-800 border-0';
      case 'wont_fix': return 'bg-red-100 text-red-800 border-0';
      default: return 'bg-gray-200 text-gray-800 border-0';
    }
  };

  const typeIcon = (t: string) => {
    switch (t) {
      case 'bug': return <Bug size={14} className="text-red-600" />;
      case 'feature': return <Lightbulb size={14} className="text-amber-600" />;
      case 'comment': return <MessageCircle size={14} className="text-blue-600" />;
      default: return null;
    }
  };

  return (
    <main className="w-full">
      {/* Header */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft size={18} /> {lang === 'tr' ? 'Geri' : 'Back'}
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {lang === 'tr' ? 'Geri Bildirim' : 'Feedback'}
          </h1>
          <p className="text-gray-700">
            {lang === 'tr'
              ? 'Bug bildirin, özellik talep edin veya görüşlerinizi paylaşın. Her geri bildirim platformu iyileştirmemize yardımcı olur.'
              : 'Report bugs, request features, or share your thoughts. Every feedback helps us improve.'}
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="mx-auto mb-4 text-blue-500" size={48} />
                <h2 className="text-xl font-bold mb-2">
                  {lang === 'tr' ? 'Teşekkürler!' : 'Thank you!'}
                </h2>
                <p className="text-gray-600">
                  {lang === 'tr'
                    ? 'Geri bildiriminiz alındı. En kısa sürede değerlendireceğiz.'
                    : 'Your feedback has been received. We\'ll review it shortly.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    {lang === 'tr' ? 'Tür' : 'Type'} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {feedbackTypes.map((ft) => {
                      const Icon = ft.icon;
                      const isActive = type === ft.value;
                      return (
                        <button
                          key={ft.value}
                          onClick={() => setType(ft.value)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${isActive ? ft.activeColor : ft.color}`}
                        >
                          <Icon size={24} />
                          <span className="text-sm font-medium">
                            {typeLabels[ft.value][lang]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    {lang === 'tr' ? 'Başlık' : 'Title'} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder={
                      type === 'bug' ? (lang === 'tr' ? 'Ör: Giriş sayfasında buton çalışmıyor' : 'E.g.: Login button not working')
                      : type === 'feature' ? (lang === 'tr' ? 'Ör: Profil fotoğrafı yükleme' : 'E.g.: Profile photo upload')
                      : (lang === 'tr' ? 'Ör: Arayüz çok güzel olmuş' : 'E.g.: Great UI design')
                    }
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: undefined })); }}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    {lang === 'tr' ? 'Açıklama' : 'Description'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`w-full min-h-[120px] rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2A5CB8] focus:border-[#2A5CB8]`}
                    placeholder={
                      type === 'bug' ? (lang === 'tr' ? 'Ne olması gerekiyordu? Ne oldu? Adımları yazın...' : 'What was expected? What happened? Steps to reproduce...')
                      : type === 'feature' ? (lang === 'tr' ? 'Bu özellik ne işe yarar? Neden gerekli?' : 'What would this feature do? Why is it needed?')
                      : (lang === 'tr' ? 'Görüşlerinizi paylaşın...' : 'Share your thoughts...')
                    }
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors(prev => ({ ...prev, description: undefined })); }}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Page URL (optional) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    {lang === 'tr' ? 'Sayfa URL (opsiyonel)' : 'Page URL (optional)'}
                  </label>
                  <Input
                    placeholder={lang === 'tr' ? 'Ör: /startups veya /dashboard' : 'E.g.: /startups or /dashboard'}
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    {lang === 'tr' ? 'Hangi sayfada sorun yaşadınız veya özellik istiyorsunuz?' : 'Which page does this relate to?'}
                  </p>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    {lang === 'tr' ? 'Öncelik' : 'Priority'}
                  </label>
                  <div className="flex gap-2">
                    {priorities.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setPriority(p.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          priority === p.value
                            ? `${p.color} ring-2 ring-offset-1 ring-gray-400`
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {p.label[lang]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <Button
                  className="w-full bg-[#183690] hover:bg-[#102668] h-12 text-base"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <><Loader2 size={18} className="mr-2 animate-spin" /> {lang === 'tr' ? 'Gönderiliyor...' : 'Submitting...'}</>
                  ) : (
                    <><Send size={18} className="mr-2" /> {lang === 'tr' ? 'Gönder' : 'Submit Feedback'}</>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Admin: All Feedback */}
          {isAdmin && allFeedback.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} className="text-[#183690]" />
                <h2 className="text-xl font-bold">
                  {lang === 'tr' ? 'Tüm Geri Bildirimler (Admin)' : 'All Feedback (Admin)'}
                </h2>
                <Badge className="bg-blue-100 text-[#102668] border-0">{allFeedback.length}</Badge>
              </div>

              {(['bug', 'feature', 'comment'] as const).map((category) => {
                const items = allFeedback.filter((fb) => fb.type === category);
                if (items.length === 0) return null;

                const categoryConfig = {
                  bug: { icon: <Bug size={18} className="text-red-600" />, label: typeLabels.bug, borderColor: 'border-red-200', bgColor: 'bg-red-50' },
                  feature: { icon: <Lightbulb size={18} className="text-amber-600" />, label: typeLabels.feature, borderColor: 'border-amber-200', bgColor: 'bg-amber-50' },
                  comment: { icon: <MessageCircle size={18} className="text-blue-600" />, label: typeLabels.comment, borderColor: 'border-blue-200', bgColor: 'bg-blue-50' },
                };
                const cfg = categoryConfig[category];

                return (
                  <div key={category} className="mb-6">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg ${cfg.bgColor} border ${cfg.borderColor} border-b-0`}>
                      {cfg.icon}
                      <h3 className="font-semibold text-sm text-gray-900">{cfg.label[lang]}</h3>
                      <span className="text-xs text-gray-500">({items.length})</span>
                    </div>
                    <div className={`border ${cfg.borderColor} rounded-b-lg divide-y divide-gray-100`}>
                      {items.map((fb) => (
                        <div key={fb.id} className="p-4 bg-white last:rounded-b-lg">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-medium text-sm text-gray-900">{fb.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {priorities.find(p => p.value === fb.priority)?.label[lang]}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{fb.description}</p>
                            <p className="text-xs text-gray-400 mb-2">
                              {fb.profiles?.full_name || fb.profiles?.email || '—'} • {new Date(fb.created_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                              {fb.page_url && ` • ${fb.page_url}`}
                            </p>
                            {/* Admin status buttons */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-medium text-gray-500 mr-1">
                                {lang === 'tr' ? 'Durum:' : 'Status:'}
                              </span>
                              {statuses.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(fb.id, s)}
                                  disabled={updatingId === fb.id}
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                                    fb.status === s
                                      ? `${statusColor(s)} ring-2 ring-offset-1 ring-gray-400`
                                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                                  } ${updatingId === fb.id ? 'opacity-50' : ''}`}
                                >
                                  {statusLabel(s)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Regular user: My Previous Feedback — grouped by category */}
          {!isAdmin && myFeedback.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">
                {lang === 'tr' ? 'Önceki Geri Bildirimlerim' : 'My Previous Feedback'}
              </h2>

              {(['bug', 'feature', 'comment'] as const).map((category) => {
                const items = myFeedback.filter((fb) => fb.type === category);
                if (items.length === 0) return null;

                const categoryConfig = {
                  bug: { icon: <Bug size={18} className="text-red-600" />, label: typeLabels.bug, borderColor: 'border-red-200', bgColor: 'bg-red-50' },
                  feature: { icon: <Lightbulb size={18} className="text-amber-600" />, label: typeLabels.feature, borderColor: 'border-amber-200', bgColor: 'bg-amber-50' },
                  comment: { icon: <MessageCircle size={18} className="text-blue-600" />, label: typeLabels.comment, borderColor: 'border-blue-200', bgColor: 'bg-blue-50' },
                };
                const cfg = categoryConfig[category];

                return (
                  <div key={category} className="mb-6">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg ${cfg.bgColor} border ${cfg.borderColor} border-b-0`}>
                      {cfg.icon}
                      <h3 className="font-semibold text-sm text-gray-900">{cfg.label[lang]}</h3>
                      <span className="text-xs text-gray-500">({items.length})</span>
                    </div>
                    <div className={`border ${cfg.borderColor} rounded-b-lg divide-y divide-gray-100`}>
                      {items.map((fb) => (
                        <div key={fb.id} className="p-4 bg-white last:rounded-b-lg">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-medium text-sm text-gray-900">{fb.title}</h4>
                              <Badge className={statusColor(fb.status)}>{statusLabel(fb.status)}</Badge>
                              <Badge variant="outline" className="text-xs">
                                {priorities.find(p => p.value === fb.priority)?.label[lang]}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{fb.description}</p>
                            {fb.admin_notes && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                <span className="font-medium text-[#183690]">
                                  {lang === 'tr' ? 'Admin yanıtı: ' : 'Admin response: '}
                                </span>
                                {fb.admin_notes}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(fb.created_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                              {fb.page_url && ` • ${fb.page_url}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
