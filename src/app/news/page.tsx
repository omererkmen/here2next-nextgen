'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function NewsPage() {
  const { t, lang } = useLang();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false });
      if (data) setArticles(data);
      setLoading(false);
    }
    fetchNews();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  const [featured, ...rest] = articles;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Latest News</h1>
          <p className="text-gray-600">Stay updated with ecosystem developments</p>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="py-8 sm:py-12">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {/* Image Placeholder */}
                  {featured.image_url ? (
                    <img src={featured.image_url} alt={featured.title_en} className="h-64 md:h-96 object-cover" />
                  ) : (
                    <div className="h-64 md:h-96 bg-gradient-to-br from-[#2A5CB8] to-blue-500" />
                  )}

                  {/* Content */}
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <Badge className="mb-4 bg-blue-100 text-[#183690] border-0">
                        {featured.category}
                      </Badge>
                      <h2 className="text-2xl sm:text-3xl font-bold mb-4">{lang === 'tr' ? featured.title_tr : featured.title_en}</h2>
                      <p className="text-gray-600 mb-6">{lang === 'tr' ? featured.summary_tr : featured.summary_en}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">{new Date(featured.published_at).toLocaleDateString()}</p>
                      <Link
                        href={`/news/${featured.slug}`}
                        className="text-[#183690] hover:text-[#183690] font-semibold flex items-center gap-2"
                      >
                        Read More <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rest.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-0">
                  {/* Image Placeholder */}
                  {article.image_url ? (
                    <img src={article.image_url} alt={article.title_en} className="h-40 object-cover" />
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-[#2A5CB8] to-blue-500" />
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <Badge className="mb-3 bg-blue-100 text-[#183690] border-0 text-xs">
                      {article.category}
                    </Badge>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{lang === 'tr' ? article.title_tr : article.title_en}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{lang === 'tr' ? article.summary_tr : article.summary_en}</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-xs text-gray-600">{new Date(article.published_at).toLocaleDateString()}</p>
                      <Link
                        href={`/news/${article.slug}`}
                        className="text-[#183690] hover:text-[#183690] text-sm font-semibold"
                      >
                        →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
