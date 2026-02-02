'use client'

import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

export default function Contact() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  })

  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus(null)

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setSubmitStatus({
        type: 'error',
        message:
          language === 'pt'
            ? 'Email não configurado. Defina as variáveis NEXT_PUBLIC_EMAILJS_* e tente novamente.'
            : 'Email is not configured. Set NEXT_PUBLIC_EMAILJS_* env vars and try again.',
      })
      return
    }

    try {
      setIsSending(true)

      await emailjs.send(
        serviceId,
        templateId,
        {
          // Compatible with EmailJS template fields like {{name}}, {{email}}, {{title}}
          title: language === 'pt' ? 'Novo contacto - Website' : 'New contact - Website',
          name: formData.name,
          email: formData.email,

          // Also keep these for templates that use {{from_name}}, {{from_email}}
          from_name: formData.name,
          from_email: formData.email,

          phone: formData.phone,
          company: formData.company,
          message: formData.message,
          language,
        },
        { publicKey }
      )

      setSubmitStatus({
        type: 'success',
        message:
          language === 'pt'
            ? 'Obrigado pela sua mensagem! Entraremos em contacto em breve.'
            : 'Thank you for your message! We will get back to you soon.',
      })
      setFormData({ name: '', email: '', phone: '', company: '', message: '' })
    } catch (err) {
      console.error('EmailJS error:', err)
      setSubmitStatus({
        type: 'error',
        message:
          language === 'pt'
            ? 'Não foi possível enviar agora. Por favor, tente novamente em alguns instantes.'
            : 'Could not send right now. Please try again in a moment.',
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t('contact.info.address'),
      value: t('contact.info.addressValue'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: t('contact.info.phone'),
      value: '870107006',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: t('contact.info.email'),
      value: t('header.email'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('contact.info.hours'),
      value: t('contact.info.hoursValue'),
      value2: t('contact.info.hoursValue2'),
    },
  ]

  return (
    <section id="contact" className="bg-gradient-to-b from-primary via-primary-dark to-primary section-padding relative overflow-hidden">
      {/* Enhanced Background decoration with floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Enhanced Header with better animations */}
        <div className="text-center mb-16 animate-slide-up-fade">
          <p className="text-secondary-light text-sm font-semibold uppercase tracking-wide mb-4 animate-fade-in">
            {t('contact.tagline')}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-white via-secondary-light to-white bg-clip-text text-transparent animate-gradient">
            {t('contact.title')}
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Enhanced Contact Information with better animations */}
          <div className="text-white animate-slide-in-blur">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
              <span className="bg-gradient-to-r from-white to-secondary-light bg-clip-text text-transparent">
                {t('contact.getInTouch')}
              </span>
            </h3>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
              {t('contact.description')}
            </p>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="group relative bg-primary-dark/50 backdrop-blur-sm rounded-2xl p-5 border border-secondary/20 hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/20 hover:-translate-y-1 animate-slide-up-fade"
                  style={{ 
                    animationDelay: `${0.3 + index * 0.1}s`,
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary/40 via-secondary/30 to-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-2xl" style={{ boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)' }}>
                      <div className="text-secondary-light group-hover:text-white transition-colors duration-300">
                      {info.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 text-lg text-white group-hover:text-secondary-light transition-colors duration-300">{info.title}</h4>
                      <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">{info.value}</p>
                      {info.value2 && <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">{info.value2}</p>}
                    </div>
                  </div>
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-secondary/0 via-secondary/10 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              ))}
              
              {/* Enhanced WhatsApp Button */}
              <div className="group relative bg-primary-dark/50 backdrop-blur-sm rounded-2xl p-5 border border-green-500/30 hover:border-green-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1 animate-slide-up-fade mt-8" style={{ animationDelay: '0.7s', boxShadow: '0 4px 20px rgba(34, 197, 94, 0.1)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/40 via-green-500/30 to-green-600/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-2xl" style={{ boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)' }}>
                    <svg className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold mb-3 text-lg text-white group-hover:text-green-300 transition-colors duration-300">{language === 'pt' ? 'WhatsApp' : 'WhatsApp'}</h4>
                  <a
                    href="https://wa.me/258870107006"
                    target="_blank"
                    rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 group/link"
                  >
                      <svg className="w-5 h-5 group-hover/link:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>{language === 'pt' ? 'Fale connosco no WhatsApp' : 'Chat with us on WhatsApp'}</span>
                  </a>
                </div>
                </div>
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form with better design */}
          <div className="relative bg-primary-dark/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl animate-slide-in-blur border border-secondary/30 overflow-hidden group hover:border-secondary/50 transition-all duration-500" style={{ 
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.15)',
            animationDelay: '0.2s'
          }}>
            {/* Animated gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="absolute inset-0 border border-secondary/30 group-hover:border-secondary/60 rounded-2xl transition-colors duration-500" style={{ boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)' }}></div>
            
            {/* Enhanced Icon with animation */}
            <div className="relative mb-6 z-10 animate-rotate-in">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary-light via-secondary to-primary rounded-xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" style={{ boxShadow: '0 4px 25px rgba(59, 130, 246, 0.5)' }}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {submitStatus && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    submitStatus.type === 'success'
                      ? 'bg-green-500/10 border-green-500/30 text-green-200'
                      : 'bg-red-500/10 border-red-500/30 text-red-200'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}
              {[
                { name: 'name', label: t('contact.form.name'), placeholder: t('contact.form.namePlaceholder'), type: 'text', required: true },
                { name: 'email', label: t('contact.form.email'), placeholder: t('contact.form.emailPlaceholder'), type: 'email', required: true },
                { name: 'phone', label: t('contact.form.phone'), placeholder: t('contact.form.phonePlaceholder'), type: 'tel', required: false },
                { name: 'company', label: t('contact.form.company'), placeholder: t('contact.form.companyPlaceholder'), type: 'text', required: false },
              ].map((field, index) => (
                <div 
                  key={field.name} 
                  className="relative animate-slide-up-fade"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <label htmlFor={field.name} className="block text-white font-semibold mb-2 text-sm">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(field.name)}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 text-sm border-2 rounded-xl transition-all duration-300 outline-none bg-primary/50 backdrop-blur-sm border-secondary/30 text-white placeholder-gray-400 ${
                      focusedField === field.name
                        ? 'border-secondary shadow-xl shadow-secondary/40 scale-[1.02] bg-primary-dark border-secondary-light'
                        : 'focus:border-secondary focus:bg-primary-dark hover:border-secondary/50'
                    }`}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div className="relative animate-slide-up-fade" style={{ animationDelay: '0.7s' }}>
                <label htmlFor="message" className="block text-white font-semibold mb-2 text-sm">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl transition-all duration-300 outline-none resize-none bg-primary/50 backdrop-blur-sm border-secondary/30 text-white placeholder-gray-400 ${
                    focusedField === 'message'
                      ? 'border-secondary shadow-xl shadow-secondary/40 scale-[1.02] bg-primary-dark border-secondary-light'
                      : 'focus:border-secondary focus:bg-primary-dark hover:border-secondary/50'
                  }`}
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full btn-primary justify-center text-base py-4 group shadow-xl hover:shadow-2xl hover:shadow-secondary/40 mt-4 animate-bounce-in disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ animationDelay: '0.8s' }}
              >
                <span className="font-semibold">
                  {isSending ? (language === 'pt' ? 'Enviando...' : 'Sending...') : t('contact.form.send')}
                </span>
                <svg className="w-5 h-5 group-hover:translate-y-1 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
