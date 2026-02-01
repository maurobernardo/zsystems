'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Project data - same as in Projects.tsx
const projectsData = {
  ucm: {
    title: {
      pt: 'Sistema Académico UCM-FEG',
      en: 'UCM-FEG Academic System'
    },
    category: {
      pt: 'Sistema Web',
      en: 'Web System'
    },
    description: {
      pt: 'Sistema web para facilitar o acesso às informações acadêmicas dos estudantes. Permite consultar avisos, controlar créditos, enviar comprovativos de pagamento e acompanhar validações. Inclui assistente virtual com voz para responder dúvidas.',
      en: 'Web system to facilitate access to students\' academic information. Allows checking notices, controlling credits, sending payment receipts, and tracking validations. Includes a voice virtual assistant to answer questions.'
    },
    technologies: ['React', 'TypeScript', 'Laravel', 'PHP'],
    gradient: 'from-blue-600 to-indigo-600',
    image: '/images/UCM.png',
    link: 'https://deyril-marlon.vercel.app/',
    imagesPath: '/Projectos/UCM',
  },
  deyril: {
    title: {
      pt: 'Portfólio Pessoal – Deyril Marlon',
      en: 'Personal Portfolio – Deyril Marlon'
    },
    category: {
      pt: 'Portfólio Web',
      en: 'Web Portfolio'
    },
    description: {
      pt: 'Portfólio pessoal moderno e interativo com suporte a múltiplos idiomas (PT/EN), modo escuro/claro e chatbot inteligente para responder perguntas sobre projetos e trajetória profissional.',
      en: 'Modern and interactive personal portfolio with support for multiple languages (PT/EN), dark/light mode, and an intelligent chatbot to answer questions about projects and professional journey.'
    },
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    gradient: 'from-purple-600 to-pink-600',
    image: '/images/Deyril.png',
    link: 'https://deyril-marlon.vercel.app/',
    imagesPath: '/Projectos/Deyril',
  },
}

export default function ProjectDetails() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const projectId = params.id as string
  const project = projectsData[projectId as keyof typeof projectsData]

  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!project) {
      router.push('/#projects')
      return
    }

    // Load images (1.png to 9.png)
    const imagePaths: string[] = []
    for (let i = 1; i <= 9; i++) {
      imagePaths.push(`${project.imagesPath}/${i}.png`)
    }
    setImages(imagePaths)
    setLoading(false)
  }, [project, router])

  if (!project) {
    return null
  }

  const openLightbox = useCallback((index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setSelectedImage(null)
    document.body.style.overflow = 'unset'
  }, [])

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setSelectedImage((current) => {
      if (current === null) return current
      
      if (direction === 'prev') {
        return current > 0 ? current - 1 : images.length - 1
      } else {
        return current < images.length - 1 ? current + 1 : 0
      }
    })
  }, [images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        if (e.key === 'Escape') {
          closeLightbox()
        } else if (e.key === 'ArrowLeft') {
          navigateImage('prev')
        } else if (e.key === 'ArrowRight') {
          navigateImage('next')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, closeLightbox, navigateImage])

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary">
      <Header />
      
      <section className="section-padding relative overflow-hidden pt-24">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container-custom relative z-10">
          {/* Back Button with Badge */}
          <Link 
            href="/#projects"
            className="inline-flex items-center gap-3 text-secondary-light hover:text-white mb-8 group animate-slide-up-fade transition-colors duration-300"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold flex items-center gap-2">
              <span className="px-3 py-1 bg-secondary/20 border border-secondary/40 rounded-full text-xs font-bold">
                {project.category[language]}
              </span>
              {language === 'pt' ? 'Voltar aos Projetos' : 'Back to Projects'}
            </span>
          </Link>

          {/* Project Header */}
          <div className="mb-12 animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
            <div className="inline-block mb-4">
              <span className={`px-4 py-2 bg-gradient-to-r ${project.gradient} rounded-full text-white text-sm font-semibold`}>
                {project.category[language]}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
              <span className="bg-gradient-to-r from-white via-secondary-light to-white bg-clip-text text-transparent">
                {project.title[language]}
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
              {project.description[language]}
            </p>
          </div>

          {/* Technologies */}
          <div className="mb-12 animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-white font-semibold mb-4 text-lg">
              {language === 'pt' ? 'Tecnologias Utilizadas' : 'Technologies Used'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-secondary/20 text-secondary-light text-sm font-semibold rounded-full border border-secondary/30 hover:border-secondary/50 hover:bg-secondary/30 transition-all duration-300 animate-fade-in-scale"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Gallery */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="aspect-video bg-primary-dark/50 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="mb-12">
              <h3 className="text-white font-semibold mb-6 text-lg animate-slide-up-fade" style={{ animationDelay: '0.6s' }}>
                {language === 'pt' ? 'Galeria de Imagens' : 'Image Gallery'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {images.map((imagePath, index) => (
                  <div
                    key={index}
                    className="group relative aspect-video bg-primary-dark/80 backdrop-blur-sm rounded-xl overflow-hidden border border-secondary/20 hover:border-secondary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/30 cursor-pointer animate-slide-up-fade"
                    style={{ 
                      animationDelay: `${0.7 + index * 0.1}s`,
                      boxShadow: '0 4px 25px rgba(59, 130, 246, 0.15)'
                    }}
                    onClick={() => openLightbox(index)}
                  >
                    <Image
                      src={imagePath}
                      alt={`${project.title[language]} - Image ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-secondary/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {project.link && project.link !== '#' && (
            <div className="text-center animate-slide-up-fade" style={{ animationDelay: '1.5s' }}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-8 py-4 group inline-flex items-center gap-3 shadow-xl hover:shadow-2xl hover:shadow-secondary/40"
              >
                <span className="font-semibold">{language === 'pt' ? 'Visitar Projeto' : 'Visit Project'}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-10"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('prev')
            }}
            className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-10"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('next')
            }}
            className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-10"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-semibold z-10">
            {selectedImage + 1} / {images.length}
          </div>

          {/* Image */}
          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedImage]}
              alt={`${project.title[language]} - Image ${selectedImage + 1}`}
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}

