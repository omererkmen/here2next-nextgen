'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, HeartHandshake, MessageSquare, Users, TrendingUp, AlertTriangle, ExternalLink } from 'lucide-react';

const euStats = [
  { num: '%80', label: 'Kurum, açık inovasyonu önemli ya da kritik görüyor (2023\'te %67)' },
  { num: '%72', label: '5.000+ çalışanlı kurum, girişimlerle yapay zeka projesinde çalıştı' },
  { num: '%70', label: 'Yapay zeka iş birliği yapan kurum, girişimleri AI stratejisi için "hayati" görüyor' },
];

const trStats = [
  { num: '622M$', label: '2025 toplam girişim yatırımı — mega tur olmadan korunan hacim' },
  { num: '92', label: 'Türkiye\'de aktif kurumsal girişim sermayesi (CVC) şirketi sayısı' },
  { num: 'AI', label: '2025\'te hem yatırım tutarı hem işlem sayısında öne çıkan alan' },
];

const pillars = [
  {
    tag: 'Destek',
    icon: HeartHandshake,
    color: 'text-[#5093b6]',
    bar: 'border-[#5093b6]',
    badge: 'bg-[#5093b6]',
    title: 'Sermayeden erişime',
    body: 'Yapay zeka, ürün geliştirmenin maliyetini düşürüyor; daha çok erken aşama girişim, daha hızlı ortaya çıkıyor. Darboğaz artık "yapabilirler mi" değil, "kurum onu eskimeden entegre edebilir mi" sorusu. Kuluçka ve hızlandırmanın değeri; veriye, dağıtım kanalına, hesaplama gücüne ve regüle ortamlara erişim sağlamaya kayıyor.',
  },
  {
    tag: 'İletişim',
    icon: MessageSquare,
    color: 'text-[#8cb45b]',
    bar: 'border-[#8cb45b]',
    badge: 'bg-[#8cb45b]',
    title: 'Hız artık nezaket değil, fark yaratan unsur',
    body: 'Yapay zekanın temposu yavaş kurumsal yanıt sürelerini ölümcül kılıyor — satın alma sürecinde altı ay bekleyen bir girişim çoktan pivot etmiş ya da kapanmış olabilir. "En hızlı sürede geri dönüş" sözümüz artık bir kibarlık değil, gerçek bir rekabet avantajı. Bu çağda olgunluk demek, karar hızı demek.',
  },
  {
    tag: 'Kültür',
    icon: Users,
    color: 'text-[#c848aa]',
    bar: 'border-[#c848aa]',
    badge: 'bg-[#c848aa]',
    title: 'Dönüşüm seçenek değil, zorunluluk',
    body: 'En büyük değişim burada. Yapay zeka her fonksiyonda dönüşüm programlarını zorunlu kılıyor — ki bu, Here2Next\'in zaten savunduğu iç hazırlık çalışmasının ta kendisi. Manifestodaki "olgunluğu ölçme" fikri bu ana mükemmel oturuyor: kurumlar girişimlerle çalışabilme kaslarını ölçüp güçlendirmeden, yapay zeka fırsatını yakalayamaz.',
  },
];

