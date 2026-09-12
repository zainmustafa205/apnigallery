import Image from "next/image";

interface LandingHeroProps {
  title: string;
  bannerImage: string | null;
  adCopy: string | null;
}

export function LandingHero({ title, bannerImage, adCopy }: LandingHeroProps) {
  return (
    <div className="mb-8 text-center">
      {bannerImage && (
        <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl sm:aspect-[21/9]">
          <Image
            src={bannerImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 1024px"
            priority
            className="object-cover"
          />
        </div>
      )}

      <h1 className="text-text-dark text-2xl font-bold sm:text-3xl">{title}</h1>

      {adCopy && (
        <p className="text-text-dark/70 mx-auto mt-3 max-w-xl text-sm sm:text-base">
          {adCopy}
        </p>
      )}
    </div>
  );
}
