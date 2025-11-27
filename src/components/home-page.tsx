"use client";
import { useEffect, useState } from "react";
import { HeroSection } from "@/components/hero-section";
import type { SearchFilters } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/app/stores/datastore";
import LogoLoop from "./LogoLoop";
import Header from "@/components/header";
import { SearchBar } from "./search-bar";
import { Button } from "@/components/ui/button";
import {
  Smile,
  Scissors,
  Wind,
  Zap,
  Heart,
  Check,
  Handshake,
  ChartBarDecreasing,
  Circle,
  CircleCheck,
} from "lucide-react";

const imageLogos = [
  {
    src: "/HIS.jpg",
    alt: "HIS",
    href: "https://www.healthcareimprovementscotland.scot/",
  },
  { src: "/HIW.jpg", alt: "HIW", href: "https://www.hiw.org.uk" },
  { src: "/jccp.jpg", alt: "JCCP", href: "https://www.jccp.org.uk/" },
  { src: "/qcc.jpg", alt: "CQC", href: "https://cqc.org.uk" },
  { src: "/rqia.jpg", alt: "RQIA", href: "https://www.rqia.org.uk/" },
  {
    src: "/save-face-partner.jpg",
    alt: "Save Face",
    href: "https://www.saveface.co.uk/",
  },
];

const specialists = [
  { name: "Facial Aesthetics", image: "images/Facial Aesthetics Specialist.webp" },
  { name: "Cosmetology", image: "images/Cosmetology Specialist.webp" },
  { name: "Hair & Scalp", image: "images/Hair & Scalp Specialist.webp" },
  { name: "Skin Technology & Laser", image: "images/Skin Technology & Laser Specialist.webp" },
  { name: "Wellness", image: "images/Wellness Specialist.webp" },
];

const treatments = [
  { name: "Facial", image: "images/Facial Treatment.webp" },
  { name: "Hands", image: "images/Hands  Treatment.webp" },
  { name: "Eyes", image: "images/Eyes Treatment.webp" },
  { name: "Skin", image: "images/Skin Treatment.webp" },
  { name: "Hairline", image: "images/Hairline Treatment.webp" },
];

const blogs = [
  {
    id: 1,
    title: "Top 10 Aesthetic Clinic Software Hawaii – Medspa Software HI",
    img: "/images/Aesthetic-Clinic-Software-in-Hawaii_result-768x432.webp",
    link: "#",
  },
  {
    id: 2,
    title: "10 Best HIPAA Compliant Medical Spa Software in 2025",
    img: "/images/HIPAA-Compliant-Medical-Spa-Software-768x432.webp",
    link: "#",
  },
  {
    id: 3,
    title: "How to Start a Medspa in 2025 [Complete Guide]",
    img: "/images/How-to-Start-a-Medspa-768x432.webp",
    link: "#",
  },
];

