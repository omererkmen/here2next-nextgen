'use client';

import { useState, useEffect } from 'react';
import { Zap, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AvatarPlaceholder from '@/components/shared/AvatarPlaceholder';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function MatchingPage() {
  const { t, lang } = useLang();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('matches_full')
        .select('*')
        .order('score', { ascending: false });
      if (data) setMatches(data);
      setLoading(false);
    }
    fetchMatches();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  return (
    <main className="w-full">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={28} />
            <h1 className="text-3xl sm:text-4xl font-bold">AI-Powered Matching Results</h1>
          </div>
          <p className="text-emerald-50 max-w-2xl">
            We've identified {matches.length} high-potential partnerships based on your profile and needs.
          </p>
        </div>
      </section>

      {/* Matches List */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {matches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    {/* Left: Startup */}
                    <div className="flex gap-4 items-center justify-center lg:justify-start">
                      <AvatarPlaceholder name={match.startup_name} size="lg" />
                      <div className="text-center lg:text-left">
                        <h3 className="font-bold text-lg">{match.startup_name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {match.startup_sector}
                        </Badge>
                      </div>
                    </div>

                    {/* Center: Score */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-600 mb-2">{match.score}%</div>
                        <p className="text-sm text-gray-600 mb-3">Match Score</p>
                        <Progress value={match.score} className="w-full" />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold">
                        <CheckCircle size={16} /> Great match
                      </div>
                    </div>

                    {/* Right: Corporate */}
                    <div className="flex gap-4 items-center justify-center lg:justify-end">
                      <div className="text-center lg:text-right">
                        <h3 className="font-bold text-lg">{match.corporate_name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {match.corporate_sector}
                        </Badge>
                      </div>
                      <AvatarPlaceholder name={match.corporate_name} size="lg" />
                    </div>
                  </div>

                  {/* Reasons */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp size={18} /> Why This Match
                    </h4>
                    <ul className="space-y-2">
                      {(lang === 'tr' ? match.reasons_tr : match.reasons_en ?? []).map((reason: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                          <span className="text-emerald-600 font-bold mt-0.5">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex gap-3">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">Connect</Button>
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Explanation */}
      <section className="py-8 sm:py-12 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold text-lg mb-4">How Our AI Matching Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Sector Analysis</h3>
                  <p className="text-sm text-gray-600">
                    We analyze industry focus, market positioning, and technology stacks to identify complementary opportunities.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Team & Growth Stage</h3>
                  <p className="text-sm text-gray-600">
                    Matching considers team expertise, funding stage, and growth trajectory for sustainable partnerships.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Strategic Fit</h3>
                  <p className="text-sm text-gray-600">
                    We evaluate long-term strategic alignment and mutual benefit potential for each partnership.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
