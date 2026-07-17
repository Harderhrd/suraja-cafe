import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import MenuCards from "./MenuCards";
import { MENU_ITEMS } from "@/lib/constants";

export default function MenuSection() {
  return (
    <section id="menu" className="bg-beige/50 py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeading
            title="Il Nostro Menu"
            subtitle="Dalla colazione all'apericena, tutto 100% vegetale, tutto fatto con amore."
            centered
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <MenuCards items={MENU_ITEMS} />
        </ScrollReveal>
      </div>
    </section>
  );
}