const faqData = [
  {
    q: "What is the Consentz Aesthetic Directory?",
    a: "The Consentz Aesthetic Directory is a verified platform within our clinic management system that connects patients with certified aesthetic and healthcare professionals. It allows patients to discover verified providers, read authentic reviews, and book appointments with confidence.",
  },
  {
    q: "How is the directory different from the clinic management software?",
    a: "The Consentz Directory is one component of our comprehensive platform. While our clinic management software helps practitioners run their businesses, the directory helps patients find and connect with these verified aesthetic professionals for treatments.",
  },
  {
    q: "Who can be listed in the directory?",
    a: "Only verified, certified aesthetic and healthcare professionals who use Consentz clinic management software can be listed. All providers are vetted to ensure they meet regulatory standards and maintain proper certifications.",
  },
  {
    q: "What specialties are featured in the directory?",
    a: "The directory includes specialists in: Facial Aesthetics, Dermatology, Hair & Scalp treatments, Skin Technology & Laser procedures, and Wellness services.",
  },
  {
    q: "How do I search for treatments?",
    a: "Browse our 'Most Popular Treatments' section featuring face, neck, eyes, skin, and jawline procedures, or click 'See all Treatments' to explore the complete range of aesthetic services available through our verified providers.",
  },
  {
    q: "Are the patient reviews verified?",
    a: "Yes. All reviews come from verified patients through our digital platform, ensuring transparency, trustworthiness, and authenticity in every review you read.",
  },
  {
    q: "Can I book appointments through the directory?",
    a: "Absolutely. You can book appointments directly with providers through the directory. Many clinics using Consentz offer online booking tools integrated into their profiles.",
  },
  {
    q: "How does Consentz ensure provider quality?",
    a: "We verify all providers are certified professionals registered with relevant regulatory bodies like the CQC. Our platform ensures safe, regulated, and high-quality care by only listing accredited practitioners.",
  },
  {
    q: "Is the directory free for patients to use?",
    a: "Yes, browsing provider profiles, reading reviews, and booking appointments through the Consentz Directory is completely free for patients.",
  },
  {
    q: "What information can I find about each provider?",
    a: "Each provider profile includes their certifications, specialties, available treatments, authentic patient reviews, clinic information, and booking availability.",
  },
  {
    q: "How can my clinic be featured in the directory?",
    a: "We'd love to have your clinic featured in the Consentz Aesthetic Directory! To get started, please contact our team to discuss how we can showcase your practice and connect you with new patients. Reach us at: UK: +44 (0) 208 050 3372, US: +1 646 786 1949, Email: contact@consentz.com. Or click 'BOOK DEMO' to schedule a consultation with our team.",
  },
  {
    q: "Can I read reviews before booking?",
    a: "Yes. We prioritize transparency by displaying verified patient reviews on each provider's profile, helping you make informed decisions about your aesthetic treatments.",
  },
  {
    q: "What makes the Consentz Directory trustworthy?",
    a: "Our commitment to building trust and clarity in healthcare means we only feature verified providers, showcase authentic reviews, and ensure all information is transparent. We've been powering elite aesthetics practices since 2012.",
  },
  {
    q: "How do I contact support if I have questions?",
    a: "You can reach our support team at: UK: +44 (0) 208 050 3372 US: +1 646 786 1949 Email: contact@consentz.com",
  },
];

const ITEMS_PER_PAGE = 9;

