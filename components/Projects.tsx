'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

export default function Projects() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [visibleProjects, setVisibleProjects] = useState<number[]>([])

  const projects = [
    {
      title: 'Sistema Académico UCM-FEG',
      category: language === 'pt' ? 'Sistema Web' : 'Web System',
      description: language === 'pt' 
        ? 'Sistema web para facilitar o acesso às informações acadêmicas dos estudantes. Permite consultar avisos, controlar créditos, enviar comprovativos de pagamento e acompanhar validações. Inclui assistente virtual com voz para responder dúvidas.'
        : 'Web system to facilitate access to students\' academic information. Allows checking notices, controlling credits, sending payment receipts, and tracking validations. Includes a voice virtual assistant to answer questions.',
      technologies: ['React', 'TypeScript', 'Laravel', 'PHP', 'MySQL', 'Tailwind CSS'],
      gradient: 'from-blue-600 to-indigo-600',
      image: '/images/UCM.png',
      link: '#',
    },
    {
      title: 'Portfólio Pessoal – Deyril Marlon',
      category: language === 'pt' ? 'Portfólio Web' : 'Web Portfolio',
      description: language === 'pt'
        ? 'Portfólio pessoal moderno e interativo com suporte a múltiplos idiomas (PT/EN), modo escuro/claro e chatbot inteligente para responder perguntas sobre projetos e trajetória profissional.'
        : 'Modern and interactive personal portfolio with support for multiple languages (PT/EN), dark/light mode, and an intelligent chatbot to answer questions about projects and professional journey.',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      gradient: 'from-purple-600 to-pink-600',
      image: '/images/Deyril.png',
      link: 'https://deyril-marlon.vercel.app/',
    },
    {
      title: 'Gestão de Projeto de Fim do Curso (Laravel/PHP)',
      category: language === 'pt' ? 'Sistema de Gestão' : 'Management System',
      description: language === 'pt'
        ? 'Desenvolvimento de um sistema web para gestão de projetos de fim do curso do Departamento de Arquitetura da UCM-FEG, facilitando o acompanhamento e a organização.'
        : 'Development of a web system for managing end-of-course projects for the Architecture Department of UCM-FEG, facilitating tracking and organization.',
      technologies: ['Laravel', 'PHP'],
      gradient: 'from-red-600 to-orange-600',
      image: '/images/Feg.png',
      link: '#',
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisibleProjects((prev) => [...prev, index])
          }
        })
      },
      { threshold: 0.1 }
    )

    const cards = document.querySelectorAll('[data-project-card]')
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="bg-gradient-to-b from-primary via-primary-dark to-primary section-padding relative overflow-hidden">
      {/* Enhanced Background decoration with floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Enhanced Header with better animations */}
        <div className="text-center mb-16 animate-slide-up-fade">
          <p className="text-secondary-light text-sm font-semibold uppercase tracking-wide mb-4 animate-fade-in">
            {t('projects.tagline')}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-white via-secondary-light to-white bg-clip-text text-transparent animate-gradient">
              {t('projects.title')}
            </span>
          </h2>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Enhanced Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={index}
              data-project-card
              data-index={index}
              className={`
                group relative bg-primary-dark/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl
                border border-secondary/20
                ${visibleProjects.includes(index) ? 'animate-slide-up-fade animate-fade-in-scale' : 'opacity-0'}
                hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-500 hover:-translate-y-2
              `}
              style={{ 
                animationDelay: `${0.3 + index * 0.15}s`,
                boxShadow: '0 4px 25px rgba(59, 130, 246, 0.15)'
              }}
            >
              {/* Enhanced glow effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 via-secondary/10 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="absolute inset-0 border border-secondary/30 opacity-0 group-hover:opacity-100 group-hover:border-secondary/60 transition-all duration-500 rounded-2xl" style={{ boxShadow: '0 0 40px rgba(59, 130, 246, 0.3)' }}></div>

              {/* Enhanced Project Image */}
              <div className="relative h-52 w-full overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-70 group-hover:opacity-90 transition-opacity duration-500`}></div>
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <svg className="w-24 h-24 text-white/30 group-hover:text-white/50 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                )}
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Enhanced Icon with blue gradient - top left */}
              <div className="relative p-6 pb-4 z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-light via-secondary to-primary rounded-xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-6 animate-rotate-in" style={{ 
                  boxShadow: '0 4px 25px rgba(59, 130, 246, 0.5)',
                  animationDelay: `${0.4 + index * 0.15}s`
                }}>
                  <svg className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                
                {/* Enhanced Category badge */}
                <div className="absolute top-6 right-6 bg-secondary/30 backdrop-blur-md rounded-full px-4 py-2 shadow-xl group-hover:scale-110 group-hover:bg-secondary/40 transition-all duration-300 border border-secondary/40 group-hover:border-secondary/60">
                  <span className="text-secondary-light text-xs font-bold group-hover:text-white transition-colors duration-300">{project.category}</span>
                </div>
              </div>

              {/* Enhanced Content */}
              <div className="px-6 pb-6 relative z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-secondary-light transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-5 leading-relaxed text-sm group-hover:text-gray-200 transition-colors duration-300">
                  {project.description}
                </p>

                {/* Enhanced Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1.5 bg-secondary/15 text-secondary-light text-xs font-semibold rounded-full border border-secondary/30 group-hover:border-secondary/50 group-hover:bg-secondary/25 transition-all duration-300 hover:scale-105"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Enhanced View Project Link */}
                <a
                  href={project.link}
                  target={project.link !== '#' ? '_blank' : undefined}
                  rel={project.link !== '#' ? 'noopener noreferrer' : undefined}
                  className="group/link inline-flex items-center justify-center gap-2 w-full mt-4 px-5 py-3.5 bg-gradient-to-r from-secondary/25 to-secondary/15 hover:from-secondary/35 hover:to-secondary/25 border border-secondary/40 hover:border-secondary/60 rounded-xl transition-all duration-300 text-secondary-light hover:text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:shadow-secondary/30 hover:scale-[1.02]"
                >
                  <span>{t('projects.viewProject')}</span>
                  <svg className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA */}
        <div className="text-center mt-16 animate-slide-up-fade" style={{ animationDelay: '0.9s' }}>
          <p className="text-gray-200 mb-6 text-lg md:text-xl">
            {t('projects.ready')}
          </p>
          <a href="#contact" className="btn-primary text-lg px-8 py-4 group shadow-xl hover:shadow-2xl hover:shadow-secondary/40 animate-bounce-in" style={{ animationDelay: '1s' }}>
            <span className="font-semibold">{t('projects.startProject')}</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
