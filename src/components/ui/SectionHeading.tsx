type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`${centered ? "text-center" : "text-left"} ${className}`}
    >
      <h2 className="text-3xl font-bold text-olive sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      <div
        className={`mt-4 h-0.5 w-16 rounded-full bg-sage ${
          centered ? "mx-auto" : "ml-0"
        }`}
        aria-hidden="true"
      />

      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-lg text-brown-light sm:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
