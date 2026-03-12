const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const CLINICS_PATH = path.join(ROOT, "public", "clinics_processed_new_data.json");
const PRACTITIONERS_PATH = path.join(ROOT, "public", "derms_processed_new_5403.json");

const OUT_CLINIC_RANKING = path.join(ROOT, "public", "clinic_ranking_dataset.json");
const OUT_PRACTITIONER_RANKING = path.join(ROOT, "public", "practitioner_ranking_dataset.json");

const PILLARS = {
  visibility: "Clinic Visibility",
  pricing: "Pricing Transparency",
  safety: "Safety and Trust",
  overall: "Overall Aggregation",
};

const today = new Date().toISOString().slice(0, 10);

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeJson = (p, value) => fs.writeFileSync(p, JSON.stringify(value));

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.trim() ? [value] : [];
    }
  }
  if (value && typeof value === "object") return Object.values(value);
  return [];
};

const hasText = (value) => {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return false;
};

const safeString = (value) => (typeof value === "string" ? value.toLowerCase() : "");

const parseFeeValue = (fees) => {
  const items = asArray(fees);
  const values = [];
  for (const item of items) {
    const priceStr = typeof item === "object" && item ? String(item.price || "") : String(item || "");
    const matches = [...priceStr.matchAll(/\d+(?:\.\d+)?/g)];
    for (const m of matches) {
      const n = Number(m[0]);
      if (!Number.isNaN(n) && n > 0 && n < 20000) values.push(n);
    }
  }
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
};

const makeItemMeta = (weightedScore, confidence, numMentions, topSentence) => ({
  weighted_score: Math.max(0, Math.min(100, Math.round(weightedScore))),
  confidence: Number(confidence.toFixed(2)),
  num_mentions: Math.max(0, Math.round(numMentions)),
  top_sentence: topSentence.filter(Boolean).slice(0, 4),
});

const boolCheck = (name, met, scoreContribution, evidence, source) => ({
  name,
  met,
  score_contribution: Math.max(0, Math.min(20, Math.round(scoreContribution))),
  evidence,
  source,
});

const getCityFeeBaselines = (clinics) => {
  const byCity = new Map();
  for (const clinic of clinics) {
    const city = clinic.City || "Unknown";
    const fee = parseFeeValue(clinic.Fees);
    if (fee == null) continue;
    const arr = byCity.get(city) || [];
    arr.push(fee);
    byCity.set(city, arr);
  }

  const medians = new Map();
  for (const [city, values] of byCity.entries()) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    medians.set(city, median);
  }

  return medians;
};

