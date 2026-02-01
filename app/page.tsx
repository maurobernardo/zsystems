import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Team from '@/components/Team'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Team />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}

