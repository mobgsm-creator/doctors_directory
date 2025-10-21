
export const categories = ["All Categories", "Beauty Parlour", "Medical Aesthetics", "Dermatology", "Cosmetic Surgery"]

export const services = [
  "Botulinum toxins",
  "Dermal fillers",
  "Chemical peels",
  "Microneedling",
  "Skin rejuvenation",
  "Facial treatments",
]

// Types for a visx-friendly boxplot + overlays
export interface BoxStats {
  min: number
  q1: number
  median: number
  q3: number
  max: number
  mean: number
}

export interface ItemMeta {
  label?: string
  weighted_score: number
  confidence: number
  num_mentions: number
  top_sentence: string[]
}

export interface BoxPlotDatum {
  // Short key for internal reference (matches your stats keys)
  key: string
  // Human-readable label for display (matches your provided display names)
  label: string
  stats: BoxStats
  item: ItemMeta
}

// Combined data: quartiles/mean + item weighted score per category
export const boxplotData: BoxPlotDatum[] = [
  {
    key: "Clinical",
    label: "Clinical Expertise",
    stats: {
      min: 0.0,
      q1: 10.184247754514217,
      median: 28.635015711188316,
      q3: 59.82399929314852,
      max: 114.3905158340931,
      mean: 35.4936739466936,
    },
    item: {
      weighted_score: 23.86675462126732,
      confidence: 5.0616713762283325,
      num_mentions: 22,
      top_sentence: [],
    },
  },
  {
    key: "Communication",
    label: "Communication",
    stats: {
      min: 0.0,
      q1: 9.218587279319763,
      median: 23.909608349204063,
      q3: 48.75052556395531,
      max: 100.55664733052254,
      mean: 30.95581457107903,
    },
    item: {
      weighted_score: 25.74636533856392,
      confidence: 5.309156835079193,
      num_mentions: 20,
      top_sentence: [],
    },
  },
  {
    key: "Treatment",
    label: "Treatment Results",
    stats: {
      min: 0.0,
      q1: 17.404928617179394,
      median: 43.37971247732639,
      q3: 75.9858563169837,
      max: 135.7496875524521,
      mean: 48.077339800705474,
    },
    item: {
      weighted_score: 27.89490908384323,
      confidence: 5.869686096906662,
      num_mentions: 24,
      top_sentence: [],
    },
  },
  {
    key: "Bedside",
    label: "Bedside Manner",
    stats: {
      min: 0.0,
      q1: 15.70406012237072,
      median: 39.926849976181984,
      q3: 74.87227752804756,
      max: 136.73264637589455,
      mean: 45.651995214629935,
    },
    item: {
      weighted_score: 27.109365612268448,
      confidence: 5.888331204652786,
      num_mentions: 27,
      top_sentence: [],
    },
  },
  {
    key: "Trust",
    label: "Trust & Safety",
    stats: {
      min: 0.0,
      q1: 11.094762831926346,
      median: 31.926841288805008,
      q3: 64.03341848403215,
      max: 109.38527762889862,
      mean: 38.18532405621502,
    },
    item: {
      weighted_score: 21.44480586051941,
      confidence: 4.599968373775482,
      num_mentions: 21,
      top_sentence: [],
    },
  },
  {
    key: "Environment",
    label: "Environment",
    stats: {
      min: 0.0,
      q1: 12.228099592030048,
      median: 32.84936100244522,
      q3: 50.172665156424046,
      max: 124.70331132411957,
      mean: 36.194237733623424,
    },
    item: {
      weighted_score: 17.085305899381638,
      confidence: 3.504645884037018,
      num_mentions: 16,
      top_sentence: [],
    },
  },
  {
    key: "Personalization",
    label: "Personalization",
    stats: {
      min: 0.0,
      q1: 13.11387911438942,
      median: 31.981745064258575,
      q3: 61.87361553311348,
      max: 111.4104674756527,
      mean: 37.33001251560283,
    },
    item: {
      weighted_score: 27.184867709875107,
      confidence: 5.644613355398178,
      num_mentions: 26,
      top_sentence: [],
    },
  },
  {
    key: "PostCare",
    label: "Post-Care",
    stats: {
      min: 0.0,
      q1: 15.826747864484787,
      median: 40.348722860217094,
      q3: 91.1517734080553,
      max: 140.9870870411396,
      mean: 50.219614097915326,
    },
    item: {
      weighted_score: 31.30425527691841,
      confidence: 6.6823059022426605,
      num_mentions: 27,
      top_sentence: [],
    },
  },
  {
    key: "Professionalism",
    label: "Professionalism",
    stats: {
      min: 0.0,
      q1: 8.84803507477045,
      median: 23.283715471625328,
      q3: 44.61786046624184,
      max: 105.66882207989693,
      mean: 29.27594122807106,
    },
    item: {
      weighted_score: 17.339734137058258,
      confidence: 3.4708920419216156,
      num_mentions: 11,
      top_sentence: [],
    },
  },
  {
    key: "Staff",
    label: "Staff Support",
    stats: {
      min: 0.0,
      q1: 9.439108446240425,
      median: 25.60977190732956,
      q3: 46.29322845488787,
      max: 142.51535758376122,
      mean: 33.55542021918582,
    },
    item: {
      weighted_score: 15.492516309022903,
      confidence: 3.1206517815589905,
      num_mentions: 10,
      top_sentence: [],
    },
  },
  {
    key: "Value",
    label: "Value & Transparency",
    stats: {
      min: 0.0,
      q1: 0.0,
      median: 1.60221166908741,
      q3: 4.535106718540192,
      max: 35.74694335460663,
      mean: 3.00953234185973,
    },
    item: {
      weighted_score: 0.0,
      confidence: 0.0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Pain",
    label: "Pain Management & Comfort",
    stats: {
      min: 0.0,
      q1: 15.595480725169182,
      median: 41.59490205347538,
      q3: 72.56548549979925,
      max: 136.8950954079628,
      mean: 45.21396052136839,
    },
    item: {
      weighted_score: 22.72864118218422,
      confidence: 4.862400233745575,
      num_mentions: 26,
      top_sentence: [],
    },
  },
  {
    key: "Anxiety",
    label: "Anxiety & Nervousness Management",
    stats: {
      min: 0.0,
      q1: 13.221703432500362,
      median: 35.63545674085617,
      q3: 63.73773954808712,
      max: 121.96247562766075,
      mean: 39.47238837491231,
    },
    item: {
      weighted_score: 23.62533837556839,
      confidence: 4.978608131408691,
      num_mentions: 22,
      top_sentence: [],
    },
  },
  {
    key: "Booking",
    label: "Booking & Accessibility",
    stats: {
      min: 0.0,
      q1: 3.325166143476963,
      median: 9.564984440803528,
      q3: 19.93670206516981,
      max: 102.04850390553474,
      mean: 15.357905016299263,
    },
    item: {
      weighted_score: 4.7796593606472015,
      confidence: 0.9559318721294403,
      num_mentions: 3,
      top_sentence: [],
    },
  },
  {
    key: "Honesty",
    label: "Honesty & Realistic Expectations",
    stats: {
      min: 0.0,
      q1: 3.8958152011036873,
      median: 13.050354719161987,
      q3: 25.834566242992878,
      max: 59.85129103064537,
      mean: 16.33952630527941,
    },
    item: {
      weighted_score: 6.4793989062309265,
      confidence: 1.3122652769088745,
      num_mentions: 6,
      top_sentence: [],
    },
  },
  {
    key: "Longterm",
    label: "Long-term Relationship & Loyalty",
    stats: {
      min: 0.0,
      q1: 15.221665054559708,
      median: 40.93294680118561,
      q3: 77.87621986120939,
      max: 127.00567960739136,
      mean: 46.249700638343135,
    },
    item: {
      weighted_score: 24.84939381480217,
      confidence: 5.160027980804443,
      num_mentions: 25,
      top_sentence: [],
    },
  },
]


export const boxplotDatas: BoxPlotDatum[] = [
  {
    key: "Clinical",
    label: "Clinical Expertise",
    stats: {
      min: 0.0,
      q1: 10.184247754514217,
      median: 28.635015711188316,
      q3: 59.82399929314852,
      max: 114.3905158340931,
      mean: 35.4936739466936,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    }
    ,
  },
  {
    key: "Communication",
    label: "Communication",
    stats: {
      min: 0.0,
      q1: 9.218587279319763,
      median: 23.909608349204063,
      q3: 48.75052556395531,
      max: 100.55664733052254,
      mean: 30.95581457107903,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Treatment",
    label: "Treatment Results",
    stats: {
      min: 0.0,
      q1: 17.404928617179394,
      median: 43.37971247732639,
      q3: 75.9858563169837,
      max: 135.7496875524521,
      mean: 48.077339800705474,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Bedside",
    label: "Bedside Manner",
    stats: {
      min: 0.0,
      q1: 15.70406012237072,
      median: 39.926849976181984,
      q3: 74.87227752804756,
      max: 136.73264637589455,
      mean: 45.651995214629935,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Trust",
    label: "Trust & Safety",
    stats: {
      min: 0.0,
      q1: 11.094762831926346,
      median: 31.926841288805008,
      q3: 64.03341848403215,
      max: 109.38527762889862,
      mean: 38.18532405621502,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Environment",
    label: "Environment",
    stats: {
      min: 0.0,
      q1: 12.228099592030048,
      median: 32.84936100244522,
      q3: 50.172665156424046,
      max: 124.70331132411957,
      mean: 36.194237733623424,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Personalization",
    label: "Personalization",
    stats: {
      min: 0.0,
      q1: 13.11387911438942,
      median: 31.981745064258575,
      q3: 61.87361553311348,
      max: 111.4104674756527,
      mean: 37.33001251560283,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "PostCare",
    label: "Post-Care",
    stats: {
      min: 0.0,
      q1: 15.826747864484787,
      median: 40.348722860217094,
      q3: 91.1517734080553,
      max: 140.9870870411396,
      mean: 50.219614097915326,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Professionalism",
    label: "Professionalism",
    stats: {
      min: 0.0,
      q1: 8.84803507477045,
      median: 23.283715471625328,
      q3: 44.61786046624184,
      max: 105.66882207989693,
      mean: 29.27594122807106,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Staff",
    label: "Staff Support",
    stats: {
      min: 0.0,
      q1: 9.439108446240425,
      median: 25.60977190732956,
      q3: 46.29322845488787,
      max: 142.51535758376122,
      mean: 33.55542021918582,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Value",
    label: "Value & Transparency",
    stats: {
      min: 0.0,
      q1: 0.0,
      median: 1.60221166908741,
      q3: 4.535106718540192,
      max: 35.74694335460663,
      mean: 3.00953234185973,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Pain",
    label: "Pain Management & Comfort",
    stats: {
      min: 0.0,
      q1: 15.595480725169182,
      median: 41.59490205347538,
      q3: 72.56548549979925,
      max: 136.8950954079628,
      mean: 45.21396052136839,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Anxiety",
    label: "Anxiety & Nervousness Management",
    stats: {
      min: 0.0,
      q1: 13.221703432500362,
      median: 35.63545674085617,
      q3: 63.73773954808712,
      max: 121.96247562766075,
      mean: 39.47238837491231,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Booking",
    label: "Booking & Accessibility",
    stats: {
      min: 0.0,
      q1: 3.325166143476963,
      median: 9.564984440803528,
      q3: 19.93670206516981,
      max: 102.04850390553474,
      mean: 15.357905016299263,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Honesty",
    label: "Honesty & Realistic Expectations",
    stats: {
      min: 0.0,
      q1: 3.8958152011036873,
      median: 13.050354719161987,
      q3: 25.834566242992878,
      max: 59.85129103064537,
      mean: 16.33952630527941,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Longterm",
    label: "Long-term Relationship & Loyalty",
    stats: {
      min: 0.0,
      q1: 15.221665054559708,
      median: 40.93294680118561,
      q3: 77.87621986120939,
      max: 127.00567960739136,
      mean: 46.249700638343135,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
]

// item: {
//   weighted_score: 0,
//   confidence: 0,
//   num_mentions: 0,
//   top_sentence: [],
// }

export const boxplotDatas_clinic: BoxPlotDatum[] = [
  {
    key: "Clinical",
    label: "Clinical Expertise",
    stats: {
      min: 0.0,
      q1: 4.343109428882599,
      median: 17.93204963207245,
      q3: 44.27363693714142,
      max: 124.64579641819,
      mean: 26.68306371202295,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },

  {
    key: "Communication",
    label: "Communication",
    stats: {
      min: 0.0,
      q1: 9.218587279319763,
      median: 23.909608349204063,
      q3: 48.75052556395531,
      max: 100.55664733052254,
      mean: 30.95581457107903,
    },
    item: {
      weighted_score: 25.74636533856392,
      confidence: 5.309156835079193,
      num_mentions: 20,
      top_sentence: [],
    },
  },
  {
    key: "Treatment",
    label: "Treatment Results",
    stats: {
      min: 0.0,
      q1: 7.847011610865593,
      median: 30.68303018808365,
      q3: 83.74123051762581,
      max: 152.68114566802979,
      mean: 46.669279678138764,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Bedside",
    label: "Bedside Manner",
    stats: {
      min: 0.0,
      q1: 15.70406012237072,
      median: 39.926849976181984,
      q3: 74.87227752804756,
      max: 136.73264637589455,
      mean: 45.651995214629935,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Trust",
    label: "Trust & Safety",
    stats: {
      min: 0.0,
      q1: 11.094762831926346,
      median: 31.926841288805008,
      q3: 64.03341848403215,
      max: 109.38527762889862,
      mean: 38.18532405621502,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Environment",
    label: "Environment",
    stats: {
      min: 0.0,
      q1: 7.066807150840759,
      median: 26.941265910863876,
      q3: 70.54585747420788,
      max: 146.94780379533768,
      mean: 40.320863753429435,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Personalization",
    label: "Personalization",
    stats: {
      min: 0.0,
      q1: 13.11387911438942,
      median: 31.981745064258575,
      q3: 61.87361553311348,
      max: 111.4104674756527,
      mean: 37.33001251560283,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "PostCare",
    label: "Post-Care",
    stats: {
      min: 0.0,
      q1: 15.826747864484787,
      median: 40.348722860217094,
      q3: 91.1517734080553,
      max: 140.9870870411396,
      mean: 50.219614097915326,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Professionalism",
    label: "Professionalism",
    stats: {
      min: 0.0,
      q1: 8.84803507477045,
      median: 23.283715471625328,
      q3: 44.61786046624184,
      max: 105.66882207989693,
      mean: 29.27594122807106,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Staff",
    label: "Staff Support",
    stats: {
      min: 0.0,
      q1: 5.289367660880089,
      median: 21.78466185927391,
      q3: 58.919208496809006,
      max: 154.31525766849518,
      mean: 34.88372503241798,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Value",
    label: "Value & Transparency",
    stats: {
      min: 0.0,
      q1: 0.0,
      median: 1.60221166908741,
      q3: 4.535106718540192,
      max: 35.74694335460663,
      mean: 3.00953234185973,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Pain",
    label: "Pain Management & Comfort",
    stats: {
      min: 0.0,
      q1: 15.595480725169182,
      median: 41.59490205347538,
      q3: 72.56548549979925,
      max: 136.8950954079628,
      mean: 45.21396052136839,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Anxiety",
    label: "Anxiety & Nervousness Management",
    stats: {
      min: 0.0,
      q1: 13.221703432500362,
      median: 35.63545674085617,
      q3: 63.73773954808712,
      max: 121.96247562766075,
      mean: 39.47238837491231,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Booking",
    label: "Booking & Accessibility",
    stats: {
      min: 0.0,
      q1: 3.325166143476963,
      median: 9.564984440803528,
      q3: 19.93670206516981,
      max: 102.04850390553474,
      mean: 15.357905016299263,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Honesty",
    label: "Honesty & Realistic Expectations",
    stats: {
      min: 0.0,
      q1: 3.8958152011036873,
      median: 13.050354719161987,
      q3: 25.834566242992878,
      max: 59.85129103064537,
      mean: 16.33952630527941,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
  {
    key: "Longterm",
    label: "Long-term Relationship & Loyalty",
    stats: {
      min: 0.0,
      q1: 15.221665054559708,
      median: 40.93294680118561,
      q3: 77.87621986120939,
      max: 127.00567960739136,
      mean: 46.249700638343135,
    },
    item: {
      weighted_score: 0,
      confidence: 0,
      num_mentions: 0,
      top_sentence: [],
    },
  },
]