const scoreClinic = (clinic, cityFeeMedian) => {
  const socials = [clinic.facebook, clinic.instagram, clinic.twitter, clinic.youtube, clinic.Linkedin, clinic.x_twitter]
    .filter((v) => hasText(v));

  const paymentsText = JSON.stringify(clinic.Payments || "").toLowerCase();
  const feesText = JSON.stringify(clinic.Fees || "").toLowerCase();
  const about = safeString(clinic.about_section);
  const reviewAnalysis = clinic.reviewAnalysis || {};

  const hasOnlineBooking = hasText(clinic.website) || /book|appointment|bookings/.test(about);
  const hasOnlinePayment =
    /online|card|klarna|clearpay|plim|payment link|apple pay|google pay/.test(paymentsText);
  const hasCredentialTransparency =
    clinic.isDoctor === true || hasText(clinic.Practitioners) || hasText(clinic.accreditations) || hasText(clinic.awards);
  const hasGoogleProfile = hasText(clinic.url) && hasText(clinic.gmapsAddress);
  const hasMultipleBranches =
    /multi-location|multiple locations|multiple branch|locations|branches| and also |across/.test(about);

  const visibilityChecks = [
    boolCheck(
      "Social media presence",
      socials.length > 0,
      Math.min(20, socials.length * 4),
      socials.length ? `${socials.length} social channels detected` : "No social channels detected",
      "clinic social fields"
    ),
    boolCheck(
      "Online booking and payment",
      hasOnlineBooking && hasOnlinePayment,
      (hasOnlineBooking ? 10 : 0) + (hasOnlinePayment ? 10 : 0),
      hasOnlineBooking || hasOnlinePayment
        ? "Booking/payment indicators found in website or payment fields"
        : "No clear online booking/payment evidence",
      "website/payments/about"
    ),
    boolCheck(
      "Transparent practitioner credentials",
      hasCredentialTransparency,
      hasCredentialTransparency ? 20 : 0,
      hasCredentialTransparency
        ? "Doctor/credentials/practitioner info publicly present"
        : "Limited credentials visibility",
      "Practitioners/accreditations/awards/isDoctor"
    ),
    boolCheck(
      "Google business profile with directions",
      hasGoogleProfile,
      hasGoogleProfile ? 20 : 0,
      hasGoogleProfile ? "Google Maps URL and address present" : "Missing maps URL/address",
      "url/gmapsAddress"
    ),
    boolCheck(
      "Multiple branches",
      hasMultipleBranches,
      hasMultipleBranches ? 20 : 0,
      hasMultipleBranches ? "Multi-location language detected" : "No clear multi-branch evidence",
      "about_section"
    ),
  ];

  const transparentPricing = hasText(clinic.Fees);
  const treatmentCount = asArray(clinic.Treatments).length;
  const wideVariety = treatmentCount >= 10;
  const hasAftercare =
    /aftercare|follow-up|review/.test(about) ||
    (clinic.weighted_analysis && clinic.weighted_analysis["Post-Care"]?.weighted_score > 0);
  const hasFreeConsult = /free consultation|consultation|telehealth|video consultation|virtual/.test(
    `${about} ${feesText}`
  );

  const feeValue = parseFeeValue(clinic.Fees);
  const competitivePricing =
    feeValue != null && cityFeeMedian != null ? feeValue <= cityFeeMedian * 1.1 : false;

  const pricingChecks = [
    boolCheck(
      "Transparent pricing",
      transparentPricing,
      transparentPricing ? 20 : 0,
      transparentPricing ? "Fee list detected" : "No explicit fee list",
      "Fees"
    ),
    boolCheck(
      "Wide variety of treatments",
      wideVariety,
      Math.min(20, treatmentCount * 2),
      `${treatmentCount} listed treatments`,
      "Treatments"
    ),
    boolCheck(
      "Aftercare",
      hasAftercare,
      hasAftercare ? 20 : 0,
      hasAftercare ? "Aftercare/follow-up evidence found" : "No explicit aftercare evidence",
      "about_section/weighted_analysis"
    ),
    boolCheck(
      "Free consultation and telehealth",
      hasFreeConsult,
      hasFreeConsult ? 20 : 0,
      hasFreeConsult ? "Consultation/telehealth signal found" : "No consultation/telehealth signal",
      "about_section/Fees"
    ),
    boolCheck(
      "Pricing competitive in city",
      competitivePricing,
      competitivePricing ? 20 : feeValue == null || cityFeeMedian == null ? 5 : 0,
      feeValue == null || cityFeeMedian == null
        ? "Insufficient fee data for robust comparison"
        : `Avg fee £${feeValue.toFixed(0)} vs city median £${cityFeeMedian.toFixed(0)}`,
      "Fees + city baseline"
    ),
  ];

  const hasAccred =
    clinic.isCQC?.[0] ||
    clinic.isJCCP?.[0] ||
    clinic.isHIW?.[0] ||
    clinic.isHIS?.[0] ||
    clinic.isRQIA?.[0] ||
    clinic.isSaveFace ||
    hasText(clinic.accreditations) ||
    hasText(clinic.awards);

  const envSignals = asArray(reviewAnalysis.clinic_environment || []);
  const hasAestheticSignal = envSignals.length > 0 || /clean|modern|welcoming|comfortable|luxurious/.test(about);

  const negatives = asArray(reviewAnalysis.negative_keywords || []);
  const rating = Number(clinic.rating || 0);
  const adverseScore = Math.max(0, Math.min(20, Math.round((rating / 5) * 12 + Math.max(0, 8 - negatives.length))));
  const lowAdverseRisk = adverseScore >= 14;

  const hasGovernanceSignal = hasText(clinic.Practitioners) || clinic.isDoctor === true;
  const professionalismSignals = asArray(reviewAnalysis.professionalism_safety || []);
  const hasSafetyLanguage = professionalismSignals.length > 0;

  const safetyChecks = [
    boolCheck(
      "Accreditations / Awards",
      !!hasAccred,
      hasAccred ? 20 : 0,
      hasAccred ? "Regulatory or award indicators found" : "No formal accreditation signal",
      "isCQC/isJCCP/isHIW/isHIS/isRQIA/isSaveFace/accreditations/awards"
    ),
    boolCheck(
      "Location aesthetics",
      hasAestheticSignal,
      hasAestheticSignal ? 20 : 0,
      hasAestheticSignal ? "Environment quality signals found" : "No clear environment quality signal",
      "reviewAnalysis.clinic_environment/about_section"
    ),
    boolCheck(
      "Adverse reviews risk",
      lowAdverseRisk,
      adverseScore,
      `Rating ${rating || 0}/5 with ${negatives.length} negative keyword signals`,
      "rating/reviewAnalysis.negative_keywords"
    ),
    boolCheck(
      "Governance and practitioner transparency",
      hasGovernanceSignal,
      hasGovernanceSignal ? 20 : 0,
      hasGovernanceSignal ? "Practitioner/governance signal found" : "Limited governance signal",
      "Practitioners/isDoctor"
    ),
    boolCheck(
      "Safety language in reviews",
      hasSafetyLanguage,
      hasSafetyLanguage ? 20 : 0,
      hasSafetyLanguage
        ? `${professionalismSignals.length} professionalism/safety mentions`
        : "No professionalism/safety mentions found",
      "reviewAnalysis.professionalism_safety"
    ),
  ];

  const sum = (checks) => checks.reduce((acc, c) => acc + c.score_contribution, 0);
  const visScore = sum(visibilityChecks);
  const pricingScore = sum(pricingChecks);
  const safetyScore = sum(safetyChecks);
  const overallScore = Math.round((visScore + pricingScore + safetyScore) / 3);

  const mentionCount =
    asArray(reviewAnalysis.professionalism_safety).length +
    asArray(reviewAnalysis.treatment_outcomes).length +
    asArray(reviewAnalysis.clinic_environment).length +
    asArray(reviewAnalysis.referrals_recommendations).length;

  const confidence = Math.max(0.35, Math.min(0.97, 0.4 + mentionCount / 200));

  const weightedAnalysis = {
    [PILLARS.visibility]: makeItemMeta(
      visScore,
      confidence,
      visibilityChecks.filter((c) => c.met).length,
      visibilityChecks.filter((c) => c.met).map((c) => c.evidence)
    ),
    [PILLARS.pricing]: makeItemMeta(
      pricingScore,
      confidence,
      pricingChecks.filter((c) => c.met).length,
      pricingChecks.filter((c) => c.met).map((c) => c.evidence)
    ),
    [PILLARS.safety]: makeItemMeta(
      safetyScore,
      confidence,
      safetyChecks.filter((c) => c.met).length,
      safetyChecks.filter((c) => c.met).map((c) => c.evidence)
    ),
    [PILLARS.overall]: makeItemMeta(
      overallScore,
      confidence,
      mentionCount,
      [
        `Visibility ${visScore}/100`,
        `Pricing ${pricingScore}/100`,
        `Safety ${safetyScore}/100`,
      ]
    ),
  };

  const criteriaBreakdown = {
    [PILLARS.visibility]: visibilityChecks,
    [PILLARS.pricing]: pricingChecks,
    [PILLARS.safety]: safetyChecks,
  };

  const unmet = [...visibilityChecks, ...pricingChecks, ...safetyChecks].filter((c) => !c.met);
  const strengths = [...visibilityChecks, ...pricingChecks, ...safetyChecks]
    .filter((c) => c.met)
    .slice(0, 3)
    .map((c) => c.name);

  const advice = {
    strengths,
    gaps: unmet.slice(0, 3).map((c) => c.name),
    priority_actions_30d: unmet.slice(0, 2).map((c) => `Improve: ${c.name}`),
    priority_actions_90d: unmet.slice(2, 5).map((c) => `Implement and monitor: ${c.name}`),
  };

  return {
    weightedAnalysis,
    criteriaBreakdown,
    advice,
    overallScore,
  };
};

