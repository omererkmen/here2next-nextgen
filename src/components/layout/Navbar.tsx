"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Globe, Rocket, Building2, ListChecks, Calendar, Newspaper, Zap, LogIn, UserPlus, LogOut, User, LayoutDashboard, MessageSquareWarning, ChevronDown, Users, ShieldCheck, Activity } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { logActivity } from "@/lib/activityLog";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/", key: "nav.home", icon: null },
  { href: "/startups", key: "nav.startups", icon: Rocket },
  { href: "/corporates", key: "nav.corporates", icon: Building2 },
  { href: "/wishlist", key: "nav.wishlist", icon: ListChecks },
  { href: "/matching", key: "nav.matching", icon: Zap },
  { href: "/events", key: "nav.events", icon: Calendar },
  { href: "/news", key: "nav.news", icon: Newspaper },
];

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email || '');
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile) setUserRole(profile.role);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name || session.user.email || '');
      } else {
        setUserName('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await logActivity('logout');
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserName('');
    router.push('/');
    router.refresh();
  };

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-emerald-700 rounded flex items-center justify-center text-white font-bold text-sm">
              H2N
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-bold text-slate-900">Here2Next</span>
              <Badge variant="secondary" className="text-xs">
                NextGen
              </Badge>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, key, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5",
                  isActive(href)
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {t(key)}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "tr" ? "en" : "tr")}
              className="p-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
              title={lang === "tr" ? "Switch to English" : "Türkçe'ye geç"}
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-medium ml-1">{lang.toUpperCase()}</span>
            </button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <>
                  {userRole === 'admin' ? (
                    <div className="relative" onMouseEnter={() => setAdminMenuOpen(true)} onMouseLeave={() => setAdminMenuOpen(false)}>
                      <Link href="/admin">
                        <Button variant="ghost" size="sm" className="gap-1 text-slate-600">
                          <LayoutDashboard className="w-4 h-4" />
                          {lang === 'tr' ? 'Panel' : 'Dashboard'}
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </Link>
                      {adminMenuOpen && (
                        <div className="absolute top-full right-0 w-52 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                          <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setAdminMenuOpen(false)}>
                            <LayoutDashboard className="w-4 h-4" />
                            {lang === 'tr' ? 'Genel Bakış' : 'Overview'}
                          </Link>
                          <Link href="/admin/users" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setAdminMenuOpen(false)}>
                            <Users className="w-4 h-4" />
                            {lang === 'tr' ? 'Kullanıcılar' : 'Users'}
                          </Link>
                          <Link href="/admin/startups" className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50" onClick={() => setAdminMenuOpen(false)}>
                            <Rocket className="w-4 h-4" />
                            {lang === 'tr' ? 'Startup\'lar' : 'Startups'}
                          </Link>
                          <Link href="/admin/corporates" className="flex items-center gap-2 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50" onClick={() => setAdminMenuOpen(false)}>
                            <Building2 className="w-4 h-4" />
                            {lang === 'tr' ? 'Kurumlar' : 'Corporates'}
                          </Link>
                          <div className="border-t border-slate-100 my-1" />
                          <Link href="/admin/approvals" className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50" onClick={() => setAdminMenuOpen(false)}>
                            <ShieldCheck className="w-4 h-4" />
                            {lang === 'tr' ? 'Onay Bekleyenler' : 'Approvals'}
                          </Link>
                          <Link href="/admin/logs" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setAdminMenuOpen(false)}>
                            <Activity className="w-4 h-4" />
                            {lang === 'tr' ? 'Aktivite Logları' : 'Activity Logs'}
                          </Link>
                          <Link href="/admin/feedback" className="flex items-center gap-2 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50" onClick={() => setAdminMenuOpen(false)}>
                            <MessageSquareWarning className="w-4 h-4" />
                            {lang === 'tr' ? 'Geri Bildirimler' : 'Feedback'}
                          </Link>
                          <div className="border-t border-slate-100 my-1" />
                          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:bg-slate-50" onClick={() => setAdminMenuOpen(false)}>
                            <User className="w-4 h-4" />
                            {lang === 'tr' ? 'Kullanıcı Paneli' : 'User Dashboard'}
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href="/dashboard">
                      <Button variant="ghost" size="sm" className="gap-2 text-slate-600">
                        <LayoutDashboard className="w-4 h-4" />
                        {lang === 'tr' ? 'Panel' : 'Dashboard'}
                      </Button>
                    </Link>
                  )}
                  <Link href="/feedback">
                    <Button variant="ghost" size="sm" className="gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                      <MessageSquareWarning className="w-4 h-4" />
                      {lang === 'tr' ? 'Geri Bildirim' : 'Feedback'}
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
                      <User className="w-4 h-4 text-emerald-700" />
                      <span className="text-sm font-medium text-slate-700 max-w-[150px] truncate">{userName}</span>
                    </div>
                  </Link>
                  <Button variant="ghost" size="sm" className="gap-2 text-slate-600" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                    {lang === 'tr' ? 'Çıkış' : 'Logout'}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <LogIn className="w-4 h-4" />
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 gap-2">
                      <UserPlus className="w-4 h-4" />
                      {t("nav.signup")}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map(({ href, key, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2",
                    isActive(href)
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {t(key)}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                {user ? (
                  <>
                    {userRole === 'admin' ? (
                      <>
                        <Link href="/admin" onClick={() => setMobileOpen(false)}>
                          <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
                            <LayoutDashboard className="w-4 h-4" />
                            {lang === 'tr' ? 'Admin Paneli' : 'Admin Panel'}
                          </Button>
                        </Link>
                        <Link href="/admin/users" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full gap-2 justify-start text-slate-600">
                            <Users className="w-4 h-4" /> {lang === 'tr' ? 'Kullanıcılar' : 'Users'}
                          </Button>
                        </Link>
                        <Link href="/admin/startups" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full gap-2 justify-start text-emerald-600">
                            <Rocket className="w-4 h-4" /> {lang === 'tr' ? 'Startup\'lar' : 'Startups'}
                          </Button>
                        </Link>
                        <Link href="/admin/corporates" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full gap-2 justify-start text-blue-600">
                            <Building2 className="w-4 h-4" /> {lang === 'tr' ? 'Kurumlar' : 'Corporates'}
                          </Button>
                        </Link>
                        <Link href="/admin/approvals" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full gap-2 justify-start text-amber-600">
                            <ShieldCheck className="w-4 h-4" /> {lang === 'tr' ? 'Onaylar' : 'Approvals'}
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
                          <LayoutDashboard className="w-4 h-4" />
                          {lang === 'tr' ? 'Panel' : 'Dashboard'}
                        </Button>
                      </Link>
                    )}
                    <Link href="/feedback" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full gap-2 justify-start text-orange-600">
                        <MessageSquareWarning className="w-4 h-4" />
                        {lang === 'tr' ? 'Geri Bildirim' : 'Feedback'}
                      </Button>
                    </Link>
                    <Link href="/profile" onClick={() => setMobileOpen(false)}>
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors">
                        <User className="w-4 h-4 text-emerald-700" />
                        <span className="text-sm font-medium text-slate-700">{userName}</span>
                      </div>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full gap-2 justify-start" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                      <LogOut className="w-4 h-4" />
                      {lang === 'tr' ? 'Çıkış Yap' : 'Logout'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
                        <LogIn className="w-4 h-4" />
                        {t("nav.login")}
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button size="sm" className="w-full bg-emerald-700 hover:bg-emerald-800 gap-2 justify-start">
                        <UserPlus className="w-4 h-4" />
                        {t("nav.signup")}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
