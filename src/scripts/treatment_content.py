# treatments.py

TreatmentMap = {
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
}


QUESTION_TEMPLATES = [
    "What is {treatment}? How does it work?",
    "What are the goals of {treatment}?",
    "What are the pros and cons of {treatment}?",
    "What is the cost of {treatment} in the UK, and why does the price vary between clinics?",
    "What should you look for when choosing a doctor or clinic for {treatment}?",
    "How does {treatment} compare with non-surgical or alternative options?",
    "Who is a good candidate for {treatment}?",
    "How should you prepare for {treatment}?",
    "What are the safety considerations for {treatment}? Is it painful?",
    "How long do the results of {treatment} last?",
    "How does {treatment} differ for mild versus severe cases, and what does it not treat?",
    "What happens during a {treatment} appointment, and how long does it take?",
    "What is the recovery process, downtime, and possible side effects of {treatment}?",
    "Is {treatment} regulated in the UK, and what should you do if something goes wrong?",
    "Does {treatment} require maintenance sessions? How often should it be repeated?",
    "What qualifications should a practitioner offering {treatment} have?",
    "Are there NICE, FDA, or MHRA guidelines for {treatment}?",
]
print(TreatmentMap.keys())
time.sleep(100)

def generate_faqs(treatments: dict) -> dict:
    """
    Returns:
        {
            "Acne": [list of 17 questions],
            "Botox": [list of 17 questions],
            ...
        }
    """
    faqs = {}

    for treatment in treatments.keys():
        faqs[treatment] = [
            template.format(treatment=treatment)
            for template in QUESTION_TEMPLATES
        ]

    return faqs


if __name__ == "__main__":
    print(TreatmentMap.keys())
    faqs = generate_faqs(TreatmentMap)

    for key in TreatmentMap.keys():
        print(faqs[key])
