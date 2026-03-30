'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { Mail, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

function VerifyEmailContent() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const hasError = searchParams.get('error') === 'true';
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResendError('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });
      if (error) {
        setResendError(error.message);
      } else {
        setResent(true);
      }
    } catch {
      setResendError(t('auth.verify.resendError'));
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-8">
            {hasError ? (
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-gray-900">
                  {t('auth.verify.errorTitle')}
                </h1>
                <p className="text-gray-600 mb-6">
                  {t('auth.verify.errorDescription')}
                </p>
                <Link href="/register">
                  <Button className="w-full bg-[#1B3A7B] hover:bg-[#122858]">
                    {t('auth.verify.tryAgain')}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8 text-[#1B3A7B]" />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-gray-900">
                  {t('auth.verify.title')}
                </h1>
                <p className="text-gray-600 mb-2">
                  {t('auth.verify.description')}
                </p>
                {email && (
                  <p className="text-[#1B3A7B] font-semibold mb-6">{email}</p>
                )}
                {!email && <div className="mb-6" />}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#1B3A7B] mt-0.5 shrink-0" />
                    <div className="text-sm text-[#122858]">
                      <p className="font-medium mb-1">{t('auth.verify.steps')}</p>
                      <ol className="list-decimal list-inside space-y-1 text-[#1B3A7B]">
                        <li>{t('auth.verify.step1')}</li>
                        <li>{t('auth.verify.step2')}</li>
                        <li>{t('auth.verify.step3')}</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {email && (
                  <div className="mb-4">
                    {resent ? (
                      <p className="text-sm text-[#1B3A7B] font-medium">
                        {t('auth.verify.resent')}
                      </p>
                    ) : (
                      <button
                        onClick={handleResend}
                        disabled={resending}
                        className="text-sm text-[#1B3A7B] hover:text-[#1B3A7B] font-medium inline-flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                        {resending ? t('auth.verify.resending') : t('auth.verify.resendButton')}
                      </button>
                    )}
                    {resendError && (
                      <p className="text-sm text-red-600 mt-1">{resendError}</p>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-3">{t('auth.verify.checkSpam')}</p>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      {t('auth.verify.backToLogin')}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-gray-500">Yükleniyor...</div>
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
