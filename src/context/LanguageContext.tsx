"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "tr" | "en";

const translations: Record<string, { tr: string; en: string }> = {
  // Nav
  "nav.home": { tr: "Ana Sayfa", en: "Home" },
  "nav.startups": { tr: "Startup'lar", en: "Startups" },
  "nav.corporates": { tr: "Kurumlar", en: "Corporates" },
  "nav.wishlist": { tr: "İhtiyaç Listesi", en: "Wishlist" },
  "nav.events": { tr: "Etkinlikler", en: "Events" },
  "nav.news": { tr: "Haberler", en: "News" },
  "nav.matching": { tr: "Eşleşme", en: "Matching" },
  "nav.login": { tr: "Giriş Yap", en: "Sign In" },
  "nav.signup": { tr: "Kayıt Ol", en: "Sign Up" },
  "nav.dashboard": { tr: "Panel", en: "Dashboard" },
  "nav.profile": { tr: "Profil", en: "Profile" },
  "nav.logout": { tr: "Çıkış", en: "Sign Out" },
  "nav.admin": { tr: "Yönetim", en: "Admin" },

  // Hero
  "hero.title": { tr: "Startup ve Kurumları Bir Araya Getiriyoruz", en: "Connecting Startups with Corporates" },
  "hero.subtitle": { tr: "Here2Next üyeleri için startup-kurum işbirliğini kolaylaştıran platform. Keşfet, eşleş, büyü.", en: "The platform facilitating startup-corporate collaboration for Here2Next members. Discover, match, grow." },
  "hero.cta.startup": { tr: "Startup Olarak Katıl", en: "Join as Startup" },
  "hero.cta.corporate": { tr: "Kurum Olarak Katıl", en: "Join as Corporate" },
  "hero.cta.explore": { tr: "Platformu Keşfet", en: "Explore Platform" },

  // Stats
  "stats.startups": { tr: "Kayıtlı Startup", en: "Registered Startups" },
  "stats.corporates": { tr: "Kurum Üyesi", en: "Corporate Members" },
  "stats.matches": { tr: "Başarılı Eşleşme", en: "Successful Matches" },
  "stats.events": { tr: "Etkinlik", en: "Events" },

  // Sections
  "section.howItWorks": { tr: "Nasıl Çalışır?", en: "How It Works?" },
  "section.featuredStartups": { tr: "Öne Çıkan Startup'lar", en: "Featured Startups" },
  "section.corporateNeeds": { tr: "Kurum İhtiyaçları", en: "Corporate Needs" },
  "section.upcomingEvents": { tr: "Yaklaşan Etkinlikler", en: "Upcoming Events" },
  "section.latestNews": { tr: "Son Haberler", en: "Latest News" },
  "section.manifesto": { tr: "Startup Dostu Şirket Manifestosu", en: "Startup-Friendly Company Manifesto" },
  "section.members": { tr: "Kurucu Üyeler", en: "Founding Members" },
  "section.viewAll": { tr: "Tümünü Gör", en: "View All" },

  // Home - Manifesto
  "home.manifesto.desc": { tr: "İşbirliğinin gücüne inanıyoruz. Startup'lar inovasyonu, kurumlar ölçeği getirir. Birlikte dönüşüm yaratırlar.", en: "We believe in the power of collaboration. Startups bring innovation. Corporates bring scale. Together, they create transformation." },
  "home.manifesto.cta": { tr: "Misyonumuzu Oku", en: "Read Our Mission" },

  // How it works
  "how.step1.title": { tr: "Profil Oluştur", en: "Create Profile" },
  "how.step1.desc": { tr: "Startup veya kurum olarak detaylı profilinizi oluşturun", en: "Create your detailed profile as a startup or corporate" },
  "how.step2.title": { tr: "İhtiyaçlarını Paylaş", en: "Share Your Needs" },
  "how.step2.desc": { tr: "Aradığınız çözümleri veya sunduğunuz teknolojileri listeleyin", en: "List the solutions you need or the technologies you offer" },
  "how.step3.title": { tr: "AI ile Eşleş", en: "Match with AI" },
  "how.step3.desc": { tr: "Akıllı eşleşme motorumuz size en uygun partnerleri önerir", en: "Our smart matching engine suggests the best partners for you" },
  "how.step4.title": { tr: "İşbirliği Başlat", en: "Start Collaboration" },
  "how.step4.desc": { tr: "Doğrudan iletişime geçin ve birlikte büyüyün", en: "Get in touch directly and grow together" },

  // Startups page
  "startups.title": { tr: "Startup Dizini", en: "Startup Directory" },
  "startups.search": { tr: "Startup ara...", en: "Search startups..." },
  "startups.filter.sector": { tr: "Sektör", en: "Sector" },
  "startups.filter.stage": { tr: "Aşama", en: "Stage" },
  "startups.filter.all": { tr: "Tümü", en: "All" },
  "startups.viewProfile": { tr: "Profili Gör", en: "View Profile" },
  "startups.requestMatch": { tr: "Eşleşme Talep Et", en: "Request Match" },

  // Corporates page
  "corporates.title": { tr: "Kurum Dizini", en: "Corporate Directory" },
  "corporates.search": { tr: "Kurum ara...", en: "Search corporates..." },

  // Wishlist
  "wishlist.title": { tr: "Kurum İhtiyaç Listesi", en: "Corporate Wishlist" },
  "wishlist.subtitle": { tr: "Kurumların aradığı teknoloji çözümleri", en: "Technology solutions corporates are looking for" },
  "wishlist.apply": { tr: "Başvur", en: "Apply" },
  "wishlist.addNew": { tr: "Yeni İhtiyaç Ekle", en: "Add New Need" },

  // Events
  "events.title": { tr: "Etkinlikler", en: "Events" },
  "events.upcoming": { tr: "Yaklaşan", en: "Upcoming" },
  "events.past": { tr: "Geçmiş", en: "Past" },
  "events.register": { tr: "Kayıt Ol", en: "Register" },
  "events.details": { tr: "Detaylar", en: "Details" },

  // News
  "news.title": { tr: "Haberler & Güncellemeler", en: "News & Updates" },
  "news.readMore": { tr: "Devamını Oku", en: "Read More" },

  // Matching
  "matching.title": { tr: "Akıllı Eşleşme", en: "Smart Matching" },
  "matching.subtitle": { tr: "AI destekli eşleşme motorumuz sizin için en uygun partnerleri bulur", en: "Our AI-powered matching engine finds the best partners for you" },
  "matching.score": { tr: "Uyum Skoru", en: "Match Score" },
  "matching.connect": { tr: "Bağlantı Kur", en: "Connect" },
  "matching.why": { tr: "Neden Eşleşti?", en: "Why Matched?" },

  // Auth
  "auth.login.title": { tr: "Giriş Yap", en: "Sign In" },
  "auth.login.subtitle": { tr: "Hesabınıza giriş yapın", en: "Sign in to your account" },
  "auth.login.email": { tr: "E-posta", en: "Email" },
  "auth.login.password": { tr: "Şifre", en: "Password" },
  "auth.login.submit": { tr: "Giriş Yap", en: "Sign In" },
  "auth.login.loading": { tr: "Giriş yapılıyor...", en: "Signing in..." },
  "auth.login.noAccount": { tr: "Hesabınız yok mu?", en: "Don't have an account?" },
  "auth.register.title": { tr: "Kayıt Ol", en: "Sign Up" },
  "auth.register.subtitle": { tr: "Hesabınızı oluşturun", en: "Create your account" },
  "auth.register.name": { tr: "Ad Soyad", en: "Full Name" },
  "auth.register.namePlaceholder": { tr: "Adınız Soyadınız", en: "Your Full Name" },
  "auth.register.role": { tr: "Hesap Türü", en: "Account Type" },
  "auth.register.rolePlaceholder": { tr: "Rolünüzü seçin", en: "Select your role" },
  "auth.register.roleStartup": { tr: "Startup Kurucu", en: "Startup Founder" },
  "auth.register.roleCorporate": { tr: "Kurumsal Yönetici", en: "Corporate Executive" },
  "auth.register.roleInvestor": { tr: "Yatırımcı", en: "Investor" },
  "auth.register.confirmPassword": { tr: "Şifre Tekrar", en: "Confirm Password" },
  "auth.register.submit": { tr: "Kayıt Ol", en: "Sign Up" },
  "auth.register.loading": { tr: "Kayıt yapılıyor...", en: "Signing up..." },
  "auth.register.hasAccount": { tr: "Zaten hesabınız var mı?", en: "Already have an account?" },
  "auth.register.errorAllFields": { tr: "Lütfen tüm alanları doldurun", en: "Please fill in all fields" },
  "auth.register.errorPasswordMatch": { tr: "Şifreler eşleşmiyor", en: "Passwords do not match" },
  "auth.register.errorPasswordLength": { tr: "Şifre en az 8 karakter olmalıdır", en: "Password must be at least 8 characters" },

  // Footer
  "footer.about": { tr: "Hakkımızda", en: "About Us" },
  "footer.aboutText": { tr: "Here2Next, Türkiye'nin önde gelen kurumlarının startup-kurum işbirliğini güçlendirmek için kurduğu bir platformdur.", en: "Here2Next is a platform established by Turkey's leading corporations to strengthen startup-corporate collaboration." },
  "footer.links": { tr: "Hızlı Bağlantılar", en: "Quick Links" },
  "footer.contact": { tr: "İletişim", en: "Contact" },
  "footer.rights": { tr: "Tüm hakları saklıdır.", en: "All rights reserved." },

  // Common
  "common.sector": { tr: "Sektör", en: "Sector" },
  "common.stage": { tr: "Aşama", en: "Stage" },
  "common.founded": { tr: "Kuruluş", en: "Founded" },
  "common.team": { tr: "Ekip", en: "Team" },
  "common.funding": { tr: "Yatırım", en: "Funding" },
  "common.location": { tr: "Konum", en: "Location" },
  "common.save": { tr: "Kaydet", en: "Save" },
  "common.cancel": { tr: "İptal", en: "Cancel" },
  "common.delete": { tr: "Sil", en: "Delete" },
  "common.edit": { tr: "Düzenle", en: "Edit" },
  "common.back": { tr: "Geri", en: "Back" },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("tr");
  const t = (key: string): string => translations[key]?.[lang] ?? key;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLang must be used within LanguageProvider");
  return context;
}