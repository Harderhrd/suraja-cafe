import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";

const PUNTI_DI_FORZA = [
  {
    title: "Cucina 100% vegana",
    description: "Tutti i nostri piatti sono preparati esclusivamente con ingredienti vegetali, senza compromessi sul gusto.",
  },
  {
    title: "Dolci artigianali",
    description: "Torte, brioches e dessert preparati quotidianamente dalle nostre pastry chef.",
  },
  {
    title: "Atmosfera accogliente",
    description: "Un ambiente caldo e rilassante dove sentirsi a casa, nel cuore di Arcore.",
  },
  {
    title: "Ingredienti freschi e di stagione",
    description: "Selezioniamo solo prodotti locali e di stagione per garantire freschezza e qualità.",
  },
];

export default function ChiSiamo() {
  return (
    <section id="chi-siamo" className="bg-cream py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            {/* Image placeholder */}
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <div className="aspect-[4/5] flex items-center justify-center bg-sage-light/30">
                <div className="text-center">
                  <span className="text-6xl font-bold text-sage/50">S</span>
                  <p className="mt-2 text-sm font-medium text-brown-light">
                    Foto del locale
                  </p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <SectionHeading
                title="Chi Siamo"
                subtitle="La nostra storia, la nostra filosofia"
              />

              <p className="text-base leading-relaxed text-brown md:text-lg">
                Suraja Cafè Vegan nasce dalla passione per la cucina vegetale e il
                desiderio di offrire un&apos;esperienza gastronomica che unisce gusto,
                benessere e sostenibilità. Nel cuore di Arcore, il nostro locale
                accoglie ogni giorno clienti alla ricerca di piatti genuini, dolci
                artigianali e un&apos;atmosfera rilassante.
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {PUNTI_DI_FORZA.map((punto, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage/20">
                      <svg
                        className="h-3.5 w-3.5 text-sage-dark"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-olive">{punto.title}</h3>
                      <p className="mt-1 text-sm text-brown-light">
                        {punto.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
