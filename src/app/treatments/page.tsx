import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Input } from "@/components/ui/input";
import { Icon, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientSideSearch } from "@/components/client-side-search";

const TreatmentMap: Record<string, string> = {
  "Acne": "/directory/treatments/acne.webp",
  "Alopecia": "/directory/treatments/alopecia.webp",
  "Anti Wrinkle Treatment": "/directory/treatments/anti wrinkle treatment.webp",
  "Aqualyx": "/directory/treatments/aqualyx.webp",
  "Aviclear": "/directory/treatments/aviclear.webp",
  "B12 Injection": "/directory/treatments/b12.webp",
  "Birthmarks": "/directory/treatments/birthmarks.webp",
  "Botox": "/directory/treatments/botox.webp",
  "Breast Augmentation": "/directory/treatments/breast-augmentation.webp",
  "Cheek Enhancement": "/directory/treatments/cheek-enhancement.webp",
  "Chemical Peel": "/directory/treatments/chemical-peel.webp",
  "Chin Enhancement": "/directory/treatments/chin-enhancement.webp",
  "Aesthetic Skin Consultation": "/directory/treatments/consultation.webp",
  "Contact Dermatitis": "/directory/treatments/contact-dermatitis.webp",
  "CoolSculpting": "/directory/treatments/coolsculpting.webp",
  "Cysts Treatment": "/directory/treatments/cyst-treatment.webp",
  "Dermapen Treatment": "/directory/treatments/dermapen.webp",
  "Dermatitis Treatment": "/directory/treatments/dermatitis-treatment.webp",
  "Dermatology Treatments": "/directory/treatments/dermatology-treatments.webp",
  "Eczema Treatment": "/directory/treatments/exzema-treatment.webp",
  "Eyebrows and Lashes": "/directory/treatments/eyebrow-lashes.webp",
  "Facial Treatments": "/directory/treatments/facial-treatments.webp",
  "Hair Treatments": "/directory/treatments/hair.webp",
  "HIFU": "/directory/treatments/hifu.webp",
  "Hives Treatment": "/directory/treatments/hives.webp",
  "Hyperhidrosis": "/directory/treatments/Hyperhidrosis.webp",
  "Inflammatory Skin Conditions": "/directory/treatments/inflammatory skin conditions.webp",
  "IPL Treatment": "/directory/treatments/ipl-treatments.webp",
  "Keloid Removal": "/directory/treatments/keloid removal.webp",
  "Tattoo Removal": "/directory/treatments/laser-tattoo-removal.webp",
  "Laser Treatments": "/directory/treatments/laser-treatments.webp",
  "Fillers": "/directory/treatments/lip-filler-6485474_640.webp",
  "Liposuction": "/directory/treatments/liposuction illustration.webp",
  "Lips": "/directory/treatments/lips.webp",
  "Lymphatic Drainage": "/directory/treatments/lymphatic-drainage.webp",
  "Marionettes": "/directory/treatments/marionettes.webp",
  "Massage": "/directory/treatments/massage.webp",
  "Melanoma Treatment": "/directory/treatments/melanoma-treatments.webp",
  "Melasma Treatment": "/directory/treatments/melasma.webp",
  "Microneedling": "/directory/treatments/micro-needling.webp",
  "Microblading": "/directory/treatments/microblading.webp",
  "Microneedling with Radiofrequency": "/directory/treatments/microneedling with radiofrequency.webp",
  "Moles": "/directory/treatments/moles.webp",
  "Nails": "/directory/treatments/nail-polish-2112358_640.webp",
  "Obagi": "/directory/treatments/obagi.webp",
  "Patch Testing": "/directory/treatments/patch-testing.webp",
  "Photodynamic Therapy (PDT)": "/directory/treatments/photodynamic therapy.webp",
  "Pigmentation Treatment": "/directory/treatments/pigmentation-treatments.webp",
  "Polynucleotide Treatment": "/directory/treatments/polynucleotide-treatment.webp",
  "Profhilo": "/directory/treatments/profhilo.webp",
  "Platelet Rich Plasma": "/directory/treatments/prp.webp",
  "Psoriasis": "/directory/treatments/psoriasis.webp",
  "Rash Treatment": "/directory/treatments/rash-treatment.webp",
  "Rosacea Treatment": "/directory/treatments/rosacea.webp",
  "Scarring": "/directory/treatments/scarring.webp",
  "Seborrheic Keratosis Treatment": "/directory/treatments/seborrheic keratosis.webp",
  "Seborrhoeic Dermatitis": "/directory/treatments/seborrhoeic dermatitis.webp",
  "Rhinoplasty": "/directory/treatments/side-view-doctor-checking-patient-before-rhinoplasty.webp",
  "Skin Texture and Tightening": "/directory/treatments/skin texture and tightening.webp",
  "Skin Booster": "/directory/treatments/skin-booster.webp",
  "Skin Cancer": "/directory/treatments/skin-cancer.webp",
  "Skin Lesions": "/directory/treatments/skin-lesions.webp",
  "Skin Tags": "/directory/treatments/skin-tags.webp",
  "Tear Trough Treatment": "/directory/treatments/tear-through-treatments.webp",
  "Threading": "/directory/treatments/threading.webp",
  "Varicose Vein Procedure": "/directory/treatments/varicose-vein.webp",
  "Verruca Treatment": "/directory/treatments/verruca treatment.webp",
  "Vitamin Therapy": "/directory/treatments/vitamin-therapy.webp",
  "Vulval Dermatology": "/directory/treatments/vulval-dermatology.webp",
  "Weight Loss": "/directory/treatments/weight-loss.webp"
};

