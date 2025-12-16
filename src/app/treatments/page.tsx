import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import Image from "next/image"
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
        <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {Object.keys(TreatmentMap).map((city, index) => (
            <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
                <Link href={`/treatments/${city}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-border/50 hover:border-accent/50">
                            <CardHeader >
                            <h2 className='flex justify-center font-semibold text-sm text-foreground group-hover:text-primary/70 transition-colors text-balance'>{city}</h2>
                            </CardHeader>
                            <CardContent className='flex items-center justify-center pt-0'>
                            <img
                        src={TreatmentMap[city].split("?w")[0] || "/placeholder.svg"}
                        alt="Profile photo"
                        width={240}
                        height={240}
                        className="flex items-center justify-center object-cover rounded-bl rounded-ee rounded-tr rounded-tl w-60 h-60"
                    />
                            </CardContent>

                        
                        </Card>
                        </Link>
            </div>
            ))}
        </div>
        
        </main>
    )
}