export default function AiEraPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Image src="/logo.png" alt="Here2Next" width={130} height={40} className="h-8 w-auto" />
          <Link
            href="/home"
            className="inline-flex items-center gap-2 bg-[#183690] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#102668] transition-colors"
          >
            Platforma Git
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 bg-gradient-to-br from-[#0C1D4A] via-[#183690] to-[#2A5CB8] text-white relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[#edac46]/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-[#c848aa]/10 blur-2xl" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
              <Sparkles size={14} className="text-[#edac46]" />
              <span>Manifesto Eki · 2026</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
              Yapay Zeka Çağında
              <span className="text-[#edac46]"> Here2Next</span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
              Kurum–girişim iş birliği artık bir olgunluk tercihi değil, rekabetin kendisi. Yapay zeka, manifestomuzun her sözünü daha acil hale getiriyor.
            </p>
          </div>
        </div>
      </section>

      {/* Lead */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl text-gray-800 leading-relaxed">
            Here2Next&apos;in temel önermesi — <strong className="text-[#183690]">kurumların girişimlerle gerçekten çalışabilmek için iç süreçlerini yeniden düzenlemesi gerektiği</strong> — eskiden &quot;iyi olur&quot; denilen bir olgunluk argümanıydı. Yapay zeka bunu bir hayatta kalma argümanına dönüştürdü.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Europe */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#183690]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#183690]">Avrupa&apos;da Tablo</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-3">
            {euStats.map((s) => (
              <div key={s.num} className="bg-[#183690] rounded-2xl p-5 text-center">
                <p className="text-3xl font-extrabold text-[#edac46] leading-none">{s.num}</p>
                <p className="text-xs text-blue-100 font-light mt-2 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-12">
            Kaynak:{' '}
            <a href="https://content.soprasteria.com/openinnovationreport2025/" target="_blank" rel="noopener noreferrer" className="text-[#183690] underline">
              Sopra Steria — Open Innovation Report 2025
            </a>{' '}
            (INSEAD ile, 12 Avrupa ülkesi; Türkiye örneklemde değil).
          </p>

          {/* Turkey */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c848aa]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#c848aa]">Türkiye&apos;de Tablo (2025)</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-3">
            {trStats.map((s) => (
              <div key={s.num} className="bg-[#c848aa] rounded-2xl p-5 text-center">
                <p className="text-3xl font-extrabold text-white leading-none">{s.num}</p>
                <p className="text-xs text-pink-50 font-light mt-2 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-10">
            Kaynak:{' '}
            <a href="https://media.startupcentrum.com/tr/turkiye-startup-ekosistemi-2025te-yeniden-dengeleniyor-622-milyon-dolarlik-yatirim-daha-secici-sermaye/" target="_blank" rel="noopener noreferrer" className="text-[#183690] underline">
              StartupCentrum 2025
            </a>{' '}
            (toplam yatırım) ·{' '}
            <a href="https://fintechistanbul.org/2025/07/08/2025-yilinin-ilk-yarisinda-turkiye-startup-ekosisteminden-one-cikan-gelismeler/" target="_blank" rel="noopener noreferrer" className="text-[#183690] underline">
              Startups.watch / FinTech İstanbul
            </a>{' '}
            (CVC sayısı, 2025 ilk yarı).
          </p>

          <div className="flex gap-3 items-start bg-gray-50 border border-gray-100 rounded-xl p-5">
            <TrendingUp size={20} className="text-[#183690] flex-shrink-0 mt-0.5" />
            <p className="text-gray-600 leading-relaxed">
              İvme her iki tarafta da aynı yöne işaret ediyor: teknoloji artık en büyük engel değil — kurumsal hazırlık ve karar hızı en büyük engel. Tam da Here2Next&apos;in başından beri savunduğu alan.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#edac46] uppercase tracking-wider mb-2 text-center">Üç Sütun, Yapay Zeka Merceğinden</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">Manifesto, AI çağında yeniden okunuyor</h2>

          <div className="space-y-6">
            {pillars.map((p) => (
              <div key={p.tag} className={`bg-white rounded-2xl p-7 border border-gray-100 border-l-[6px] ${p.bar} shadow-sm`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-white px-3 py-1 rounded-full ${p.badge}`}>
                    <p.icon size={13} />
                    {p.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#183690] mb-2">{p.title}</h3>
                <p className="text-gray-600 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tension */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#fff7e6] border border-[#f0dba6] rounded-2xl p-7">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={20} className="text-[#D48E15]" />
              <h3 className="text-xl font-bold text-[#D48E15]">Dürüst bir gerilim</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Yapay zeka, kurumların eskiden girişimlerden aldığı şeyi içeride üretmesini de kolaylaştırıyor ve küçük oyuncuların doğrudan rekabet etmesini sağlıyor. Bu yüzden Here2Next&apos;in vurgusu <strong>&quot;neden inşa etmek yerine iş birliği&quot;</strong> sorusuna yaslanmalı: hız, odak, regülasyon avantajı ve hızla değişen teknolojide batık maliyetten kaçınmak. İş birliğini varsayılan kabul etmek yerine, neden daha akıllı bir seçim olduğunu göstermeliyiz.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#183690] to-[#2A5CB8] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Siz de var mısınız?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
            Yapay zeka çağında kurum–girişim iş birliğini somut değere dönüştürmek için Here2Next ile yürüyün.
          </p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 bg-[#edac46] text-[#102668] px-6 py-3 rounded-xl font-bold text-lg hover:bg-[#D48E15] transition-colors"
          >
            Platforma Git
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center text-sm">
        <div className="max-w-[1200px] mx-auto px-4">
          <Image src="/logo.png" alt="Here2Next" width={100} height={31} className="h-6 w-auto mx-auto mb-3 brightness-0 invert" />
          <p className="mb-2">
            <a href="https://www.here2next.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[#edac46] transition-colors">
              www.here2next.org <ExternalLink size={12} />
            </a>
          </p>
          <p>© 2026 Here2Next. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </main>
  );
}