export default function HomePage() {
  
    return (
      <main className="bg-[var(--primary-bg-color)] ">
        <ClientSideSearch />
        <div className="mx-auto max-w-7xl md:px-4 py-4 md:py-12 flex flex-col justify-center w-full gap-10">
          <div className="flex py-5 items-center flex-col align-center justify-center gap-5">
            <form className="flex flex-row max-w-3xl w-full">
              <div className="bg-white rounded-xl grow">
                <Input
                  className="p-7"
                  placeholder="I'm searching for..."
                />
              </div>
              <button 
                type="submit"
                className="bg-black flex items-center justify-center rounded-xl px-4 m-1 hover:cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <Search className="text-white" />
              </button>
            </form>
          </div>
          <div className="flex flex-row items-start justify-center gap-6">
            <div className="w-64">
              <h3 className="font-semibold text-xl text-black mb-6">Filters</h3>

              {/* Concern Filter */}
              <div className="mb-6">
                <label className="block text-base font-medium text-black mb-2">
                  Concern:
                </label>
                <Select>
                  <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
                    <SelectValue className="text-black" placeholder="All"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="acne">Acne</SelectItem>
                    <SelectItem value="wrinkles">Anti-Aging</SelectItem>
                    <SelectItem value="pigmentation">Pigmentation</SelectItem>
                    <SelectItem value="hair-loss">Hair Loss</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Treatment Type Filter */}
              <div className="mb-6">
                <label className="block text-base font-medium text-black mb-2">
                  Treatment Type:
                </label>
                <Select>
                  <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="surgical">Surgical</SelectItem>
                    <SelectItem value="non-surgical">Non-Surgical</SelectItem>
                    <SelectItem value="laser">Laser</SelectItem>
                    <SelectItem value="injectable">Injectable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Treatment Area Filter */}
              <div className="mb-6">
                <label className="block text-base font-medium text-black mb-2">
                  Treatment Area:
                </label>
                <Select>
                  <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="face">Face</SelectItem>
                    <SelectItem value="body">Body</SelectItem>
                    <SelectItem value="hair">Hair</SelectItem>
                    <SelectItem value="skin">Skin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Practitioner Type Filter */}
              <div className="mb-6">
                <label className="block text-base font-medium text-black mb-2">
                  Practitioner Type:
                </label>
                <Select>
                  <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="dermatologist">Dermatologist</SelectItem>
                    <SelectItem value="plastic-surgeon">
                      Plastic Surgeon
                    </SelectItem>
                    <SelectItem value="aesthetic-practitioner">
                      Aesthetic Practitioner
                    </SelectItem>
                    <SelectItem value="nurse">Nurse Practitioner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grow  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in">
              {Object.keys(TreatmentMap).map((treatment, index) => (
                <div 
                  key={index} 
                  style={{ animationDelay: `${index * 50}ms` }}
                  data-treatment-card="true"
                  data-treatment-name={treatment}
                >
                  <Link
                    href={`/treatments/${treatment}`}
                    title={`Learn about ${treatment} treatments and find qualified specialists`}
                  >
                    <Card className="group flex flex-col gap-5 bg-transparent hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer md:border-0 hover:border-accent/50">
                      <CardContent className="flex p-0 items-center justify-center pt-0">
                        <img
                          src={
                            TreatmentMap[treatment].split("?w")[0] ||
                            "/placeholder.svg"
                          }
                          alt={`${treatment} treatment procedure`}
                          width={240}
                          height={240}
                          className="flex items-center justify-center object-cover rounded-full w-60 h-60"
                        />
                      </CardContent>

                      <CardHeader>
                        <h2 className="flex justify-center font-semibold text-sm text-foreground group-hover:text-primary/70 transition-colors text-balance">
                          {treatment}
                        </h2>
                      </CardHeader>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
}