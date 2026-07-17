import { RESTAURANT_INFO } from "@/lib/constants";

export default function MapEmbed() {
  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-md">
      <iframe
        src={RESTAURANT_INFO.googleMapsEmbed}
        width="100%"
        height="400"
        style={{ border: 0, display: "block" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Mappa di ${RESTAURANT_INFO.name} - ${RESTAURANT_INFO.address}`}
        className="aspect-video h-auto w-full sm:h-[400px]"
      />
    </div>
  );
}
