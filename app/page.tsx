import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Team from "@/components/Team";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SocialSidebar from "@/components/SocialSidebar";
import AnnouncementPopup from "@/components/AnnouncementPopup";
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import SplashScreen from "@/components/SplashScreen";
import CookieBanner from "@/components/CookieBanner";
import BackToTop from "@/components/BackToTop";
import FAQ from "@/components/FAQ";
import HowWeWork from "@/components/HowWeWork";

export default function Home() {
  return (
    <main className="min-h-screen pt-0 mt-0">
      <SocialSidebar />
      <FloatingWhatsapp />
      <Header />
      <Hero />
      <About />
      <Team />
      <Services />
      <HowWeWork />
      <Testimonials />
      <Projects />
      <FAQ />
      <Contact />
      <Footer />
      <AnnouncementPopup />
      <SplashScreen />
      <CookieBanner />
      <BackToTop />
    </main>
  );
}
