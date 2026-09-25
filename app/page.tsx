import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Menu from "@/components/sections/Menu";
import VisionRoadmap from "@/components/sections/VisionRoadmap";
import Testimonials from "@/components/sections/Testimonials";
import HowToOrder from "@/components/sections/HowToOrder";
import InstagramFeed from "@/components/sections/InstagramFeed";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <Menu />
      <VisionRoadmap />
      <Testimonials />
      <HowToOrder />
      <InstagramFeed />
      <Footer />
    </div>
  );
}
