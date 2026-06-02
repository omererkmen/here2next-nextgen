'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ExternalLink, Coffee, Mic, Users, Lightbulb, ArrowRight, Rocket } from 'lucide-react';

const schedule = [
  { time: '12:30 - 13:30', title: 'Öğle Yemeği & Karşılama', icon: Coffee, color: 'bg-amber-100 text-amber-700' },
  { time: '13:30 - 13:45', title: 'Hoş geldiniz! | here2next Ekibi', icon: Users, color: 'bg-blue-100 text-[#183690]' },
  { time: '13:45 - 14:10', title: 'Global Açık İnovasyon & Yapay Zeka', speaker: 'Emrecan Kerçek, Plug and Play', icon: Lightbulb, color: 'bg-purple-100 text-purple-700' },
  { time: '14:10 - 14:25', title: 'Kahve Molası', icon: Coffee, color: 'bg-amber-100 text-amber-700' },
  { time: '14:25 - 15:30', title: 'Startup Pitch', icon: Rocket, color: 'bg-green-100 text-green-700', startups: ['Carbon Smart', 'Clerion', 'Voltla', 'Skymod'] },
  { time: '15:30 - 16:00', title: 'Networking & Kapanış', icon: Users, color: 'bg-[#edac46]/20 text-[#edac46]' },
];

export default function EventLandingPage() {
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
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 bg-gradient-to-br from-[#183690] via-[#1a3d99] to-[#102668] text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[#edac46]/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-[#5093b6]/10 blur-2xl" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
              <Calendar size={14} />
              <span>3 Haziran 2026, Çarşamba</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
              Build
              <span className="text-[#edac46]"> Together</span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
              Kurumlar ve startuplar arasındaki iş birliği süreçlerini hızlı ve verimli hale getirmek üzere kurulan here2next, son dönemin en trend konularından biri olan <strong className="text-white">"Global Açık İnovasyon ve Yapay Zeka"</strong> üzerine konuşacağız.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5">
                <Clock size={16} className="text-[#edac46]" />
                <span className="text-sm font-medium">12:30 - 16:00</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5">
                <MapPin size={16} className="text-[#edac46]" />
                <span className="text-sm font-medium">Akbank LAB</span>
              </div>
            </div>

            {/* Powered by */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <span className="text-xs text-blue-200 uppercase tracking-wider">powered by</span>
              <span className="text-lg font-bold text-[#edac46]">Akbank LAB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Program</h2>
            <p className="text-gray-500">3 Haziran 2026 | Akbank LAB</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {schedule.map((item, i) => (
              <div key={i} className="flex gap-4 sm:gap-6 mb-1">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon size={18} />
                  </div>
                  {i < schedule.length - 1 && (
                    <div className="w-0.5 bg-gray-200 flex-1 my-1" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8 flex-1">
                  <p className="text-xs font-mono text-gray-400 mb-1">{item.time}</p>
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  {item.speaker && (
                    <p className="text-sm text-[#183690] font-medium mt-1">{item.speaker}</p>
                  )}
                  {item.startups && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.startups.map((s) => (
                        <span key={s} className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keynote Speaker */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-semibold text-[#edac46] uppercase tracking-wider mb-3">Keynote Speaker</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Emrecan Kerçek</h2>
            <p className="text-lg text-[#183690] font-medium mb-6">Plug and Play</p>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <Lightbulb className="mx-auto mb-4 text-[#edac46]" size={32} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Açık İnovasyon & Yapay Zeka</h3>
              <p className="text-gray-600 leading-relaxed">
                Dünya genelinde açık inovasyon ekosisteminin son trendleri ve yapay zekanın kurumsal-girişim iş birliklerindeki dönüştürücü rolü üzerine bir konuşma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pitching Startups */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Startup Pitch</h2>
            <p className="text-gray-500">Bu etkinlikte sunum yapacak girişimler</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {['Carbon Smart', 'Clerion', 'Voltla', 'Skymod'].map((name) => (
              <div key={name} className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center hover:border-[#edac46] hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-[#183690]/10 to-[#edac46]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Rocket className="text-[#183690]" size={24} />
                </div>
                <p className="font-bold text-gray-900 text-sm">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#edac46] to-[#f0b94f] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Aramızda olmak ister misiniz?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Program ilginizi çektiyse bize DM'den yazın, konuşalım.
          </p>
          <a
            href="https://www.linkedin.com/company/here2next/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#183690] px-6 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            LinkedIn'den Ulaşın
            <ExternalLink size={18} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center text-sm">
        <div className="max-w-[1200px] mx-auto px-4">
          <Image src="/logo.png" alt="Here2Next" width={100} height={31} className="h-6 w-auto mx-auto mb-3 brightness-0 invert" />
          <p>© 2026 Here2Next. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </main>
  );
}