const buildCityRanks = (entries) => {
  const byCity = new Map();
  for (const entry of entries) {
    const arr = byCity.get(entry.city) || [];
    arr.push(entry);
    byCity.set(entry.city, arr);
  }

  for (const arr of byCity.values()) {
    arr.sort((a, b) => b.score - a.score);
    arr.forEach((entry, idx) => {
      entry.rank = idx + 1;
      entry.total = arr.length;
    });
  }
};

const clinics = readJson(CLINICS_PATH);
const cityFeeMedians = getCityFeeBaselines(clinics);

const clinicRankRows = [];
for (const clinic of clinics) {
  const city = clinic.City || "Unknown";
  const median = cityFeeMedians.get(city) ?? null;
  const scored = scoreClinic(clinic, median);

  clinic.weighted_analysis = {
    ...(clinic.weighted_analysis || {}),
    ...scored.weightedAnalysis,
  };

  clinic.criteria_breakdown = scored.criteriaBreakdown;
  clinic.advice = scored.advice;

  clinicRankRows.push({
    key: clinic.slug || clinic.practitioner_name || clinic.gmapsAddress || Math.random().toString(36).slice(2),
    city,
    score: scored.overallScore,
    ref: clinic,
  });
}

buildCityRanks(clinicRankRows);

const clinicRankingDataset = clinicRankRows.map((entry) => {
  const ranking = {
    city_rank: entry.rank,
    city_total: entry.total,
    score_out_of_100: entry.score,
    subtitle_text: `${entry.score}/100 in ${entry.city}`,
  };

  entry.ref.ranking = ranking;

  return {
    clinic_id: entry.ref.slug || "",
    clinic_name: entry.ref.slug || entry.ref.gmapsAddress || "",
    city: entry.city,
    analysis_date: today,
    ranking,
    weighted_analysis: {
      [PILLARS.visibility]: entry.ref.weighted_analysis[PILLARS.visibility],
      [PILLARS.pricing]: entry.ref.weighted_analysis[PILLARS.pricing],
      [PILLARS.safety]: entry.ref.weighted_analysis[PILLARS.safety],
      [PILLARS.overall]: entry.ref.weighted_analysis[PILLARS.overall],
    },
    criteria_breakdown: entry.ref.criteria_breakdown,
    advice: entry.ref.advice,
  };
});

