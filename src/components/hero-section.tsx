import { SearchBar } from "@/components/search-bar";
import LogoLoop from "./LogoLoop";
import Link from 'next/link';

export function HeroSection() {
  const imageLogos = [
    {
      src: "directory/images/Aesthetic-Medicine.webp",
      alt: "",
      href: "",

    },
    {
      src: "directory/images/Galderma.webp",
      alt: "",
      href: "",
    },
    {
      src: "directory/images/Save Face.webp",
      alt: "",
      href: "",
    },
    {
      src: "directory/images/Awards.webp",
      alt: "",
      href: "",
    },
    {
      src: "directory/images/Prime.webp",
      alt: "",
      href: "",
    },
  ];

  return (
    <div className="bg-[var(--primary-bg-color)]">
      <section
        className="
        bg-[var(--primary-bg-color)] 
        max-w-7xl 
        text-center 
        md:text-left 
        mx-auto 
        px-6
        pt-4
        pb-6
        md:pt-6
        md:pb-4
        items-center"
      >
        <div
          className="flex grid md:grid-cols-2 items-center gap-12 mb-6 pt-10 pb-10">
          <div className="md:pt-5">
            <h1
              className="text-3xl md:text-5xl mb-6 text-[var(--mineshaft)] font-[var(--font-noto)]"
              style={{ fontFamily: "var(--font-noto)" }}
            >
              The Home of Aesthetics & Wellbeing
            </h1>
            <p className="text-sm md:text-lg mb-8">
              Discover certified aesthetic and healthcare professionals. Browse
              verified profiles, read authentic reviews, and book with
              confidence.
            </p>
            <SearchBar />
            <div className="flex pt-4 md:pt-6 justify-center md:justify-start">
              <a href="/search" className="font-medium hover:text-black">
                OR Explore the Aesthetics Directory →
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="directory/images/Consentz Aesthetic Clinic Directory.webp"
              alt="Mobile app interface"
              className="max-w-xs"
            />
          </div>
        </div>
        <div className="flex w-full">
          <LogoLoop
            logos={imageLogos}
            speed={60}
            direction="left"
            logoHeight={48}
            gap={110}
            hoverSpeed={0}
            scaleOnHover
            ariaLabel="Beands"
            className="py-10 md:py-15 relative"
          />
        </div>
      </section>
    </div>
  );
}
