'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

export default function Footer() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-dark text-white relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="container-custom py-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Enhanced Company Info */}
          <div className="animate-slide-up-fade">
            <div className="flex items-center gap-3 mb-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-light via-secondary to-primary rounded-lg flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{ boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)' }}>
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-white to-secondary-light bg-clip-text text-transparent">Z-Systems</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-primary/50 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all duration-300 border border-secondary/20 hover:border-secondary/50 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 bg-primary/50 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all duration-300 border border-secondary/20 hover:border-secondary/50 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 bg-primary/50 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all duration-300 border border-secondary/20 hover:border-secondary/50 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div className="animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-bold text-lg mb-4 text-white">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#home" className="text-gray-400 hover:text-secondary-light transition-all duration-300 text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  {t('header.home')}
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-400 hover:text-secondary-light transition-all duration-300 text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  {t('header.about')}
                </Link>
              </li>
              <li>
                <Link href="#team" className="text-gray-400 hover:text-secondary-light transition-all duration-300 text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  {t('header.team')}
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-gray-400 hover:text-secondary-light transition-all duration-300 text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  {t('header.projects')}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-secondary-light transition-all duration-300 text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  {t('header.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Enhanced Contact Info */}
          <div className="animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-bold text-lg mb-4 text-white">{t('footer.contact')}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/30 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-4 h-4 text-secondary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">{t('contact.info.addressValue')}</span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/30 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-4 h-4 text-secondary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">870107006</span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/30 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-4 h-4 text-secondary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">{t('header.email')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="border-t border-primary/30 pt-8 mt-8 animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} <span className="text-secondary-light font-semibold">Z-Systems</span>. {t('footer.rights')}
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-secondary-light transition-all duration-300 group">
                <span className="group-hover:underline">{t('footer.privacy')}</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary-light transition-all duration-300 group">
                <span className="group-hover:underline">{t('footer.terms')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
