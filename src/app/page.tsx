import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import ChiSiamo from "@/components/sections/ChiSiamo";
import MenuSection from "@/components/sections/MenuSection";
import Galleria from "@/components/sections/Galleria";
import Recensioni from "@/components/sections/Recensioni";
import Contatti from "@/components/sections/Contatti";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ChiSiamo />
        <MenuSection />
        <Galleria />
        <Recensioni />
        <Contatti />
      </main>
      <Footer />
    </>
  );
}
