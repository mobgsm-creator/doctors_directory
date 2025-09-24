import type { Practitioner } from "./types"

// Sample data based on the CSV structure
export const practitioners: Practitioner[] = [
  {
    id: "1",
    slug: "andrea-la-belle-aesthetics",
    image: "https://lh3.googleusercontent.com/p/AF1QipOs4w-tME4eK5Ua3h5nRgY3AoN6EaTkDkd-P0lp=w40-h40-p-k-no",
    profession: "Part A | Registered statutory healthcare practitioner | Nurse",
    regulatoryBody: "NMC",
    registrationPin: "16G0539C",
    qualification: "Level 6 | Bachelors Degree or equivalent",
    modality: [
      [
        "Chemical peels and skin rejuvenation",
        "Deliver up to 1.0mm microneedling to the face and up to 1.5mm to the body",
        "Fully Registered\nCategory 2",
      ],
      ["Dermal fillers", "Administer temporary/semi-permanent dermal fillers", "Fully Registered\nCategory 2"],
      ["Botulinum toxins", "Administer botulinum toxins", "Fully Registered\nCategory 2"],
    ],
    memberSince: "17-09-2025",
    otherMemberships: "",
    restrictions: "",
    links: [
      "https://www.google.com/maps/place/House+of+luxe/@53.416743,-1.502986,17z/data=!4m15!1m8!3m7!1s0x487978e6fb944559:0xf4f9cdbc7bde81ee!2s45a+Penistone+Rd+N,+Sheffield+S6+1LP,+UK!3b1!8m2!3d53.4167398!4d-1.5004111!16s%2Fg%2F11y2w80c2b!3m5!1s0x487981f7004939d9:0x13bbfaa07a779b42!8m2!3d53.4167398!4d-1.5004111!16s%2Fg%2F11gf9d1t6f?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D",
    ],
    url: "https://www.google.com/maps/place/La+Belle+Medical+Aesthetics+Sheffield/@53.4167398,-1.5004111,17z",
    rating: 5.0,
    reviewCount: 8,
    category: "Beauty Parlour",
    gmapsAddress: "45a Penistone Rd N, Sheffield S6 1LP, United Kingdom",
    gmapsLink: "https://that-time.co.uk/la-belle-aesthetics-and-training-academy",
    gmapsPhone: "+44 7401 812123",
    gmapsReviews: [
      {
        reviewer_name: "Em",
        rating: "5 stars",
        date: "9 months ago",
        review_text:
          "Andrea is absolutely fantastic! I went for lip filler and she is so professional and approachable. She will give you honest advice on what looks best for you and is so fast to reply if you have any queries throughout the process and after. She is absolutely amazing at what she does!",
        owner_response: null,
      },
      {
        reviewer_name: "denise mukopfa",
        rating: "5 stars",
        date: "9 months ago",
        review_text:
          "recently moved to Sheffield and was looking for a new aesthetics practitioner, Andrea was lovely from start to finish. even came back for a top up of lip filler. such a pleasant. a few months later my filler still looks as perfect as the day i walked out the salon.",
        owner_response: null,
      },
    ],
    reviewAnalysis: [
      {
        practitioners: [
          {
            name: "Andrea",
            role_title: "aesthetics practitioner",
            attributes: ["professional", "knowledgeable", "experienced", "well qualified"],
            trust_signals: ["wouldn't go elsewhere", "honest", "amazing"],
            interpersonal_skills: ["approachable", "pleasant", "friendly", "comfortable"],
          },
        ],
        procedures_offered: {
          categories: ["lip filler", "Ultimate glow facial", "Microneedling", "Lemon Bottle skin booster"],
          patient_experience: ["comfortable", "explains well", "amazing experience"],
        },
        products: {
          injectables: ["lip filler"],
          skin_treatments: ["Ultimate glow facial", "Microneedling", "Lemon Bottle skin booster"],
          product_experience: ["amazing results", "satisfied", "as perfect as the day I walked out"],
        },
        reviewer_demographics: {
          loyalty_repeat_visits: ["repeat visits", "always happy with results"],
        },
        clinic_environment: ["clean", "tastefully decorated"],
        professionalism_safety: ["well qualified", "experienced"],
        treatment_outcomes: ["amazing results", "skin feels like new", "satisfied"],
        referrals_recommendations: ["highly recommend"],
      },
    ],
  },
]

export const categories = ["All Categories", "Beauty Parlour", "Medical Aesthetics", "Dermatology", "Cosmetic Surgery"]

export const services = [
  "Botulinum toxins",
  "Dermal fillers",
  "Chemical peels",
  "Microneedling",
  "Skin rejuvenation",
  "Facial treatments",
]
