'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, LogIn, LogOut, UserPlus, AlertTriangle, Eye, User, Zap, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

const ACTION_CONFIG: Record<string, { label: { tr: string; en: string }; icon: any; color: string; bg: string }> = {
  login_success: { label: { tr: 'Giriş Başarılı', en: 'Login Success' }, icon: LogIn, color: 'text-green-700', bg: 'bg-green-100' },
  login_failed: { label: { tr: 'Giriş Başarısız', en: 'Login Failed' }, icon: AlertTriangle, color: 'text-red-700', bg: 'bg-red-100' },
  signup: { label: { tr: 'Kayıt', en: 'Signup' }, icon: UserPlus, color: 'text-blue-700', bg: 'bg-blue-100' },
  logout: { label: { tr: 'Çıkış', en: 'Logout' }, icon: LogOut, color: 'text-gray-700', bg: 'bg-gray-100' },
  page_view: { label: { tr: 'Sayfa Görüntüleme', en: 'Page View' }, icon: Eye, color: 'text-cyan-700', bg: 'bg-cyan-100' },
  profile_update: { label: { tr: 'Profil Güncelleme', en: 'Profile Update' }, icon: User, color: 'text-purple-700', bg: 'bg-purple-100' },
  password_reset_request: { label: { tr: 'Şifre Sıfırlama', en: 'Password Reset' }, icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-100' },
  match_request: { label: { tr: 'Eşleşme Talebi', en: 'Match Request' }, icon: Zap, color: 'text-emerald-700', bg: 'bg-emerald-100' },
  wishlist_apply: { label: { tr: 'İhtiyaç Başvurusu', en: 'Wishlist Apply' }, icon: FileText, color: 'text-indigo-700', bg: 'bg-indigo-100' },
  event_register: { label: { tr: 'Etkinlik Kaydı', en: 'Event Register' }, icon: Calendar, color: 'text-teal-700', bg: 'bg-teal-100' },
  role_change: { label: { tr: 'Rol Değişikliği', en: 'Role Change' }, icon: User, color: 'text-orange-700', bg: 'bg-orange-100' },
  error: { label: { tr: 'Hata', en: 'Error' }, icon: AlertTriangle, color: 'text-red-700', bg: 'bg-red-100' },
};

export default function AdminLogsPage() {
  const { lang } = useLang();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    const supabase = createClient();
    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (filter !== 'all') {
      query = query.eq('action', filter);
    }

    const { data } = await query;
    setLogs(data || []);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchLogs();
  }, [filter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return lang === 'tr' ? 'Az önce' : 'Just now';
    if (diffMin < 60) return `${diffMin} ${lang === 'tr' ? 'dk önce' : 'min ago'}`;
    if (diffHr < 24) return `${diffHr} ${lang === 'tr' ? 'saat önce' : 'hr ago'}`;
    if (diffDay < 7) return `${diffDay} ${lang === 'tr' ? 'gün önce' : 'days ago'}`;
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filterOptions = [
    { value: 'all', label: { tr: 'Tümü', en: 'All' } },
    { value: 'login_success', label: { tr: 'Giriş', en: 'Login' } },
    { value: 'login_failed', label: { tr: 'Başarısız Giriş', en: 'Failed Login' } },
    { value: 'signup', label: { tr: 'Kayıt', en: 'Signup' } },
    { value: 'logout', label: { tr: 'Çıkış', en: 'Logout' } },
    { value: 'error', label: { tr: 'Hata', en: 'Error' } },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {lang === 'tr' ? 'Aktivite Logları' : 'Activity Logs'}
            </h1>
          </div>
          <p className="text-slate-300 ml-12">
            {lang === 'tr' ? 'Kullanıcı aktivitelerini takip edin' : 'Track user activities'}
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters & Refresh */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {filterOptions.map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                variant={filter === opt.value ? 'default' : 'outline'}
                className={filter === opt.value ? 'bg-slate-800 hover:bg-slate-700' : ''}
                onClick={() => setFilter(opt.value)}
              >
                {opt.label[lang]}
              </Button>
            ))}
            <div className="ml-auto">
              <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw size={14} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                {lang === 'tr' ? 'Yenile' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Log count */}
          <p className="text-sm text-gray-500 mb-4">
            {logs.length} {lang === 'tr' ? 'kayıt gösteriliyor' : 'entries shown'}
          </p>

          {/* Logs */}
          {logs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                {lang === 'tr' ? 'Henüz log kaydı yok' : 'No log entries yet'}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => {
                const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.error;
                const Icon = config.icon;
                return (
                  <Card key={log.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`${config.bg} w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Icon className={config.color} size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`${config.bg} ${config.color} border-0 text-xs`}>
                            {config.label[lang]}
                          </Badge>
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {log.email || (lang === 'tr' ? 'Anonim' : 'Anonymous')}
                          </span>
                        </div>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {log.details.reason || log.details.role || log.details.page || JSON.stringify(log.details)}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatTime(log.created_at)}
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
