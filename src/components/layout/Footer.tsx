"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#122858] rounded flex items-center justify-center text-white font-bold text-xs">
                H2N
              </div>
              <span className="font-bold text-white">Here2Next</span>
            </div>
            <p className="text-sm text-slate-400">
              {t("footer.aboutText")}
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.links")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/startups" className="hover:text-[#2A4FA0] transition-colors">
                  {t("nav.startups")}
                </Link>
              </li>
              <li>
                <Link href="/corporates" className="hover:text-[#2A4FA0] transition-colors">
                  {t("nav.corporates")}
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#2A4FA0] transition-colors">
                  {t("nav.events")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#2A4FA0] transition-colors">
                  {t("nav.news")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@here2next.com" className="hover:text-[#2A4FA0] transition-colors">
                  info@here2next.com
                </a>
              </li>
              <li>
                <a href="tel:+90212XXXXXXX" className="hover:text-[#2A4FA0] transition-colors">
                  +90 (212) XXX-XXXX
                </a>
              </li>
              <li className="text-slate-400">Istanbul, Turkey</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-sm text-slate-400 text-center">
            © {currentYear} Here2Next. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
