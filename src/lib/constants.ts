export const RESTAURANT_INFO = {
  name: "Suraja Cafè Vegan",
  address: "Via Roma, 4, 20862 Arcore (MB)",
  phone: "039 265 1629",
  phoneClean: "+390392651629",
  email: "info@surajacafe.it",
  googleMapsUrl: "https://maps.google.com/?q=Suraja+Cafè+Vegan+Arcore",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.123!2d9.326!3d45.597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVia+Roma+4+Arcore!5e0!3m2!1sit!2sit!4v1",
  rating: 4.6,
  reviewCount: 138,
  priceRange: "10 € - 20 €",
  hours: {
    "Lunedì": "08:00 - 20:00",
    "Martedì": "08:00 - 20:00",
    "Mercoledì": "08:00 - 20:00",
    "Giovedì": "08:00 - 20:00",
    "Venerdì": "08:00 - 22:00",
    "Sabato": "08:00 - 22:00",
    "Domenica": "09:00 - 18:00",
  },
  social: {
    instagram: "https://instagram.com/surajacafe",
    facebook: "https://facebook.com/surajacafe",
  },
};

export const MENU_ITEMS = [
  {
    id: "colazioni",
    title: "Colazioni",
    description: "Brioches vegane, tisane, caffè e torte artigianali per iniziare la giornata con dolcezza.",
    image: "/images/colazioni.jpg",
    items: ["Brioches vegane", "Tisane", "Caffè", "Torte artigianali"],
  },
  {
    id: "pranzi",
    title: "Pranzi",
    description: "Piatti leggeri e nutrienti, completamente vegetali, preparati con ingredienti freschi e di stagione.",
    image: "/images/pranzi.jpg",
    items: ["Piatti del giorno", "Insalate", "Zuppe", "Specialità vegane"],
  },
  {
    id: "apericena",
    title: "Apericena",
    description: "Il nostro famoso apericena vegano con stuzzichini, cocktail e un'atmosfera unica.",
    image: "/images/apericena.jpg",
    items: ["Stuzzichini vari", "Cocktail", "Taglieri vegani", "Vini naturali"],
  },
  {
    id: "dolci",
    title: "Dolci",
    description: "Torte artigianali: pistacchio, Sacher, pere e cioccolato. Tutte 100% vegetali, tutte buonissime.",
    image: "/images/dolci.jpg",
    items: ["Torta al pistacchio", "Torta Sacher", "Torta pere e cioccolato", "Torte vegane"],
  },
  {
    id: "bevande",
    title: "Bevande",
    description: "Tisane, caffè specialty, estratti naturali e bevande vegetali per ogni momento della giornata.",
    image: "/images/bevande.jpg",
    items: ["Tisane", "Caffè specialty", "Estratti naturali", "Bevande vegetali"],
  },
];

export const REVIEWS = [
  {
    id: 1,
    name: "Maria G.",
    rating: 5,
    text: "Finalmente un posto completamente vegano! La torta al pistacchio è una delle migliori che abbia mai mangiato. Ambiente accogliente e personale gentilissimo.",
    date: "2 settimane fa",
  },
  {
    id: 2,
    name: "Luca R.",
    rating: 5,
    text: "Non sono vegano ma sono rimasto piacevolmente sorpreso. L'apericena vegano è davvero ricco e saporito. Ci tornerò sicuramente!",
    date: "1 mese fa",
  },
  {
    id: 3,
    name: "Anna M.",
    rating: 5,
    text: "Locale moderno e accogliente, personale molto gentile. Le brioches vegane sono buonissime, non sembrano per niente vegane!",
    date: "3 settimane fa",
  },
  {
    id: 4,
    name: "Giovanni P.",
    rating: 4,
    text: "Ottimo rapporto qualità/prezzo. La posizione è centrale ad Arcore, facilmente raggiungibile. Consiglio la colazione con brioches e cappuccino vegetale.",
    date: "2 mesi fa",
  },
  {
    id: 5,
    name: "Chiara B.",
    rating: 5,
    text: "Ho provato la torta Sacher vegana: spettacolare! Anche chi non segue una dieta vegana rimane sorpreso dalla bontà. Super consigliato!",
    date: "1 mese fa",
  },
  {
    id: 6,
    name: "Marco L.",
    rating: 5,
    text: "Posto incantevole, personale preparato e piatti squisiti. Finalmente un'ottima cucina vegana in Brianza. 5 stelle meritate!",
    date: "3 settimane fa",
  },
];

export const GALLERY_IMAGES = [
  { id: 1, src: "/images/gallery-1.jpg", alt: "Interno del locale Suraja Cafè Vegan" },
  { id: 2, src: "/images/gallery-2.jpg", alt: "Piatto vegano" },
  { id: 3, src: "/images/gallery-3.jpg", alt: "Dolce vegano artigianale" },
  { id: 4, src: "/images/gallery-4.jpg", alt: "Tavola apparecchiata" },
  { id: 5, src: "/images/gallery-5.jpg", alt: "Apericena vegano" },
  { id: 6, src: "/images/gallery-6.jpg", alt: "Tisane e bevande calde" },
];
