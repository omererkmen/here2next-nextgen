'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Clock, Users, X, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import AvatarPlaceholder from '@/components/shared/AvatarPlaceholder';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function WishlistPage() {
  const { t, lang } = useLang();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title_tr: '',
    title_en: '',
    description_tr: '',
    description_en: '',
    sector: '',
    tags: '',
  });
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applyingTo, setApplyingTo] = useState<any>(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [appliedItems, setAppliedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    const supabase = createClient();
    const { data } = await supabase
      .from('wishlist_with_counts')
      .select('*')
      .eq('status', 'open');
    if (data) setWishlist(data);
    setLoading(false);
  }

  const handleSubmit = async () => {
    if (!formData.title_tr && !formData.title_en) return;
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert(lang === 'tr' ? 'Lütfen önce giriş yapın' : 'Please sign in first');
        setSubmitting(false);
        return;
      }

      // Find the user's corporate profile
      const { data: corporate } = await supabase
        .from('corporates')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!corporate) {
        alert(lang === 'tr'
          ? 'İhtiyaç eklemek için kurumsal hesabınız olmalıdır'
          : 'You need a corporate account to add a need');
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from('wishlist_items').insert({
        corporate_id: corporate.id,
        title_tr: formData.title_tr,
        title_en: formData.title_en,
        description_tr: formData.description_tr,
        description_en: formData.description_en,
        sector: formData.sector,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        status: 'open',
      });

      if (error) {
        console.error('Error creating wishlist item:', error);
        alert(error.message);
      } else {
        setDialogOpen(false);
        setFormData({ title_tr: '', title_en: '', description_tr: '', description_en: '', sector: '', tags: '' });
        fetchWishlist();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApply = async () => {
    if (!applyingTo) return;
    setApplySubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert(lang === 'tr' ? 'Lütfen önce giriş yapın' : 'Please sign in first');
        setApplySubmitting(false);
        return;
      }

      // Find user's startup
      const { data: startup } = await supabase
        .from('startups')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!startup) {
        alert(lang === 'tr'
          ? 'Başvuru yapabilmek için bir startup hesabınız olmalıdır'
          : 'You need a startup account to apply');
        setApplySubmitting(false);
        return;
      }

      const { error } = await supabase.from('wishlist_applications').insert({
        wishlist_item_id: applyingTo.id,
        startup_id: startup.id,
        message: applyMessage,
        status: 'pending',
      });

      if (error) {
        if (error.code === '23505') {
          alert(lang === 'tr' ? 'Bu fırsata zaten başvurdunuz' : 'You have already applied to this opportunity');
        } else {
          alert(error.message);
        }
      } else {
        setAppliedItems(prev => new Set(prev).add(applyingTo.id));
        setApplyDialogOpen(false);
        setApplyMessage('');
        setApplyingTo(null);
        fetchWishlist();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApplySubmitting(false);
    }
  };

  const openApplyDialog = (item: any) => {
    setApplyingTo(item);
    setApplyMessage('');
    setApplyDialogOpen(true);
  };

  const filtered = wishlist.filter(
    (item) =>
      (lang === 'tr' ? item.title_tr : item.title_en)?.toLowerCase().includes(search.toLowerCase()) ||
      (item.corporate_name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('wishlist.title')}</h1>
            <p className="text-gray-600">
              {filtered.length} {lang === 'tr' ? 'açık fırsat' : 'open opportunities'}
            </p>
          </div>
          <Button
            className="bg-[#183690] hover:bg-[#102668] gap-2"
            onClick={() => setDialogOpen(true)}
          >
            <Plus size={18} /> {t('wishlist.addNew')}
          </Button>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 text-gray-600" size={18} />
              <Input
                placeholder={lang === 'tr' ? 'Başlık veya şirket ara...' : 'Search by title or company...'}
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
                    <div className="flex-1 flex gap-4 items-start min-w-0">
                      <AvatarPlaceholder name={item.corporate_name ?? 'Corporate'} size="lg" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-600 mb-1">{item.corporate_name}</p>
                        <h3 className="font-bold text-lg mb-2">{lang === 'tr' ? item.title_tr : item.title_en}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lang === 'tr' ? item.description_tr : item.description_en}</p>
                        <div className="flex flex-wrap gap-2">
                          {(item.tags ?? []).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                          <Clock size={14} /> {lang === 'tr' ? 'Son Tarih' : 'Deadline'}
                        </div>
                        <p className="font-semibold">{item.deadline ? new Date(item.deadline).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                          <Users size={14} /> {lang === 'tr' ? 'Başvuranlar' : 'Applicants'}
                        </div>
                        <p className="font-semibold">{item.application_count || 0}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <Badge className="bg-blue-100 text-[#183690] border-0">
                        {lang === 'tr' ? (item.status === 'open' ? 'Açık' : item.status) : item.status}
                      </Badge>
                      {appliedItems.has(item.id) ? (
                        <Button disabled className="bg-gray-100 text-[#183690] border border-blue-200 gap-2">
                          <CheckCircle size={16} /> {lang === 'tr' ? 'Başvuruldu' : 'Applied'}
                        </Button>
                      ) : (
                        <Button className="bg-[#183690] hover:bg-[#102668] gap-2" onClick={() => openApplyDialog(item)}>
                          <Send size={16} /> {t('wishlist.apply')}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {lang === 'tr' ? 'Fırsat bulunamadı' : 'No opportunities found'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Add New Need Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('wishlist.addNew')}</DialogTitle>
            <DialogDescription>
              {lang === 'tr'
                ? 'Yeni bir ihtiyaç ekleyerek startup\'lardan çözüm alın.'
                : 'Add a new need to get solutions from startups.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'tr' ? 'Başlık (TR)' : 'Title (TR)'}
              </label>
              <Input
                value={formData.title_tr}
                onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                placeholder={lang === 'tr' ? 'İhtiyacınızın başlığı (Türkçe)' : 'Need title (Turkish)'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'tr' ? 'Başlık (EN)' : 'Title (EN)'}
              </label>
              <Input
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder={lang === 'tr' ? 'İhtiyacınızın başlığı (İngilizce)' : 'Need title (English)'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'tr' ? 'Açıklama (TR)' : 'Description (TR)'}
              </label>
              <Textarea
                value={formData.description_tr}
                onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                placeholder={lang === 'tr' ? 'Detaylı açıklama (Türkçe)' : 'Detailed description (Turkish)'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'tr' ? 'Açıklama (EN)' : 'Description (EN)'}
              </label>
              <Textarea
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                placeholder={lang === 'tr' ? 'Detaylı açıklama (İngilizce)' : 'Detailed description (English)'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'tr' ? 'Sektör' : 'Sector'}
              </label>
              <Input
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                placeholder={lang === 'tr' ? 'Örn: Teknoloji, Finans, Enerji' : 'e.g. Technology, Finance, Energy'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'tr' ? 'Etiketler (virgülle ayırın)' : 'Tags (comma separated)'}
              </label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="AI, IoT, FinTech"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              className="bg-[#183690] hover:bg-[#102668]"
              onClick={handleSubmit}
              disabled={submitting || (!formData.title_tr && !formData.title_en)}
            >
              {submitting
                ? (lang === 'tr' ? 'Kaydediliyor...' : 'Saving...')
                : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="rounded-lg">
          <DialogHeader>
            <DialogTitle>{lang === 'tr' ? 'Başvuru Yap' : 'Apply'}</DialogTitle>
            <DialogDescription>
              {applyingTo && (
                <>
                  <span className="font-medium text-slate-800">
                    {lang === 'tr' ? applyingTo.title_tr : applyingTo.title_en}
                  </span>
                  {' — '}
                  {applyingTo.corporate_name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'tr' ? 'Mesajınız' : 'Your message'}
              </label>
              <Textarea
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder={lang === 'tr'
                  ? 'Bu ihtiyacı nasıl çözebileceğinizi açıklayın...'
                  : 'Explain how you can solve this need...'}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              className="bg-[#183690] hover:bg-[#102668] gap-2"
              onClick={handleApply}
              disabled={applySubmitting}
            >
              {applySubmitting
                ? (lang === 'tr' ? 'Gönderiliyor...' : 'Sending...')
                : (
                  <><Send size={16} /> {lang === 'tr' ? 'Başvuru Gönder' : 'Send Application'}</>
                )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
