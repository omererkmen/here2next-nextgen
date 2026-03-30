'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { User, Mail, Shield, Save, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import Link from 'next/link';

type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
};

export default function ProfilePage() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        setError(lang === 'tr' ? 'Profil yüklenemedi' : 'Could not load profile');
        setLoading(false);
        return;
      }

      setProfile(data);
      setFullName(data.full_name);
      setRole(data.role);
      setLoading(false);
    };

    fetchProfile();
  }, [router, lang]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();

      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (profileError) {
        setError(profileError.message);
        setSaving(false);
        return;
      }

      // Also update auth user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          role,
        },
      });

      setSuccess(t('profile.saved'));
      setProfile({ ...profile, full_name: fullName, role });
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError(lang === 'tr' ? 'Bir hata oluştu' : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-gray-500">{lang === 'tr' ? 'Yükleniyor...' : 'Loading...'}</div>
      </main>
    );
  }

  const roleLabels: Record<string, { tr: string; en: string }> = {
    startup: { tr: 'Startup Kurucu', en: 'Startup Founder' },
    corporate: { tr: 'Kurumsal Yönetici', en: 'Corporate Executive' },
    investor: { tr: 'Yatırımcı', en: 'Investor' },
    admin: { tr: 'Admin', en: 'Admin' },
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {t('profile.title')}
        </h1>

        <Card>
          <CardContent className="p-6 space-y-5">
            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#1B3A7B] px-4 py-3 rounded text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Email (read-only) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                <Mail className="w-4 h-4 text-gray-500" />
                {t('profile.email')}
              </label>
              <Input
                type="email"
                value={profile?.email || ''}
                disabled
                className="bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">{t('profile.emailReadonly')}</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                {t('profile.name')}
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={lang === 'tr' ? 'Adınız Soyadınız' : 'Your Full Name'}
              />
            </div>

            {/* Role */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                <Shield className="w-4 h-4 text-gray-500" />
                {t('profile.role')}
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder={lang === 'tr' ? 'Rol seçin' : 'Select role'} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([value, labels]) => (
                    <SelectItem key={value} value={value}>
                      {lang === 'tr' ? labels.tr : labels.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-amber-600 mt-1">{t('profile.roleWarning')}</p>
            </div>

            {/* Member Since */}
            <div className="text-sm text-gray-500 pt-2 border-t">
              {t('profile.memberSince')}: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#1B3A7B] hover:bg-[#122858] gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? t('profile.saving') : t('profile.save')}
              </Button>

              <Link href="/auth/forgot-password">
                <Button variant="outline" className="w-full gap-2">
                  <KeyRound className="w-4 h-4" />
                  {t('profile.changePassword')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
