'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Rocket, Building2, Clock, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function AdminApprovalsPage() {
  const { lang } = useLang();
  const [pendingStartups, setPendingStartups] = useState<any[]>([]);
  const [pendingCorporates, setPendingCorporates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPending = async () => {
    const supabase = createClient();

    const [startupsRes, corporatesRes] = await Promise.all([
      supabase.from('startups').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('corporates').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
    ]);

    setPendingStartups(startupsRes.data || []);
    setPendingCorporates(corporatesRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPending(); }, []);

  const handleAction = async (type: 'startups' | 'corporates', id: string, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    const supabase = createClient();

    const { error } = await supabase
      .from(type)
      .update({ status })
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      // Remove from list
      if (type === 'startups') {
        setPendingStartups(prev => prev.filter(s => s.id !== id));
      } else {
        setPendingCorporates(prev => prev.filter(c => c.id !== id));
      }
    }
    setActionLoading(null);
  };

  const totalPending = pendingStartups.length + pendingCorporates.length;

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {lang === 'tr' ? 'Onay Bekleyenler' : 'Pending Approvals'}
            </h1>
            {totalPending > 0 && (
              <Badge className="bg-white text-orange-700 text-sm">{totalPending}</Badge>
            )}
          </div>
          <p className="text-orange-100 ml-12">
            {lang === 'tr' ? 'Yeni kayıtları inceleyin ve onaylayın' : 'Review and approve new registrations'}
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {totalPending === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <CheckCircle className="mx-auto mb-4 text-emerald-400" size={48} />
                <p className="text-lg font-medium">
                  {lang === 'tr' ? 'Onay bekleyen kayıt yok' : 'No pending approvals'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Pending Startups */}
              {pendingStartups.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Rocket className="text-emerald-600" size={20} />
                    {lang === 'tr' ? 'Startup Başvuruları' : 'Startup Applications'}
                    <Badge variant="secondary">{pendingStartups.length}</Badge>
                  </h2>
                  <div className="space-y-3">
                    {pendingStartups.map((startup) => (
                      <Card key={startup.id}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <h3 className="font-bold text-lg">{startup.name}</h3>
                                <Badge variant="secondary">{startup.sector}</Badge>
                                <Badge className="bg-amber-100 text-amber-700 border-0">{startup.stage?.replace('_', ' ')}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {lang === 'tr' ? startup.description_tr : startup.description_en || startup.description_tr || '-'}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                {startup.location && (
                                  <span className="flex items-center gap-1"><MapPin size={12} />{startup.location}</span>
                                )}
                                {startup.website && (
                                  <span className="flex items-center gap-1"><Globe size={12} />{startup.website}</span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {new Date(startup.created_at).toLocaleDateString('tr-TR')}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                disabled={actionLoading === startup.id}
                                onClick={() => handleAction('startups', startup.id, 'approved')}
                              >
                                <CheckCircle size={14} className="mr-1" />
                                {lang === 'tr' ? 'Onayla' : 'Approve'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                disabled={actionLoading === startup.id}
                                onClick={() => handleAction('startups', startup.id, 'rejected')}
                              >
                                <XCircle size={14} className="mr-1" />
                                {lang === 'tr' ? 'Reddet' : 'Reject'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Corporates */}
              {pendingCorporates.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Building2 className="text-blue-600" size={20} />
                    {lang === 'tr' ? 'Kurum Başvuruları' : 'Corporate Applications'}
                    <Badge variant="secondary">{pendingCorporates.length}</Badge>
                  </h2>
                  <div className="space-y-3">
                    {pendingCorporates.map((corp) => (
                      <Card key={corp.id}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <h3 className="font-bold text-lg">{corp.name}</h3>
                                <Badge variant="secondary">{corp.sector}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {lang === 'tr' ? corp.description_tr : corp.description_en || corp.description_tr || '-'}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                {corp.location && (
                                  <span className="flex items-center gap-1"><MapPin size={12} />{corp.location}</span>
                                )}
                                {corp.website && (
                                  <span className="flex items-center gap-1"><Globe size={12} />{corp.website}</span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {new Date(corp.created_at).toLocaleDateString('tr-TR')}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                disabled={actionLoading === corp.id}
                                onClick={() => handleAction('corporates', corp.id, 'approved')}
                              >
                                <CheckCircle size={14} className="mr-1" />
                                {lang === 'tr' ? 'Onayla' : 'Approve'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                disabled={actionLoading === corp.id}
                                onClick={() => handleAction('corporates', corp.id, 'rejected')}
                              >
                                <XCircle size={14} className="mr-1" />
                                {lang === 'tr' ? 'Reddet' : 'Reject'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
