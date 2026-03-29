'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activityLog';

type UserRole = 'startup' | 'corporate' | 'investor' | '';

export default function RegisterPage() {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'startup' || roleParam === 'corporate' || roleParam === 'investor') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword || !role) {
      setError(t('auth.register.errorAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.register.errorPasswordMatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('auth.register.errorPasswordLength'));
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });

      if (signUpError) {
        await logActivity('signup', { success: false, reason: signUpError.message, role }, email);
        if (signUpError.message.includes('already registered')) {
          setError('Bu e-posta adresi zaten kayıtlı');
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        await logActivity('signup', { success: true, role, full_name: fullName }, email);
        // Redirect to verify-email page — user must confirm their email
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">{t('auth.register.title')}</h1>
              <p className="text-gray-600">{t('auth.register.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('auth.register.name')}
                </label>
                <Input
                  type="text"
                  placeholder={t('auth.register.namePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('auth.login.email')}
                </label>
                <Input
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('auth.register.role')}
                </label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('auth.register.rolePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">{t('auth.register.roleStartup')}</SelectItem>
                    <SelectItem value="corporate">{t('auth.register.roleCorporate')}</SelectItem>
                    <SelectItem value="investor">{t('auth.register.roleInvestor')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('auth.login.password')}
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('auth.register.confirmPassword')}
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? t('auth.register.loading') : t('auth.register.submit')}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-600">
                {t('auth.register.hasAccount')}{' '}
                <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  {t('auth.login.title')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
