'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { lang } = useLang();
  const [event, setEvent] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      const supabase = createClient();

      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (!eventData) { setLoading(false); return; }
      setEvent(eventData);

      // Count attendees
      const { count } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);
      setAttendeeCount(count || 0);

      // Check if current user is registered
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: reg } = await supabase
          .from('event_registrations')
          .select('id')
          .eq('event_id', id)
          .eq('profile_id', user.id)
          .single();
        if (reg) setIsRegistered(true);
      }

      setLoading(false);
    }
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert(lang === 'tr' ? 'Lütfen önce giriş yapın' : 'Please sign in first');
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('event_registrations').insert({
      event_id: id,
      profile_id: user.id,
    });

    if (error) {
      if (error.code === '23505') {
        alert(lang === 'tr' ? 'Zaten kayıtlısınız' : 'Already registered');
      } else {
        alert(error.message);
      }
    } else {
      setIsRegistered(true);
      setAttendeeCount(prev => prev + 1);
    }
    setRegistering(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-400">Loading...</div></div>;

  if (!event) {
    return (
      <main className="w-full py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{lang === 'tr' ? 'Etkinlik bulunamadı' : 'Event not found'}</h1>
        <Link href="/events"><Button variant="outline">{lang === 'tr' ? 'Geri Dön' : 'Go Back'}</Button></Link>
      </main>
    );
  }

  const title = lang === 'tr' ? event.title_tr : event.title_en;
  const description = lang === 'tr' ? event.description_tr : event.description_en;
  const dateObj = new Date(event.date);
  const isPast = dateObj < new Date();
  const isFull = event.max_attendees && attendeeCount >= event.max_attendees;

  const typeColors: Record<string, string> = {
    summit: 'bg-emerald-100 text-emerald-700',
    workshop: 'bg-purple-100 text-purple-700',
    pitstop: 'bg-blue-100 text-blue-700',
    webinar: 'bg-cyan-100 text-cyan-700',
  };

  return (
    <main className="w-full">
      {/* Hero */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft size={18} /> {lang === 'tr' ? 'Geri' : 'Back'}
          </button>
          <Badge className={`${typeColors[event.type] || 'bg-gray-100 text-gray-700'} border-0 mb-4`}>
            {event.type}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <span className="flex items-center gap-2">
              <Calendar size={18} />
              {dateObj.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={18} /> {event.time}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={18} /> {event.location}
            </span>
            <span className="flex items-center gap-2">
              <Users size={18} /> {attendeeCount}{event.max_attendees ? `/${event.max_attendees}` : ''} {lang === 'tr' ? 'katılımcı' : 'attendees'}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="prose prose-lg max-w-none">
                {description.split('\n').map((p: string, i: number) => (
                  p.trim() ? <p key={i} className="text-gray-700 leading-relaxed mb-4">{p}</p> : null
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">{lang === 'tr' ? 'Katılım' : 'Registration'}</h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>{lang === 'tr' ? 'Tarih' : 'Date'}</span>
                      <span className="font-medium">{dateObj.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'tr' ? 'Saat' : 'Time'}</span>
                      <span className="font-medium">{event.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'tr' ? 'Konum' : 'Location'}</span>
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'tr' ? 'Katılımcı' : 'Attendees'}</span>
                      <span className="font-medium">{attendeeCount}{event.max_attendees ? `/${event.max_attendees}` : ''}</span>
                    </div>
                  </div>

                  {isRegistered ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700">
                      <CheckCircle2 size={20} />
                      <span className="font-medium">{lang === 'tr' ? 'Kayıtlısınız' : 'You are registered'}</span>
                    </div>
                  ) : isPast ? (
                    <Button disabled className="w-full">
                      {lang === 'tr' ? 'Etkinlik Sona Erdi' : 'Event Ended'}
                    </Button>
                  ) : isFull ? (
                    <Button disabled className="w-full">
                      {lang === 'tr' ? 'Kontenjan Doldu' : 'Event Full'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleRegister}
                      disabled={registering}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      {registering
                        ? (lang === 'tr' ? 'Kaydediliyor...' : 'Registering...')
                        : (lang === 'tr' ? 'Kayıt Ol' : 'Register Now')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
