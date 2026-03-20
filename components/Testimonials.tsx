'use client'

import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'
import SectionTitlePill from '@/components/SectionTitlePill'

export default function Testimonials() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  const testimonials = [
    {
      image: '/images/ceo1.png',
      name: 'Manuel de Andrade',
      role: language === 'pt' ? 'Ceo BioClean Environment' : ' Ceo BioClean Environment',
      quote:
        language === 'pt'
          ? 'A Z-Systems transformou a nossa presença digital com um sistema moderno, rápido e seguro. A equipa foi proativa e manteve uma comunicação clara do início ao fim.'
          : 'Z-Systems transformed our digital presence with a modern, fast and secure system. The team was proactive and kept clear communication from start to finish.',
    },
    {
      image: '/images/agro.jpeg',
      name: 'Celso Andre',
      role: language === 'pt' ? 'Ceo Agro Tech Mozambique' : 'Ceo Agro Tech Mozambique',
      quote:
        language === 'pt'
          ? 'Conseguimos um website e plataformas web com design atual e excelente performance. O suporte técnico e a qualidade da entrega fizeram a diferença.'
          : 'We achieved a website and web platforms with a modern design and excellent performance. Technical support and delivery quality made all the difference.',
    },
    {
      image: '/images/Samson1.png',
      name: 'Samson Chifamba',
      role: language === 'pt' ? 'IT Manager na Anantara' : 'IT Manager at Anantara',
      quote:
        language === 'pt'
          ? 'Trabalhar com a Z-Systems foi muito profissional. Eles organizaram o processo, alinharam expectativas e entregaram um produto robusto e fácil de manter.'
          : 'Working with Z-Systems was very professional. They organized the process, aligned expectations, and delivered a robust product that is easy to maintain.',
    },
    {
      image: '/images/marlon.png',
      name: 'Deyril Marlon',
      role: language === 'pt' ? 'Analista remoto na Data4Moz' : 'Remote Analyst at Data4Moz',
      quote:
        language === 'pt'
          ? 'Criaram um portefólio com navegação fluida, tradução PT/EN e uma experiência visual premium. Recomendo a Z-Systems pela qualidade e pelo cuidado na entrega.'
          : 'They built a portfolio with smooth navigation, PT/EN translation and a premium visual experience. I recommend Z-Systems to anyone who wants quality.',
    },
  ]

  const carouselItems = [...testimonials, ...testimonials]

  return (
    <section id="testimonials" className="bg-gradient-to-b from-primary via-primary-dark to-primary section-padding relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.8s' }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-14 animate-slide-up-fade">
          <SectionTitlePill>{t('testimonials.tagline')}</SectionTitlePill>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-scale">
            <span className="bg-gradient-to-r from-white via-secondary-light to-white bg-clip-text text-transparent animate-gradient">
              {t('testimonials.title')}
            </span>
          </h2>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto">{t('testimonials.subtitle')}</p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Carousel: cards a sair da direita para esquerda */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/10">
            <div className="flex gap-6 p-6 md:p-8 w-max animate-testimonials-marquee">
              {carouselItems.map((tt, idx) => (
                <div
                  key={`${tt.name}-${idx}`}
                  className="group relative rounded-[28px] p-7 md:p-8 border border-white/10 bg-primary-dark/40 backdrop-blur-md shadow-2xl overflow-hidden flex-none w-[340px] md:w-[420px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/10 bg-white/5">
                        <Image src={tt.image} alt={tt.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg leading-tight">{tt.name}</div>
                        <div className="text-secondary-light/90 text-sm font-semibold">{tt.role}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-secondary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h5v5H7V8zm10 0h-5v5h5V8z" />
                        </svg>
                      </div>
                      <p className="text-gray-200 text-base leading-relaxed">{tt.quote}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

