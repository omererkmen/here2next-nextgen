'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, MapPin, Users, Clock, CheckCircle2, Camera, ExternalLink, Rocket, X, ImageIcon, Upload } from 'lucide-react';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

      const { count } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);
      setAttendeeCount(count || 0);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: reg } = await supabase
          .from('event_registrations')
          .select('id')
          .eq('event_id', id)
          .eq('profile_id', user.id)
          .single();
        if (reg) setIsRegistered(true);

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        setIsAdmin(profile?.role === 'admin');
      }

      // Fetch photos for this event
      // Build Together event ID - photos are in root level
      const buildTogetherEventId = '50f73337-a016-4190-9a0a-6072930aefcb';
      const eventSlug = eventData.slug || (id as string);

      if (id === buildTogetherEventId) {
        // Build Together photos are in root level (uploaded from landing page)
        const { data: rootPhotos } = await supabase.storage.from('event-photos').list('', {
          sortBy: { column: 'created_at', order: 'desc' },
        });
        if (rootPhotos) {
          const urls = rootPhotos
            .filter(f => f.name !== '.emptyFolderPlaceholder' && !f.name.startsWith('.'))
            .map(f => supabase.storage.from('event-photos').getPublicUrl(f.name).data.publicUrl);
          setPhotos(urls);
        }
      } else {
        // Other events: photos in event-specific folder
        const { data: photoData } = await supabase.storage.from('event-photos').list(eventSlug, {
          sortBy: { column: 'created_at', order: 'desc' },
        });
        if (photoData && photoData.length > 0) {
          const urls = photoData
            .filter(f => f.name !== '.emptyFolderPlaceholder')
            .map(f => supabase.storage.from('event-photos').getPublicUrl(`${eventSlug}/${f.name}`).data.publicUrl);
          setPhotos(urls);
        }
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();
    const eventSlug = event?.slug || (id as string);

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const fileName = `${eventSlug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      await supabase.storage.from('event-photos').upload(fileName, file, { cacheControl: '3600', upsert: false });
    }

    // Refresh photos
    const { data: photoData } = await supabase.storage.from('event-photos').list(eventSlug, {
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (photoData) {
      const urls = photoData
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => supabase.storage.from('event-photos').getPublicUrl(`${eventSlug}/${f.name}`).data.publicUrl);
      setPhotos(urls);
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

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
    Conference: 'from-[#183690] to-[#2A5CB8]',
    Workshop: 'from-purple-600 to-purple-800',
    Networking: 'from-[#edac46] to-[#d49a3a]',
    Competition: 'from-amber-600 to-amber-800',
    Webinar: 'from-cyan-600 to-cyan-800',
    Launch: 'from-rose-600 to-rose-800',
  };

  const gradientClass = typeColors[event.type] || 'from-[#183690] to-[#102668]';

  return (
    <main className="w-full">
      {/* Hero */}
      <section className={`py-12 sm:py-20 bg-gradient-to-br ${gradientClass} text-white relative overflow-hidden`}>
        <div className="absolute top-10 right-0 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 relative z-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={18} /> {lang === 'tr' ? 'Geri' : 'Back'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">{event.type}</Badge>
            {isPast && <Badge className="bg-white/10 text-white/80 border-0">{lang === 'tr' ? 'Tamamlandı' : 'Completed'}</Badge>}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-tight">{title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-white/80">
            <span className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-sm">
              <Calendar size={16} />
              {dateObj.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {event.time && (
              <span className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-sm">
                <Clock size={16} /> {event.time}
              </span>
            )}
            <span className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-sm">
              <MapPin size={16} /> {event.location}
            </span>
            <span className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-sm">
              <Users size={16} /> {attendeeCount}{event.max_attendees ? `/${event.max_attendees}` : ''} {lang === 'tr' ? 'katılımcı' : 'attendees'}
            </span>
          </div>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="py-10 sm:py-14">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{lang === 'tr' ? 'Etkinlik Hakkında' : 'About the Event'}</h2>
                <div className="prose prose-lg max-w-none">
                  {description?.split('\n').map((p: string, i: number) => (
                    p.trim() ? <p key={i} className="text-gray-700 leading-relaxed mb-3">{p}</p> : null
                  ))}
                </div>
              </div>

              {/* Photo Gallery */}
              {(photos.length > 0 || isAdmin) && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Camera className="text-[#edac46]" size={22} />
                      <h2 className="text-xl font-bold text-gray-900">{lang === 'tr' ? 'Fotoğraf Galerisi' : 'Photo Gallery'}</h2>
                      {photos.length > 0 && (
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">{photos.length}</span>
                      )}
                    </div>
                    {isAdmin && (
                      <label className="inline-flex items-center gap-2 bg-[#edac46] text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#d49a3a] transition-colors">
                        <Upload size={14} />
                        {uploading ? '...' : lang === 'tr' ? 'Ekle' : 'Add'}
                        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
                      </label>
                    )}
                  </div>

                  {photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {photos.map((url, i) => (
                        <button key={i} onClick={() => setLightbox(url)} className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity">
                          <img src={url} alt={`${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <ImageIcon className="mx-auto mb-2 text-gray-300" size={32} />
                      <p className="text-gray-400 text-sm">{lang === 'tr' ? 'Henüz fotoğraf eklenmedi' : 'No photos yet'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">{lang === 'tr' ? (isPast ? 'Etkinlik Bilgileri' : 'Katılım') : (isPast ? 'Event Details' : 'Registration')}</h3>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>{lang === 'tr' ? 'Tarih' : 'Date'}</span>
                      <span className="font-medium text-gray-900">{dateObj.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}</span>
                    </div>
                    {event.time && (
                      <div className="flex justify-between">
                        <span>{lang === 'tr' ? 'Saat' : 'Time'}</span>
                        <span className="font-medium text-gray-900">{event.time}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>{lang === 'tr' ? 'Konum' : 'Location'}</span>
                      <span className="font-medium text-gray-900">{event.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'tr' ? 'Katılımcı' : 'Attendees'}</span>
                      <span className="font-medium text-gray-900">{attendeeCount}{event.max_attendees ? `/${event.max_attendees}` : ''}</span>
                    </div>
                  </div>

                  {isRegistered ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700">
                      <CheckCircle2 size={20} />
                      <span className="font-medium">{lang === 'tr' ? 'Kayıtlısınız' : 'Registered'}</span>
                    </div>
                  ) : isPast ? (
                    <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                      {lang === 'tr' ? 'Bu etkinlik tamamlandı' : 'This event has ended'}
                    </div>
                  ) : isFull ? (
                    <Button disabled className="w-full">{lang === 'tr' ? 'Kontenjan Doldu' : 'Event Full'}</Button>
                  ) : (
                    <Button onClick={handleRegister} disabled={registering} className="w-full bg-[#183690] hover:bg-[#102668]">
                      {registering ? '...' : (lang === 'tr' ? 'Kayıt Ol' : 'Register Now')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white" onClick={() => setLightbox(null)}>
            <X size={32} />
          </button>
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </main>
  );
}
