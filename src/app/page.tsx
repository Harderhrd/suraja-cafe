import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import SpecialtiesMarquee from "@/components/sections/SpecialtiesMarquee";
import ChiSiamo from "@/components/sections/ChiSiamo";
import MenuSection from "@/components/sections/MenuSection";
import Galleria from "@/components/sections/Galleria";
import Recensioni from "@/components/sections/Recensioni";
import Contatti from "@/components/sections/Contatti";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import BookingModal from "@/components/ui/BookingModal";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SpecialtiesMarquee />
        <ChiSiamo />
        <MenuSection />
        <Galleria />
        <Recensioni />
        <Contatti />
      </main>
      <Footer />
      <WhatsAppButton />
      <BookingModal />
    </>
  );
}
