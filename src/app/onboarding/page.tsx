'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Building2, Globe, MapPin, Users, DollarSign, Tag, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { sectors, fundingStatuses } from '@/lib/constants';
import { logActivity } from '@/lib/activityLog';

export default function OnboardingPage() {
  const { lang } = useLang();
  const router = useRouter();
  const [role, setRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Common fields
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [descriptionTr, setDescriptionTr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [location, setLocation] = useState('İstanbul');
  const [website, setWebsite] = useState('');

  // Startup-specific fields
  const [stage, setStage] = useState('seed');
  const [foundedYear, setFoundedYear] = useState(new Date().getFullYear().toString());
  const [teamSize, setTeamSize] = useState('5');
  const [fundingStatus, setFundingStatus] = useState('no_funding');
  const [funding, setFunding] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile) { router.push('/login'); return; }
      setRole(profile.role);

      // Investors don't need onboarding — send them straight to dashboard
      if (profile.role === 'investor') {
        router.push('/dashboard');
        return;
      }

      // Check if already has a company profile
      if (profile.role === 'startup') {
        const { data: existing } = await supabase
          .from('startups')
          .select('id')
          .eq('profile_id', user.id)
          .single();
        if (existing) { router.push('/dashboard'); return; }
      } else if (profile.role === 'corporate') {
        const { data: existing } = await supabase
          .from('corporates')
          .select('id')
          .eq('profile_id', user.id)
          .single();
        if (existing) { router.push('/dashboard'); return; }
      }

      setLoading(false);
    }
    checkUser();
  }, [router]);

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = lang === 'tr' ? 'Bu alan zorunludur' : 'This field is required';
    if (!sector) newErrors.sector = lang === 'tr' ? 'Sektör seçimi zorunludur' : 'Sector is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!name || !sector) {
      setErrors({ name: !name ? 'Zorunlu' : '', sector: !sector ? 'Zorunlu' : '' });
      return;
    }
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const slug = generateSlug(name);

      if (role === 'startup') {
        const { error } = await supabase.from('startups').insert({
          profile_id: user.id,
          name,
          slug,
          sector,
          stage,
          description_tr: descriptionTr,
          description_en: descriptionEn,
          founded_year: parseInt(foundedYear),
          team_size: parseInt(teamSize),
          funding_status: fundingStatus,
          funding: fundingStatus === 'funded' ? funding : '',
          location,
          website,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          status: 'pending',
          featured: false,
        });
        if (error) {
          alert(error.message);
          setSubmitting(false);
          return;
        }
      } else if (role === 'corporate') {
        const { error } = await supabase.from('corporates').insert({
          profile_id: user.id,
          name,
          slug,
          sector,
          description_tr: descriptionTr,
          description_en: descriptionEn,
          location,
          website,
          status: 'pending',
          is_founder: false,
        });
        if (error) {
          alert(error.message);
          setSubmitting(false);
          return;
        }
      }

      await logActivity('signup', { onboarding_completed: true, role, company: name, sector, status: 'pending' });
      setSubmitted(true);
    } catch (err) {
      alert('Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  const isStartup = role === 'startup';

  if (submitted) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-emerald-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-3">
              {lang === 'tr' ? 'Başvurunuz Alındı!' : 'Application Received!'}
            </h1>
            <p className="text-gray-600 mb-6">
              {lang === 'tr'
                ? 'Profiliniz inceleme için gönderildi. Admin onayından sonra platformda yayınlanacaktır.'
                : 'Your profile has been submitted for review. It will be published on the platform after admin approval.'}
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push('/')}>
              {lang === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
            {isStartup ? <Rocket className="text-emerald-600" size={32} /> : <Building2 className="text-emerald-600" size={32} />}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {lang === 'tr'
              ? (isStartup ? 'Startup Profilinizi Oluşturun' : 'Kurum Profilinizi Oluşturun')
              : (isStartup ? 'Create Your Startup Profile' : 'Create Your Corporate Profile')}
          </h1>
          <p className="text-gray-600">
            {lang === 'tr'
              ? 'Platformda görünür olmak ve eşleşme almak için profilinizi tamamlayın'
              : 'Complete your profile to be visible on the platform and receive matches'}
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${s <= step ? 'bg-emerald-500 w-16' : 'bg-gray-200 w-8'}`}
            />
          ))}
        </div>

        {/* Skip button */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-500 hover:text-emerald-600 underline underline-offset-2 transition-colors"
          >
            {lang === 'tr' ? 'Daha sonra tamamla, atla →' : 'Complete later, skip →'}
          </button>
        </div>

        <Card>
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold mb-4">
                  {lang === 'tr' ? 'Temel Bilgiler' : 'Basic Information'}
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    {lang === 'tr' ? (isStartup ? 'Startup Adı' : 'Kurum Adı') : (isStartup ? 'Startup Name' : 'Company Name')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }}
                    placeholder={isStartup ? 'PayFlex' : 'Koç Holding'}
                    className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    {lang === 'tr' ? 'Sektör' : 'Sector'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Select value={sector} onValueChange={(v) => { setSector(v); if (errors.sector) setErrors(prev => ({ ...prev, sector: '' })); }}>
                    <SelectTrigger className={errors.sector ? 'border-red-500 focus:ring-red-500' : ''}><SelectValue placeholder={lang === 'tr' ? 'Sektör seçin' : 'Select sector'} /></SelectTrigger>
                    <SelectContent>
                      {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.sector && <p className="text-red-500 text-sm mt-1">{errors.sector}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    <MapPin size={14} className="inline mr-1" />
                    {lang === 'tr' ? 'Konum' : 'Location'}
                  </label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    <Globe size={14} className="inline mr-1" />
                    Website
                  </label>
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="www.example.com" />
                </div>

                {isStartup && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">
                          {lang === 'tr' ? 'Aşama *' : 'Stage *'}
                        </label>
                        <Select value={stage} onValueChange={setStage}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pre_seed">Pre-Seed</SelectItem>
                            <SelectItem value="seed">Seed</SelectItem>
                            <SelectItem value="series_a">Series A</SelectItem>
                            <SelectItem value="series_b">Series B</SelectItem>
                            <SelectItem value="series_c_plus">Series C+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">
                          {lang === 'tr' ? 'Kuruluş Yılı' : 'Founded Year'}
                        </label>
                        <Input type="number" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">
                          <Users size={14} className="inline mr-1" />
                          {lang === 'tr' ? 'Ekip Büyüklüğü' : 'Team Size'}
                        </label>
                        <Input type="number" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">
                          <DollarSign size={14} className="inline mr-1" />
                          {lang === 'tr' ? 'Yatırım Durumu' : 'Funding Status'}
                        </label>
                        <Select value={fundingStatus} onValueChange={setFundingStatus}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {fundingStatuses.map(fs => (
                              <SelectItem key={fs.value} value={fs.value}>
                                {lang === 'tr' ? fs.label.tr : fs.label.en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fundingStatus === 'funded' && (
                          <Input className="mt-2" value={funding} onChange={(e) => setFunding(e.target.value)} placeholder={lang === 'tr' ? 'Toplam yatırım miktarı (ör: $500K)' : 'Total funding amount (e.g. $500K)'} />
                        )}
                      </div>
                    </div>
                  </>
                )}

                <Button onClick={handleStep1Next} className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2">
                  {lang === 'tr' ? 'Devam Et' : 'Continue'}
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold mb-4">
                  {lang === 'tr' ? 'Detaylı Bilgiler' : 'Detailed Information'}
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    <FileText size={14} className="inline mr-1" />
                    {lang === 'tr' ? 'Açıklama (Türkçe)' : 'Description (Turkish)'}
                  </label>
                  <Textarea
                    value={descriptionTr}
                    onChange={(e) => setDescriptionTr(e.target.value)}
                    rows={4}
                    placeholder={lang === 'tr' ? 'Şirketinizi kısaca tanıtın...' : 'Briefly describe your company...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    <FileText size={14} className="inline mr-1" />
                    {lang === 'tr' ? 'Açıklama (İngilizce)' : 'Description (English)'}
                  </label>
                  <Textarea
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    rows={4}
                    placeholder="Briefly describe your company..."
                  />
                </div>

                {isStartup && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">
                      <Tag size={14} className="inline mr-1" />
                      {lang === 'tr' ? 'Etiketler (virgülle ayırın)' : 'Tags (comma separated)'}
                    </label>
                    <Input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="AI, Machine Learning, B2B"
                    />
                    {tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.split(',').map(t => t.trim()).filter(Boolean).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    {lang === 'tr' ? 'Geri' : 'Back'}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {submitting
                      ? (lang === 'tr' ? 'Kaydediliyor...' : 'Saving...')
                      : (lang === 'tr' ? 'Profili Oluştur' : 'Create Profile')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