const practitioners = readJson(PRACTITIONERS_PATH);
const clinicBySlug = new Map(clinics.map((c) => [c.slug, c]));

const practitionerRows = practitioners.map((p) => {
  let clinicSlug = null;
  try {
    const associated = asArray(p.Associated_Clinics);
    clinicSlug = associated[0] || null;
  } catch {
    clinicSlug = null;
  }

  const clinic = clinicBySlug.get(clinicSlug) || null;
  const city = p.City || clinic?.City || "Unknown";

  const baseOverall =
    clinic?.weighted_analysis?.[PILLARS.overall]?.weighted_score ||
    p.weighted_analysis?.[PILLARS.overall]?.weighted_score ||
    50;

  const qualificationBoost = hasText(p.practitioner_qualifications) ? 3 : 0;
  const experienceBoost = hasText(p.practitioner_experience) ? 2 : 0;
  const overall = Math.max(0, Math.min(100, Math.round(baseOverall + qualificationBoost + experienceBoost - 2)));

  const vis = Math.max(0, Math.min(100, Math.round((clinic?.weighted_analysis?.[PILLARS.visibility]?.weighted_score || 50) + qualificationBoost - 1)));
  const pricing = Math.max(0, Math.min(100, Math.round((clinic?.weighted_analysis?.[PILLARS.pricing]?.weighted_score || 50) - 1)));
  const safety = Math.max(0, Math.min(100, Math.round((clinic?.weighted_analysis?.[PILLARS.safety]?.weighted_score || 50) + experienceBoost)));

  const weighted = {
    [PILLARS.visibility]: makeItemMeta(vis, 0.65, 6, ["Derived from associated clinic and practitioner profile"]),
    [PILLARS.pricing]: makeItemMeta(pricing, 0.62, 5, ["Derived from associated clinic pricing evidence"]),
    [PILLARS.safety]: makeItemMeta(safety, 0.67, 7, ["Derived from clinic safety signals and practitioner credentials"]),
    [PILLARS.overall]: makeItemMeta(overall, 0.66, 18, ["Composite of clinic baseline and practitioner profile completeness"]),
  };

  p.weighted_analysis = {
    ...(p.weighted_analysis || {}),
    ...weighted,
  };

  return {
    key: p.practitioner_name || p.slug || `${clinicSlug || "clinic"}-${Math.random().toString(36).slice(2)}`,
    city,
    score: overall,
    ref: p,
  };
});

buildCityRanks(practitionerRows);

const practitionerRankingDataset = practitionerRows.map((entry) => {
  const ranking = {
    city_rank: entry.rank,
    city_total: entry.total,
    score_out_of_100: entry.score,
    subtitle_text: `${entry.score}/100 in ${entry.city}`,
  };

  entry.ref.ranking = ranking;

  return {
    practitioner_id: entry.ref.practitioner_name || entry.ref.slug || "",
    practitioner_name: entry.ref.practitioner_name || entry.ref.slug || "",
    city: entry.city,
    analysis_date: today,
    ranking,
    weighted_analysis: {
      [PILLARS.visibility]: entry.ref.weighted_analysis[PILLARS.visibility],
      [PILLARS.pricing]: entry.ref.weighted_analysis[PILLARS.pricing],
      [PILLARS.safety]: entry.ref.weighted_analysis[PILLARS.safety],
      [PILLARS.overall]: entry.ref.weighted_analysis[PILLARS.overall],
    },
  };
});

writeJson(OUT_CLINIC_RANKING, clinicRankingDataset);
writeJson(OUT_PRACTITIONER_RANKING, practitionerRankingDataset);
writeJson(CLINICS_PATH, clinics);
writeJson(PRACTITIONERS_PATH, practitioners);

console.log(`Updated clinics: ${clinics.length}`);
console.log(`Updated practitioners: ${practitioners.length}`);
console.log(`Wrote: ${OUT_CLINIC_RANKING}`);
console.log(`Wrote: ${OUT_PRACTITIONER_RANKING}`);
