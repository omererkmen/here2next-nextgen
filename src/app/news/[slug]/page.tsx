'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { lang } = useLang();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      const supabase = createClient();
      const { data } = await supabase
        .from('news_articles')
        .select('*')
        .eq('slug', slug)
        .single();
      if (data) setArticle(data);
      setLoading(false);
    }
    fetchArticle();
  }, [slug]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  if (!article) {
    return (
      <main className="w-full py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{lang === 'tr' ? 'Haber bulunamadı' : 'Article not found'}</h1>
        <Link href="/news"><Button variant="outline">{lang === 'tr' ? 'Geri Dön' : 'Go Back'}</Button></Link>
      </main>
    );
  }

  const title = lang === 'tr' ? article.title_tr : article.title_en;
  const summary = lang === 'tr' ? article.summary_tr : article.summary_en;
  const content = lang === 'tr' ? article.content_tr : article.content_en;

  return (
    <main className="w-full">
      {/* Hero */}
      <section className="relative">
        {article.image_url ? (
          <img src={article.image_url} alt={title} className="w-full h-64 md:h-96 object-cover" />
        ) : (
          <div className="w-full h-64 md:h-96 bg-gradient-to-br from-[#2A5CB8] to-indigo-500" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-[900px] mx-auto w-full px-4 sm:px-6 pb-8">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-white/80 hover:text-white mb-4">
              <ArrowLeft size={18} /> {lang === 'tr' ? 'Geri' : 'Back'}
            </button>
            <Badge className="bg-white/20 text-white border-0 mb-3">{article.category}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{title}</h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <User size={14} /> {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {new Date(article.published_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          {summary && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-[#183690] pl-4">
              {summary}
            </p>
          )}
          <div className="prose prose-lg max-w-none">
            {content.split('\n').map((paragraph: string, i: number) => (
              paragraph.trim() ? <p key={i} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p> : null
            ))}
          </div>

          {/* Back to news */}
          <div className="mt-12 pt-8 border-t">
            <Link href="/news">
              <Button variant="outline" className="gap-2">
                <ArrowLeft size={16} /> {lang === 'tr' ? 'Tüm Haberlere Dön' : 'Back to All News'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
