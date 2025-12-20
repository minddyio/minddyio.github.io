import { motion } from "framer-motion";
import { getTranslations, type Locale } from "../i18n";
import { SOCIAL_LINKS, TELEGRAM_COMMUNITY } from "../lib/links";

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const t = getTranslations(locale);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface text-white border-t border-primary/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo_minddy.png" alt={t.siteConfig.name} className="h-10" />
              <span className="text-xl font-semibold">{t.siteConfig.name}</span>
            </div>
            <p className="text-text-light max-w-sm mb-6">
              {t.footer.description}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {TELEGRAM_COMMUNITY[locale] && (
                <motion.a
                  href={TELEGRAM_COMMUNITY[locale]}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-accent hover:text-background transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.154.234.169.337.013.098.031.322.017.498z"/>
                  </svg>
                </motion.a>
              )}
              <motion.a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-accent hover:text-background transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t.footer.navigation}</h3>
            <ul className="space-y-3">
              {t.nav.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-text-light hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t.footer.resources}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-text-light hover:text-accent transition-colors"
                >
                  {t.footer.terms}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-light hover:text-accent transition-colors"
                >
                  {t.footer.privacy}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-6 border-t border-primary/20 text-xs text-text-muted/70 text-center space-y-2">
          <p>
            {t.siteConfig.tokenSymbol} {t.footer.disclaimer1}
          </p>
          <p>
            {t.footer.disclaimer2}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <p>© {currentYear} {t.siteConfig.name}. {t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
