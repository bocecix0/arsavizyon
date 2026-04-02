import Navbar from "@/components/Navigation/Navbar";
import Hero from "@/components/Landing/Hero";
import Features from "@/components/Landing/Features";
import Pricing from "@/components/Landing/Pricing";
import Footer from "@/components/Landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}
