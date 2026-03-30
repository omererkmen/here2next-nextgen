"use client";

import Link from "next/link";
import Image from "next/image";
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
              <Image src="/logo.png" alt="Here2Next" width={120} height={37} className="h-8 w-auto brightness-0 invert" />
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
                <Link href="/startups" className="hover:text-[#2A5CB8] transition-colors">
                  {t("nav.startups")}
                </Link>
              </li>
              <li>
                <Link href="/corporates" className="hover:text-[#2A5CB8] transition-colors">
                  {t("nav.corporates")}
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#2A5CB8] transition-colors">
                  {t("nav.events")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#2A5CB8] transition-colors">
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
                <a href="mailto:h2n@here2next.org" className="hover:text-[#2A5CB8] transition-colors">
                  h2n@here2next.org
                </a>
              </li>
              <li>
                <a href="tel:+90212XXXXXXX" className="hover:text-[#2A5CB8] transition-colors">
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
