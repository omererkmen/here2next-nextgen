'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

const eventTypeColors: Record<string, { bg: string; text: string }> = {
  Conference: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Workshop: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Networking: { bg: 'bg-green-100', text: 'text-green-700' },
  Competition: { bg: 'bg-amber-100', text: 'text-amber-700' },
  Webinar: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  Launch: { bg: 'bg-rose-100', text: 'text-rose-700' },
};

export default function EventsPage() {
  const { t, lang } = useLang();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    async function fetchEvents() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('events_with_counts')
        .select('*')
        .order('date', { ascending: false });
      if (data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today);

  const EventCard = ({ event }: { event: any }) => {
    const dateObj = new Date(event.date);
    const colorScheme = eventTypeColors[event.type] || { bg: "bg-slate-50", text: "text-slate-700" };

    return (
      <Card className="hover:shadow-lg transition-shadow overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-0 md:gap-6 p-6">
            {/* Date Block */}
            <div className="flex-shrink-0 md:w-24 text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                </p>
                <p className="text-2xl font-bold text-emerald-700">
                  {dateObj.getDate()}
                </p>
                <p className="text-xs text-gray-500">
                  {dateObj.getFullYear()}
                </p>
              </div>
              <Badge
                className={`mt-3 w-full justify-center ${colorScheme.bg} ${colorScheme.text} border-0`}
              >
                {event.type}
              </Badge>
            </div>

            {/* Event Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-2">{lang === 'tr' ? event.title_tr : event.title_en}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lang === 'tr' ? event.description_tr : event.description_en}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  {event.time || 'Time TBA'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={14} />
                  {event.attendee_count} registered
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0 flex items-center">
              <Button className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto">
                {dateObj >= new Date() ? 'Register' : 'View Details'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-400">Loading...</div></div>;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Events & Conferences</h1>
          <p className="text-gray-600">Connect with the startup and corporate community</p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-xs grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">
                Upcoming ({upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({past.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
