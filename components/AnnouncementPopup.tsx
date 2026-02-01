'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AnnouncementPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // Store in localStorage to not show again for this session
    sessionStorage.setItem('announcement-closed', 'true')
  }

  useEffect(() => {
    // Check if already closed in this session
    if (sessionStorage.getItem('announcement-closed') === 'true') {
      setIsVisible(false)
    }
  }, [])

  if (!isVisible) return null

  const slogan = language === 'pt' 
    ? 'Transformando Ideias em Soluções Digitais de Excelência'
    : 'Transforming Ideas into Digital Excellence'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Popup Card */}
      <div className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-dark rounded-2xl shadow-2xl border border-secondary/30 max-w-md w-full p-8 animate-scale-in overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-secondary-light via-secondary to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-rotate-in" style={{ boxShadow: '0 4px 25px rgba(59, 130, 246, 0.5)' }}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Slogan */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-white via-secondary-light to-white bg-clip-text text-transparent">
              {slogan}
            </span>
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
            {language === 'pt' 
              ? 'Inovação, qualidade e excelência em cada projeto. Sua visão, nossa expertise.'
              : 'Innovation, quality and excellence in every project. Your vision, our expertise.'}
          </p>

          {/* CTA Button */}
          <button
            onClick={handleClose}
            className="btn-primary text-sm px-6 py-3 group animate-bounce-in" 
            style={{ animationDelay: '0.4s' }}
          >
            <span className="font-semibold">{language === 'pt' ? 'Explorar' : 'Explore'}</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

