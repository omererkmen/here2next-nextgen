'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activityLog';

export default function LoginPage() {
  const { t } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        await logActivity('login_failed', { reason: signInError.message }, email);
        if (signInError.message === 'Invalid login credentials') {
          setError(t('auth.login.errorInvalid'));
        } else if (signInError.message.includes('Email not confirmed')) {
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
          return;
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      await logActivity('login_success', {}, email);
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">{t('auth.login.title')}</h1>
              <p className="text-gray-600">{t('auth.login.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('auth.login.email')}
                </label>
                <Input
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                  required
                />
              </div>

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#1B3A7B] hover:text-[#122858] font-medium"
                >
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B3A7B] hover:bg-[#122858]"
              >
                {loading ? t('auth.login.loading') : t('auth.login.submit')}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-600">
                {t('auth.login.noAccount')}{' '}
                <Link href="/register" className="text-[#1B3A7B] hover:text-[#122858] font-semibold">
                  {t('auth.register.title')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