export default function HomePage() {
  const [openIndex, setOpenIndex] = useState<number|null>(null);

  const toggleFAQ = (index: number | null) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main>
      <HeroSection />
      <section className="bg-white-50 py-15 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl md:text-4xl font-bold text-center mb-16">
            Contact a Specialist
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 align-items-center">
            {specialists.map((specialist, index) => (
              <div key={index} className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center transition">
                  <img
                    src={specialist.image || "/placeholder.svg"}
                    alt={specialist.name || "Placeholder"}
                    className="w-[100px] h-[100px] object-cover rounded-lg"
                  />
                </div>
                <p className="text-base font-medium text-center">
                  {specialist.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Most Popular Treatments */}
      <section className="py-15 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center flex-col justify-between mb-12">
            <h2 className="text-xl md:text-4xl font-bold text-center mb-10">
              Most Popular Treatments
            </h2>
            <Button className="bg-[var(--text-color)] hover:bg-black h-auto rounded-lg text-lg px-7 py-3 text-white">
              See all Treatments
            </Button>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center items-center gap-4 pb-4">
              {treatments.map((treatment, index) => (
                <div key={index} className="flex-shrink-0">
                  <img
                    src={treatment.image || "/placeholder.svg"}
                    alt={treatment.name}
                    className="w-32 h-32 md:w-38 md:h-38 lg:w-45 lg:h-45 ml-auto mr-auto object-cover rounded-lg"
                  />
                  <p className="mt-4 text-base font-medium text-center">
                    {treatment.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <LogoLoop
        logos={imageLogos}
        speed={100}
        direction="left"
        logoHeight={48}
        gap={40}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Regulatory Compliance"
        className="py-10 md:py-15 relative"
      />
      {/* Trust Section */}
      <section className="py-15 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl md:text-4xl font-bold text-center mb-10 md:mb-16">
            Building trust and clarity in healthcare
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-12">
            {[
              {
                icon: Handshake,
                title: "Our commitment",
                desc: "We deliver a home to real ethical professionals. All professionals boast on our platform are verified and trusted by patients.",
              },
              {
                icon: ChartBarDecreasing,
                title: "Insight that matters",
                desc: "We ensure that patient reviews are genuine, with verified services with confidence by providing transparent information.",
              },
              {
                icon: CircleCheck,
                title: "Safe & reliable",
                desc: "We protect your data and ensure secure medical quality information is secured and protected from abuse, helping them.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="info-card bg-[var(--alabaster)] border-1 border-[var(--alto)] rounded-xl py-8 px-6 md:py-12 md:px-8 flex items-center flex-col"
              >
                <item.icon className="w-12 h-12 mb-8 hidden md:flex" />
                <h3 className="font-bold text-lg mb-4">{item.title}</h3>
                <p className="text-base font-normal text-center text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* For Service Providers Section */}
      <section className="py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <div>
              <h2 className="text-lg md:text-3xl text-center md:text-left md:text-4xl font-bold mb-6">
                For Service Providers
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 items-start">
                  <CircleCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Gather verified patient reviews with our digital platform.
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <CircleCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Showcase and validate your clinical expertise.
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <CircleCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Connect, engage, and better understand your patients.
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <CircleCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Access real-time insights to continually enhance your care.
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <CircleCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                    Connect with like-minded healthcare professionals.
                  </span>
                </li>
              </ul>
              <div className="text-center md:text-left mb-10 md:mb-0">
                <Button className="bg-[var(--text-color)] hover:bg-black h-auto rounded-lg text-lg px-7 py-3 text-white">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="images/Aesthetic Software Interface.webp"
                alt="Healthcare dashboard on laptop"
                className="max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Get Started CTA Section */}
      <section className="bg-[var(--dune)] py-20 text-white hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300">
              Join over 250+ clinics already growing with Consentz
            </p>
          </div>
          <Button className="bg-white text-black hover:bg-gray-200">
            BOOK DEMO
          </Button>
        </div>
      </section>

      {/* Latest blogs */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <h2 className="text-lg md:text-3xl text-center md:text-left md:text-4xl font-bold mb-6">
            Our Latest Blogs
          </h2>
          <p className="text-gray-700 text-base leading-relaxed">
            Explore insights and tips to help you manage and grow your
            aesthetics clinic efficiently. Stay informed with our latest
            articles.
          </p>
        </div>

        {/* Blog cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(({ id, title, img, link }) => (
            <article
              key={id}
              className="bg-gray-100 border border-gray-400 rounded-xl p-6 relative overflow-hidden"
            >
              <a href={link} className="block">
                <img
                  src={img}
                  alt={title}
                  className="w-full h-[212px] object-cover"
                  loading="lazy"
                />
              </a>

              <div className="mt-5">
                <a
                  href={link}
                  className="text-gray-900 underline hover:text-gray-700"
                >
                  {title}
                </a>

                <a
                  href={link}
                  className="block mt-4 underline hover:text-gray-700"
                >
                  Read More &rarr;
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="flex align-items-center justify-center pt-6 mt-6 mb-4">
          <Button className="font-base text-lg border-1 px-4 py-3 md:px-7 md:py-3 w-auto h-auto border-black bg-transparent text-black hover:bg-black hover:text-white">
            View All Blogs
          </Button>
        </div>
      </section>
      {/* FAQ */}
      <section className="max-w-4xl mx-auto pt-4 pb-25 px-6">
        <h2 className="text-lg md:text-3xl text-center md:text-4xl font-bold mb-6">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Find quick answers to common questions about the Consentz Aesthetic
          Directory.
        </p>

        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-gray-300 rounded-3xl p-4 transition-all duration-300"
              >
                <div
                  className="w-full flex items-center gap-4 text-left text-lg font-semibold cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-2xl font-normal text-center w-6 h-7 rounded-full leading-6 text-black transition-all select-none bg-black text-white">
                    {isOpen ? "−" : "+"}
                  </span>
                  <span className="font-medium underline">{item.q}</span>
                </div>

                <div
                  className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                    isOpen ? "max-h-40 mt-4" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-700 leading-relaxed">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
