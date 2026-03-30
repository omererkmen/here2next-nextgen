"use client";

import { useLang } from "@/context/LanguageContext";
import {
  Users, Handshake, BarChart3, Briefcase, TrendingUp,
  Calendar, Target, Lightbulb, MessageCircle, Rocket,
  CheckCircle2, ArrowRight, Star, Clock
} from "lucide-react";

const stats = [
  { value: "58", key: "cvc.stats.meetings", icon: Calendar, color: "bg-orange-100 text-orange-600" },
  { value: "15", key: "cvc.stats.stakeholders", icon: Users, color: "bg-blue-100 text-[#183690]" },
  { value: "3", key: "cvc.stats.deepdive", icon: Target, color: "bg-purple-100 text-purple-600" },
  { value: "78", key: "cvc.stats.decks", icon: Briefcase, color: "bg-green-100 text-green-600" },
  { value: "2", key: "cvc.stats.coinvest", icon: TrendingUp, color: "bg-pink-100 text-[#c848aa]" },
];

const stakeholders = [
  "Kuveyt Türk Ventures", "Sun Tekstil", "Aktif Ventures", "C Ventures",
  "Yıldız Ventures", "Vestel Ventures", "Tüpraş", "Farklabs",
  "Migros", "EnerjiSA", "BSH"
];

const startupsReviewed = [
  "Ecomercek", "Sensgreen", "WeBee", "Wefarm", "Worksy", "Tamamlıyo",
  "Selfweller", "Rentiva", "Prozon", "Bulutklinik", "Selekt ai", "Poliark",
  "Onedocs", "Kybele's Garden", "Archi's Academy", "Opien", "Fizbot", "Arvis",
  "Wastelog", "Skann", "B2metric", "Sidea", "Nuvio", "Cowealth",
  "Voltla", "Ni-Cat Batarya", "Evalıyo", "Arkeobox", "REBEE", "F-Ray",
  "OMMA", "CogniScope", "GoWit", "Bren", "Robolaunch", "Lumnion",
  "Paywall", "etasin", "Mocky.AI", "Jobtogo", "Relate", "Nara XR",
  "TreeoVC", "Kolay Randevu", "RNV Analitics", "Empler", "VR Lab", "SeleKt AI",
  "Econtech", "Harcy"
];

const pocStartups = ["Bren", "Empler AI", "Harcy", "Packard", "Jobtogo"];

const investedStartups = ["Shippn", "Pivony", "Jobtogo"];

export default function CVCCirclePage() {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#edac46] via-[#f0b94f] to-[#edac46] text-white py-20 sm:py-28 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full bg-white/10 blur-xl" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-white/80 text-sm font-semibold tracking-widest uppercase mb-4">Here2Next</p>
            <h1 className="text-5xl sm:text-7xl font-extrabold mb-4 leading-tight">{t('cvc.title')}</h1>
            <p className="text-xl sm:text-2xl font-medium text-white/90 mb-6">{t('cvc.subtitle')}</p>
            <p className="text-lg text-white/80 max-w-xl leading-relaxed">{t('cvc.desc')}</p>
          </div>

          {/* Schedule badge */}
          <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5">
            <Clock size={18} />
            <span className="font-semibold">{t('cvc.stats.schedule')}</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.key} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon size={22} />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{t(stat.key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('cvc.benefits.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* For Startups */}
            <div className="bg-gradient-to-br from-[#183690]/5 to-[#183690]/10 border border-[#183690]/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#183690] flex items-center justify-center">
                  <Rocket className="text-white" size={22} />
                </div>
                <h3 className="text-xl font-bold text-[#183690]">{t('cvc.benefits.startups')}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{t('cvc.benefits.startups.desc')}</p>
            </div>

            {/* For Investors */}
            <div className="bg-gradient-to-br from-[#edac46]/5 to-[#edac46]/10 border border-[#edac46]/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#edac46] flex items-center justify-center">
                  <BarChart3 className="text-white" size={22} />
                </div>
                <h3 className="text-xl font-bold text-[#edac46]">{t('cvc.benefits.investors')}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{t('cvc.benefits.investors.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learnings Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('cvc.learnings.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { key: 'cvc.learnings.1', icon: Lightbulb, color: 'text-[#edac46]' },
              { key: 'cvc.learnings.2', icon: Handshake, color: 'text-[#183690]' },
              { key: 'cvc.learnings.3', icon: TrendingUp, color: 'text-[#8cb45b]' },
            ].map((item) => (
              <div key={item.key} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <item.icon className={`${item.color} mb-3`} size={28} />
                <p className="text-gray-700 leading-relaxed">{t(item.key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('cvc.stakeholders.title')}</h2>
          <div className="flex flex-wrap gap-3">
            {stakeholders.map((name) => (
              <div key={name} className="bg-white border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm hover:border-[#edac46] hover:shadow-md transition-all">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Startups Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Reviewed Startups */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#183690] flex items-center justify-center">
                <Briefcase className="text-white" size={18} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t('cvc.startups.title')}</h2>
              <span className="bg-[#183690]/10 text-[#183690] text-sm font-semibold px-3 py-1 rounded-full">{startupsReviewed.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {startupsReviewed.map((name) => (
                <span key={name} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:border-[#183690]/30 transition-colors">
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* POC Startups */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#edac46] flex items-center justify-center">
                <Target className="text-white" size={18} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t('cvc.poc.title')}</h2>
              <span className="bg-[#edac46]/10 text-[#edac46] text-sm font-semibold px-3 py-1 rounded-full">{pocStartups.length}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {pocStartups.map((name) => (
                <div key={name} className="bg-white border-2 border-[#edac46]/30 rounded-xl px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm flex items-center gap-2">
                  <CheckCircle2 className="text-[#edac46]" size={16} />
                  {name}
                </div>
              ))}
            </div>
          </div>

          {/* Invested Startups */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#8cb45b] flex items-center justify-center">
                <TrendingUp className="text-white" size={18} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t('cvc.invested.title')}</h2>
              <span className="bg-[#8cb45b]/10 text-[#8cb45b] text-sm font-semibold px-3 py-1 rounded-full">{investedStartups.length}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {investedStartups.map((name) => (
                <div key={name} className="bg-gradient-to-r from-[#8cb45b]/10 to-[#8cb45b]/5 border-2 border-[#8cb45b]/30 rounded-xl px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm flex items-center gap-2">
                  <Star className="text-[#8cb45b] fill-[#8cb45b]" size={16} />
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's New */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('cvc.whats.new')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { key: 'cvc.new.guests', icon: Users },
              { key: 'cvc.new.vc', icon: Briefcase },
              { key: 'cvc.new.linkedin', icon: MessageCircle },
            ].map((item) => (
              <div key={item.key} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-[#edac46]/10 flex items-center justify-center mb-4">
                  <item.icon className="text-[#edac46]" size={20} />
                </div>
                <p className="text-gray-700 leading-relaxed">{t(item.key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#183690] to-[#2A5CB8] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">{t('cvc.cta')}</h2>
          <p className="text-lg text-blue-100 mb-2">{t('cvc.stats.schedule')}</p>
        </div>
      </section>
    </main>
  );
}
