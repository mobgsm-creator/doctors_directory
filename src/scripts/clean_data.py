import pandas as pd
import json
import textwrap
import re
import ast
import unicodedata
import spacy
import numpy as np

from sklearn.metrics.pairwise import cosine_similarity
CANONICAL_MAP = {
    "Acne": ["Acne And Scarring Treatments",
"Acne Scar Treatment",
"Acne Scarring Treatment",
"Acne Treatment",
"Acne Treatments",
"Acne",
],
"Actinic Keratosis":["Actinic Keratosis (solar Keratosis) Treatment",
"Actinic Keratosis (solar Keratosis)",
"Actinic Keratosis Treatment",
"Actinic Keratosis",
]
,
"Eyes":["Cosmetic Eye Procedure","Under Eye Treatments",
"Under-eye Filler",
],
"Aesthetic Skin Consultation":["Aesthetic Procedure",
"Aesthetic Procedures",
"Aesthetic Skin Consultation",
"Aesthetic Treatment",
"Aesthetic Treatments",
"Aesthetics Work",
"Consultations",
"Cosmetic Dermatology",

"Cosmetic Injectables",
"Cosmetic Procedure",
"Cosmetic Procedures",
"Cosmetic Treatments",
"Skin Treatment",
"Skin Treatments",
"Skincare Advice",
"Skincare Consultation",
"Skincare Routines",
"Skincare Treatments",
"Skincare",
"Skinpen Treatment With Exosomes",

"Skin Care Procedures",
"Skin Care",
"Skin Check",
"Skin Consultation","Skin Problems",
"Skin Rejuvenation",
"Skin Resurfacing",


],
"Aged And Sundamaged Skin Care": ["Aged And Sundamaged Skin Care",
"Aged And Sundamaged Skin Treatment",
"Aged And Sun-damaged Skin Treatment",
"Aged And Sundamaged Skin",
"Aged And Sun-damaged Skin"],
"Alopecia": ["Alopecia (hair Loss)",
"Alopecia Areata (hair Loss) Treatment",
"Alopecia Areata (hair Loss)",
"Alopecia Areata Treatments",
"Alopecia Areata",
"Alopecia Injections",
"Alopecia Treatment",
"Alopecia","Female Pattern Baldness",
],
"Anti Fungal Therapy":["Anti Fungal Therapy",
"Anti-fungal Therapy","Fungal Infection Treatment",
"Fungal Infection"],
"Anti Wrinkle Treatment": ["Anti Wrinkle Treatment",
"Anti-aging Consultation",
"Anti-wrinkle Injections",
"Anti-wrinkle Treatment",
"Anti-wrinkle Treatments",
"Anti-wrinkle",
],
"Aqualyx":["Aqualyx","Aqualyx Injections"],
"B12 Injection":["B12 And Biotin Injection",
"B12 Injection",
"B12 Injections",
"B12 Shot",
],
"Aviclear":["Aviclear","Aviclear Treatment"],
"Basal Cell Carcinoma":["Basal Cell Carcinoma Removal",
"Basal Cell Carcinoma",
"Bbl Laser Treatment",
"Bbl Therapy",
"Bbl",
],
"Bcc Lesions Treatment":["Bcc Lesions Treatment",
"Bcc Removal",
],
"Benign Skin Conditions":["Benign (non-cancerous) Skin Conditions Treatment",
"Benign (non-cancerous) Skin Conditions",
"Benign Skin Conditions",
],
"Birthmarks":["Birthmarks Treatment",
"Birthmarks",
],
"Blistering Disorders":["Blistering Disorders Treatment",
"Blistering Disorders",
],
"Botox":["Botox For Gummy Smile",
"Botox Injection",
"Botox Injections",
"Botox","Toxin Treatment",

],
"Breast Augmentation":["Breast Augmentation",
"Breast Lift",
"Breast Reconstruction",
"Breast Reduction",
],
"Eyebrows And Lashes":["Brow Wax",
"Brows","Eyebrow Taming",
"Eyebrow Tint","Semi-permanent Brows",

"Eyebrow Transplant",
"Eyebrow Treatment","Permanent Eyebrows",

"Eyebrow Treatments",
"Eyebrows And Lashes",
"Eyelash Extensions",
"Combination Brows","Lash Lift And Tint",
"Lash Lift",
"Lash Tint",


],
"Cheek Enhancement":["Cheek And Lower Face Filler",
"Cheek Enhancement",
"Cheek Filler",
"Cheek Fillers",
],
"Chemical Peel":["Chemical Peel",
"Chemical Peels","Peel",
"Peels","Skin Peel",
"Skin Peels",


],
"Chin Enhancement":["Chin Filler",
"Chin Fillers",
"Chin Liposuction",
],
"Contact Dermatitis":["Contact Dermatitis Treatment",
"Contact Dermatitis",
],
"Coolsculpting":["Cool Sculpting",
"Coolsculpting",
],
"Cutaneous Lupus Erythematosus":["Cutaneous Lupus Erythematosus (cle)",
"Cutaneous Lupus Erythematosus",
],
"Cysts Treatment":["Cyst Removal",
"Cysts Removal",
"Cysts Treatment",
"Cysts","Minor Procedures (cyst Removal)",

],
"Dermapen Treatment":["Dermapen Treatment",
"Dermapen",
"Face Dermapen",

],
"Dermatitis Treatment":["Dermatitis Treatment",
"Dermatitis",
],
"Dermatology Treatments":["Dermatological Treatments",
"Dermatology Consultation",
"General Dermatology",
"Genital Dermatology","Paediatric Dermatology",

"Dermatology Treatments",
"Dermatology"],
"Earlobe Reconstruction":["Earlobe Reconstruction",
"Earlobe Repair Surgery",
],
"Eczema Treatment":["Eczema (atopic Dermatitis) Management",
"Eczema (atopic Dermatitis) Treatment",
"Eczema (atopic Dermatitis)",
"Eczema Management",
"Eczema Treatment",
"Eczema",
"Eczema",
],
"Facial Treatments":["Facial Aesthetics","Face Rejuvenation",
"Facelift","Perimenopause Facial","Wellness Facial",

"Skin Storm Facial",

"Facial Aesthetic Treatments",
"Facial Aesthetics",
"Dermatology-grade Facials"
"Facial Hair Growth",
"Facial Micro-needling","Luxury Facial",

"Facial Rejuvenation",
"Facial Revival",
"Facial Slimming",
"Facial Spots Treatment",
"Facial Thread Vein Removal",
"Facial Treatments",
"Facial Vein Treatments","Mini Face Lift",

"Facial Wart Removal",
"Facial","Medi-facial",
"Medik8 Facials",
"Oxygen Facial",
"Facials",
"Fine Lines Treatment",
"Fire And Ice Facial",
"Frown Line Treatments",
"Fusion Facial",
"Glass Skin Facial",
"Glow Facial",
"Hydra Facial","Plasma Facial",

"Hydrafacial","Natural Face Rejuvenation",
"Non-surgical Facelift",
"Hydrafacials",
"Hydro Facial","Ultimate Glow Facial",

"Hydro2facial",
"Hydrofacial",
"Hydrotherapy Facial",
"Instant Glow Facial",
"Illumi Facial",
"Lumafuse Facial","Pro Hydrafacial",
"Profacial",

],
"Hygienist Appointment":["Hygienist Appointment","Hygiene Appointments",
"Hygiene Clean",
"Hygienist Appointment",
"Hygienist Appointments",
"Hygienist Services",
],
"Hyperhidrosis":["Hyperhidrosis (excessive Sweating)",
"Hyperhidrosis Treatment",
"Hyperhidrosis Treatments",
"Hyperhidrosis",
"Hyperpigmentation Treatment",
],
"Fillers":["Dermal Filler",
"Dermal Fillers - Forehead","Skin Fillers",
"Dermal Fillers - Jawline",
"Dermal Fillers - Non-surgical Facelift",
"Dermal Fillers - Radiesse",
"Dermal Fillers",
"Dermal Lip Filler",
"Filler Dissolving",
"Filler Injections","Salmon Dna Gold Facial",
"Filler",
"Fillers",
"Jaw Filler",
"Jaw Line Filler",


],
"Hair Treatments":["Fue Hair Transplant",
"Fue Surgery","Hair Color",
"Hair Coloring",
"Hair Colouring",
"Hair Disorders",
"Hair Laser Removal","Ultraclear Laser Treatment",

"Hair Loss Treatment",
"Hair Loss Treatments",
"Hair Perm",
"Hair Removal",
"Hair Styling",
"Hair Thinning Consultation",
"Hair Transplant",
"Haircut",

"Folliculitis",
],
"Nails":["Gel Manicures",
"Gel Nails","Manicures","Medical Pedicures","Nail Extensions",
"Nail Treatments",
"Paronychia (nail Infection)","Pedicure",
"Pedicures",




],
"Hidradenitis Suppurativa":["Hidradenitis Suppurativa Treatment",
"Hidradenitis Suppurativa",
],
"Hifu":["Hifu Treatment",
"Hifu",
],
"Hives Treatment":["Hives Treatment",
"Hives","Urticaria (hives) Treatment",
"Urticaria (hives)",
"Urticaria Treatment",
"Urticaria",

],
"Massage":["Hot Stone Massage","Indian Head Massage","Massage",
"Massages","Swedish Massage",

],

"Inflammatory Skin Conditions":["Inflammatory Skin Conditions Management",
"Inflammatory Skin Conditions Treatment",
"Inflammatory Skin Conditions",
],

"Ipl Treatment":["Ipl Laser Treatments",
"Ipl Treatment",
"Ipl",
],
"Vitamin Therapy":["Iv Vitamin Therapy",
"Iv Wellness Drip", "Vitamin B12 Injections",
"Vitamin D Injections",
"Vitamin Infusion",
"Vitamin Therapy",
],
"Keloid Removal":["Keloid Removal",
"Keloids",
],
"Tattoo Removal":["Laser Tattoo Removal","Tattoo Removal",],
"Tear-through Treatment":["Tear Trough Filler",
"Tear Trough Fillers",
"Tear-through Treatment",
],
"Threading":["Thread Lift",
"Thread Neck Lift",
"Threading",
"Threads",
],
"Laser Treatments":["Laser Acne Scar Treatment",
"Laser Beauty Treatments",
"Laser For Pigmentation",
"Laser Hair Removal",
"Laser Resurfacing",

"Laser Therapy",
"Laser Treatment For Broken Capillaries",
"Laser Treatment",
"Laser Treatments",
"Laser Vein Surgery",
],
"Lips":["Lip Augmentation",
"Lip Enhancement",
"Lip Filler Dissolve",
"Lip Filler",
"Lip Fillers",
"Lip Flip",
"Lip Injections","Lips",

],
"Liposuction":["Lipo",
"Lipocontrast",
"Liposcution",
],

"Lymphatic Drainage":["Lymphatic Drainage Massage",
"Lymphatic Drainage",
],

"Marionettes":["Marionette Lines",
"Marionettes",
],
"Melanoma Treatment":["Melanoma Management",
"Melanoma Treatment",
"Melanoma","Wide Local Excision For Melanoma",

],
"Melasma Treatment":["Melasma Treatment",
"Melasma",
],
"Micro-Needling":["Micro Needling","Microneedling",
"Micro-needling","Skin Needling",


],
"Microblading":["Microblading Removal",
"Microblading",
],
"Microneedling With Radiofrequency":["Microneedle Radiofrequency",
"Micro-needling Radio-frequency",
"Microneedling With Radiofrequency","Radio Frequency Facial",
"Radio Frequency Micro Needling",
"Radio Frequency",
"Radiofrequency Microneedling",
"Radio-frequency Micro-needling","Rf Microneedling",


],
"Mohs Surgery":["Mohs Surgery",
"Moh's Surgery",
],
"Moles":["Mole And Skin Tag Removal",
"Mole Check",
"Mole Checking",
"Mole Checks",
"Mole Inspection",
"Mole Mapping",
"Mole Removal",
"Mole Removals",
"Mole Scan",
"Moles",
],
"Morpheus 8":["Morpheus 8 Treatment",
"Morpheus 8",
"Morpheus8 Treatments",
    ],
"Rhinoplasty":["Non Surgical Rhinoplasty","Rhinoplasty",
"Non-surgical Rhinoplasty",
],
"Obagi":["Obagi Blue Peel Radiance",
"Obagi Medical Grade Skincare",
"Obagi Skin Peels",
"Obagi Treatment",
],
"Patch Testing":["Patch Testing","Patch Test",
],
"Pdt Therapy":["Pdl",
"Pdt Therapy",
"Pdt Treatment",
],
"Photodynamic Therapy (pdt)":["Photodynamic Therapy (pdt)",
"Photodynamic Therapy",
],
"Pigmentation Treatment":["Pigmentation Removal",
"Pigmentation Treatment","Redness And Pigmentation Treatment",
],
"Platelet Rich Plasma":["Platelet Rich Plasma",
"Platelet-rich Plasma (prp) Treatments For Hair Restoration",
"Platelet-rich Plasma (prp) Treatments",
"Platelet-rich Plasma (prp)","Prp Facial","Rf Facials",

"Prp Injection",
"Prp Microneedling",
"Prp Treatment",
"Prp Treatments",
"Prp Vampire Facial",
"Prp",

],
"Polynucleotide Treatment":["Polymyositis And Dermatomyositis",
"Polynucleotide Injections",
"Polynucleotide Treatment",
"Polynucleotides Treatment",
"Polynucleotides",
],
"Profhilo":["Profhilo Treatment",
"Profhilo Treatments",
"Profhilo",
"Profilo Plastica",
"Profilo","Prophilo",

],
"Psoriasis":["Psoriasis Treatment",
"Psoriasis",
],
"Rash Treatment":["Rash Treatment",
"Rash",
],
"Rosacea Treatment":["Rosacea Management",
"Rosacea Treatment",
"Rosacea",
],
"Scarring":["Scar Reduction",
"Scar Treatment",
"Scarring Alopecias",
"Scarring Treatment",
"Scarring",
],
"Seborrheic Keratosis Treatment":["Seborrheic Keratosis Removal",
"Seborrheic Keratosis Treatment",
"Seborrheic Keratosis",
],
"Seborrhoeic Dermatitis":["Seborrhoeic Dermatitis Treatment",
"Seborrhoeic Dermatitis",
"Seborrhoeic Keratosis Treatment",
],
"Skin Booster":["Skin Booster Treatment",
"Skin Booster",
"Skin Boosters",
],
"Skin Cancer":["Skin Cancer Check",
"Skin Cancer Screening",
"Skin Cancer Screenings",
"Skin Cancer Surgery",
"Skin Cancer Treatment",
"Skin Cancer",
],
"Skin Lesions":["Skin Lesion Removal (warts, Moles And Skin Tags)",
"Skin Lesion Removal",
"Skin Lesion Treatments","Legion Excision",

],
"Skin Tags":["Skin Tag Removal",
"Skin Tags Removal","Skintag Removal",

"Skin Tags",
],
"Skin Texture And Tightening":["Skin Texture And Tightening",
"Skin Tightening",
],
"Squamous Cell Carcinoma":["Squamous Cell Carcinoma (scc)",
"Squamous Cell Carcinoma Removal",
"Squamous Cell Carcinoma",
],
"Varicose Vein Procedure":["Varicose Vein Procedure",
"Varicose Vein Removal",
"Varicose Veins",
]
,
"Verruca Treatment":["Verruca Removal",
"Verruca Treatment",
"Verruca","Wart Removal",
"Wart Treatment",
"Warts (viral) Treatment",
"Warts (viral)",
"Warts Removal",
"Warts Treatment",
],
"Vulval Dermatology":["Vulval Cancer",
"Vulval Dermatology",
"Vulvodynia",
],
"Weight Loss":["Weight Loss Injections",
"Weight Loss",
"Weight Management",
]

}
REVERSE_LOOKUP = {
    variant: canonical
    for canonical, variants in CANONICAL_MAP.items()
    for variant in variants
}
df_p = pd.read_json(r'C:\Users\agney\Documents\Files\Projects\doctor-directory\public\clinics_processed_new.json')
df_p.to_csv("test.csv")
time.sleep(1000)
# df=pd.read_csv(r"C:\Users\agney\Documents\Files\Projects\doctor-directory\test_cleaned.csv")

# df2 = pd.read_excel(r"C:\Users\agney\Downloads\5600_UK_slug_search_results_2k_.xlsx",sheet_name='exists')
# print(df_p.columns,df2.columns)
# df = pd.merge(df_p,df2[['url','json_response']],on='url',how='left')
# df.to_csv("test.csv")
# time.sleep(1000)
# df = pd.read_csv(r"C:\Users\agney\Documents\Files\Projects\doctor-directory\test.csv")
count = 0
unique_treatments = set()
REVERSE_LOOKUP = {
    k.lower(): v.lower()
    for k, v in REVERSE_LOOKUP.items()
}
error_strings = set()


# for index,row in df.iterrows():
#     treatments = set()
#     try:
#         for key in REVERSE_LOOKUP.keys():
#             if key.lower() in row['json_response'].lower():
#                 treatments.add(key)
#         df.at[index,'Treatments'] = json.dumps(list(treatments))
#     except Exception as e:
#         print(e)
#         pass


# # time.sleep(1000)
# for index,row in df.iterrows():
#     try:

#         categories = json.loads(row['Treatments'])
#         normalized = list(set([REVERSE_LOOKUP[cat] for cat in categories]))
#         df.at[index,'Treatments_normalized'] = json.dumps(normalized)
#         unique_treatments.update(normalized)

#     except Exception as e:
#         print(e)
#         count+=1
#         pass
# print(count)
# print(len(CANONICAL_MAP.keys()))
# print(unique_treatments)
# df.to_csv("test_treatmentss.csv")
# print(error_strings)
# time.sleep(1000)
# #df = pd.read_json(r'C:\Users\agney\Documents\Files\Projects\doctor-directory\public\clinics_processed.json')
# df= pd.read_excel(r"C:\Users\agney\Documents\Files\Projects\clinics_processed.xlsx")
# values = set()
# bl = ['Monday', 'Sat', 'Tue', 'Thu', 'Fri', 'Mon-Fri', 'Sun', 'SourceNote', 'Sat-Sun', 'Mon', 'Wed', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Source','Typical_hours_recorded_in_public_listings', 'Notes', 'Note']
# for index,row in df.iterrows():
#     try:
#         loaded_json = json.loads(row['hours'].replace("'",'"'))
#         if len(loaded_json.keys() - bl)>=3:
#                 print(index, loaded_json.keys() - bl)
#                 df.at[index,'error']=1
#     except Exception as e:
#         #df.at[index,'error']=1
#         pass
# df.to_csv("test2.csv")
# time.sleep(100)
nlp = spacy.load("en_core_web_lg")

def dedupe_similar_strings(strings, threshold=0.88):
    """Return list indices to remove based on spaCy semantic similarity."""
    if not strings or len(strings) < 2:
        return []

    # Compute vectors for each string
    vectors = []
    for s in strings:
        doc = nlp(s)
        if doc.has_vector:
            vectors.append(doc.vector)
        else:
            # Fallback to zero vector if no vector exists
            vectors.append(np.zeros((nlp.vocab.vectors_length,), dtype="float32"))

    vectors = np.array(vectors)

    # Deduplicate by comparing to already-kept vectors
    keep = []
    for i in range(len(strings)):
        if not keep:
            keep.append(i)
            continue

        sims = cosine_similarity([vectors[i]], [vectors[k] for k in keep])[0]
        if max(sims) < threshold:
            keep.append(i)

    all_idx = list(range(len(strings)))
    reject = [i for i in all_idx if i not in keep]
    return reject


# #Repetitions in practitioner about section
# #Build errors SSG
# #Data transform errors


#Fix practioner_names and slugs sort by length (/)
patterns = {
    "x_twitter": r"(https?://(?:www\.)?(?:x\.com|twitter\.com)/[A-Za-z0-9_/?=&\.-]+)",
    "facebook": r"(https?://(?:www\.)?facebook\.com/[A-Za-z0-9_/?=&\.-]+)",
    "instagram": r"(https?://(?:www\.)?instagram\.com/[A-Za-z0-9_/?=&\.-]+)",
    "youtube": r"(https?://(?:www\.)?(?:youtube\.com|youtu\.be)/[A-Za-z0-9_/?=&\.-]+)",
    "linkedin": r"(https?://(?:www\.)?linkedin\.com/[A-Za-z0-9_/?=&\.-]+)",
    "website": r"(https?://[A-Za-z0-9_\-\.]+\.[A-Za-z]{2,}(?:/[^\s]*)?)",
    "email": r"([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})",
    "cqc": r"(https?://(?:www\.)?(?:cqc\.org\.uk)/location/[A-Za-z0-9_/?=&\.-]+)",
    "hiw": r"(https?://(?:www\.)?(?:hiw\.org\.uk)/[A-Za-z0-9_/?=&\.-]+)",
    "his": r"(https?://(?:www\.)?(?:healthcareimprovementscotland\.scot)/[A-Za-z0-9_/?=&\.-]+)",
    "rqia": r"(https?://(?:www\.)?(?:rqia\.org\.uk)(?:/[^\s]*)?)"
}
df_clinics = pd.read_excel(r"C:\Users\agney\Downloads\5600_UK_slug_search_results_2k_.xlsx",sheet_name='exists')
df_practitioners = pd.read_csv(
    r"C:\Users\agney\Downloads\Practitioners_8k.csv",
    encoding="latin-1",
    engine="c",
    on_bad_lines="warn"  # pandas 1.3+ (for 1.2 use: error_bad_lines=False)
)

def parse_accreditations(accreditations):
    result = ""
    try:
        if type(accreditations) == list:
            result = str(accreditations)
        elif type(accreditations) == dict:
            result="".join([key+": "+accreditations[key]+"\n" for key in accreditations.keys()])
        elif type(accreditations) == str:
            result="\nAccreditations: "+accreditations
    except Exception as e:
        pass
    return result


def enrich_data(df):
    for index,row in df.iterrows():
        
    
        try:
            laoded_json = json.loads(row['json_response'])
            data_dict=json.loads(re.sub(r':contentReference\[oaicite:\d+\]\{index=\d+\}', '', laoded_json))
            try:
                about_section=data_dict['ABOUT']
            except Exception as e:
                pass
            try:
                accreditiations = parse_accreditations(data_dict['ACCREDITATIONS'])
            except Exception as e:
                pass
            try:
                awards=parse_accreditations(data_dict['AWARDS'])
            except Exception as e:
                pass
            try:
                affiliations=parse_accreditations(data_dict['AFFILIATIONS'])
            except Exception as e:
                pass
            # try:
            #     compliance_section=data_dict['REGULATORY_BODY']+"".join([key+": "+data_dict['CQC_OR_EQUIVALENT_REPORT'][key]+"\n" for key in data_dict['CQC_OR_EQUIVALENT_REPORT'].keys()])
            # except Exception as e:
            #     print("Compliance section Exception",e)
            #     print(data_dict['CQC_OR_EQUIVALENT_REPORT'])
            #     pass
            hours = data_dict['HOURS']
            try:
                found = re.findall(patterns['facebook'], data_dict['SOCIAL_MEDIA']['Facebook'])
                df.at[index,'facebook']=found[0] if found else None
            except Exception as e:
                df.at[index,'facebook']=None

                pass
            try:
                found = re.findall(patterns['x_twitter'], data_dict['SOCIAL_MEDIA']['Twitter'])
                df.at[index,'x_twitter']=found[0] if found else None

            except Exception as e:
                df.at[index,'twitter']=None
                pass
            try:
                found = re.findall(patterns['linkedin'], data_dict['SOCIAL_MEDIA']['LinkedIn'])
                df.at[index,'Linkedin']=found[0] if found else None
            except Exception as e:
                for item in data_dict["PRACTITIONERS"]:
                    try:
                        if item['LinkedinURL'].startswith('https://'):
                            found = re.findall(patterns['linkedin'], data_dict['SOCIAL_MEDIA']['LinkedIn'])
                            df.at[index,'Linkedin']=found[0] if found else None
                            break
                    except Exception as e:
                        df.at[index,'Linkedin']=None
                        pass
                pass
            try:
                found = re.findall(patterns['instagram'], data_dict['SOCIAL_MEDIA']['Instagram'])
                df.at[index,'instagram']=found[0] if found else None
            except Exception as e:
                df.at[index,'instagram']=None
                pass

            
            try:
                found = re.findall(patterns['instagram'], data_dict['SOCIAL_MEDIA']['YouTube'])
                df.at[index,'instagram']=found[0] if found else None
            except Exception as e:
                df.at[index,'youtube']=None
                pass
            try:
                found = re.findall(patterns['website'], data_dict['SOCIAL_MEDIA']['Website'])
                df.at[index,'website']=found[0] if found else None
            except Exception as e: 
                try:
                    found = re.findall(patterns['website'], data_dict['SOURCE_LINKS'][0])
                    df.at[index,'website']=found[0] if found else None
                except Exception as e:
                    df.at[index,'website']=None
                    pass

                pass
                
            try:
                found = re.findall(patterns['email'], data_dict['CONTACT']['Email'])
                df.at[index,'email']=found[0] if found else None
            except Exception as e:
                df.at[index,'email']=None
                pass
            
            try:
                save_face = json.dumps(data_dict['ACCREDITATIONS']).lower()
                isSaveFace=False
                if "save face" in save_face or "saveface" in save_face:
                    isSaveFace=True
                df.at[index,'isSaveFace']=isSaveFace
            except Exception as e:
                pass
            
            try:
                qualification_keywords = [
                    "MBBS", "MBCHB", "MRCGP", "PGDIP", "GMC", "NMC", 
                    "DOCTOR", "DERMATOLOGY", "MEDICAL", "CLINICAL", "REGISTERED NURSE"]
                # Convert practitioner data to lowercase string
                practitioners_text = json.dumps(data_dict['PRACTITIONERS']).lower()
                
                # Check if any keyword appears in the text
                isDoctor = any(keyword.lower() in practitioners_text for keyword in qualification_keywords)
                df.at[index,'isDoctor']=isDoctor
            except Exception as e:
                pass
            
            try:
                #https://www.rqia.org.uk/RQIA/media/CareServices
                isCQC=[False,""]
                isHIW=[False,""]
                isHIS=[False,""]
                isJCCP=[False,""]
                isRQIA=[False,""]
                compliance_test = json.dumps(data_dict).lower() 

                if "https://www.cqc.org.uk/location" in compliance_test:
                    found = re.findall(patterns['cqc'], compliance_test)
                    isCQC=[True, found[0] if found else None]
                try:
                    if "https://www.hiw.org.uk/" in compliance_test:
                        found = re.findall(patterns['hiw'], compliance_test)
                        value = found[0].replace("//","/").replace(".","") if found else None
                        if len(value.split("/"))==2:
                            isHIW=[True, value]

                        isHIW=[True, found[0] if found else None]
                except Exception as e:
                    pass
                if "https://www.healthcareimprovementscotland.scot/" in compliance_test:
                    found = re.findall(patterns['his'], compliance_test)
                    value = found[0] if found else None
                    if "services" in value:
                        isHIS=[True, value]
                if "jccp" in compliance_test:
                    isJCCP=[True, ""]

                if "https://www.rqia.org.uk" in compliance_test:
                    found = re.findall(patterns['rqia'], compliance_test)
                    isRQIA=[True, found[0] if found else None]
                df.at[index, 'isJCCP']=json.dumps(isJCCP).replace("\\","").replace(',"]',"]").replace('},"]',"]").replace('}]',"]").replace("]]","]")
                df.at[index,'isCQC']=json.dumps(isCQC).replace("\\","").replace(',"]',"]").replace('},"]',"]").replace('}]',"]").replace("]]","]")
                df.at[index,'isHIW']=json.dumps(isHIW).replace("\\","").replace(',"]',"]").replace('},"]',"]").replace('}]',"]").replace("]]","]")
                df.at[index,'isHIS']=json.dumps(isHIS).replace("\\","").replace(',"]',"]").replace('},"]',"]").replace('}]',"]").replace("]]","]")
                df.at[index,'isRQIA']=json.dumps(isRQIA).replace("\\","").replace(',"]',"]").replace('},"]',"]").replace('}]',"]").replace("]]","]")
            except Exception as e:
                print("ere",e)
                pass

            try:

                try:
                    df.at[index, 'about_section'] = about_section
                except Exception as e:
                    print(f"Error assigning about_section at {index}: {e}")

                try:
                    df.at[index, 'accreditations'] = accreditiations
                except Exception as e:
                    print(f"Error assigning accreditations at {index}: {e}")

                try:
                    df.at[index, 'awards'] = awards
                except Exception as e:
                    #print(f"Error assigning awards at {index}: {e}")
                    pass

                try:
                    df.at[index, 'affiliations'] = affiliations
                except Exception as e:
                    #print(f"Error assigning affiliations at {index}: {e}")
                    pass

                try:
                    df.at[index, 'hours'] = json.dumps(hours)
                except Exception as e:
                    print(f"Error assigning hours at {index}: {e}")

                try:
                    df.at[index, 'Practitioners'] = json.dumps(data_dict['PRACTITIONERS'])
                except Exception as e:
                    print(f"Error assigning Practitioners at {index}: {e}")

                try:
                    df.at[index, 'Insurace'] = json.dumps(data_dict['INSURANCE_ACCEPTED'])
                except Exception as e:
                    print(f"Error assigning Insurace at {index}: {e}")

                try:
                    df.at[index, 'Payments'] = json.dumps(data_dict['PAYMENT_OPTIONS'])
                except Exception as e:
                    print(f"Error assigning Payments at {index}: {e}")

                try:
                    df.at[index, 'Fees'] = json.dumps(data_dict['ESTIMATED_FEES'])
                except Exception as e:
                    print(f"Error assigning Fees at {index}: {e}")

                try:
                    df.at[index, 'Fees'] = json.dumps(data_dict['ESTIMATED_FEES'])
                except Exception as e:
                    print(f"Error assigning Fees at {index}: {e}")

            except Exception as e:
                print(e)
                pass
            
            
                    
                    
                            #for key in data_dict.keys():
                #print(key,data_dict[key],"\n\n----------------------------\n\n")
                
                #Check if CQC is present in ACCREDITATIONS and /location link available in either source_links or  CQC_OR_EQUIVALENT_REPORT
                #Check if practitioners have propper qualifications

                        # if key=='EDUCATION':
                #     df.at[index,key]=data_dict[key][0]['Institution']
                # else:

                #     try:
                #         df.at[index,key]=data_dict[key].split(":contentReference")[0]
                #     except Exception as e:
                #         df.at[index,key]=json.dumps(data_dict[key]).split(":contentReference")[0]
        except json.JSONDecodeError as e:
            # Print and write debug info to a file
            error_info = (
                f"{index}❌ JSON Decode Error:\n"
                f"Message: {e.msg}\n"
                f"Line: {e.lineno}, Column: {e.colno}, Char index: {e.pos}\n\n"
            )
            print(error_info)
    
            

            # # # Write the error info to file
            # with open(f"json_error_debug_{index}.txt", "w", encoding="utf-8") as f:
            #     f.write(e.doc)
            
            # print("JSON error details written to json_error_debug.txt")
            # print(f"\n{error_info}")
            pass
        try:
            loaded_json = json.loads(row['json_response_'])
            data_dict=json.loads(re.sub(r':contentReference\[oaicite:\d+\]\{index=\d+\}', '', loaded_json))
            # Roles
            try:
                roles = parse_accreditations(data_dict['Roles_And_Positions'])
                roles = ast.literal_eval(roles)
            except Exception as e:
                print(f"[WARN] Roles_And_Positions failed at index {index}: {e}")
            
            # Qualifications
            try:
                qualifications = parse_accreditations(data_dict['Qualifications_And_Professional_Affiliations'])
                qualifications = ast.literal_eval(qualifications)
            except Exception as e:
                print(f"[WARN] Qualifications failed at index {index}: {e}")

            # Awards
            try:
                awards = parse_accreditations(data_dict['Awards_And_Recognition'])
                awards = ast.literal_eval(awards)
            except Exception as e:
                print(f"[WARN] Awards failed at index {index}: {e}")

            # Media / News
            try:
                news = parse_accreditations(data_dict['Media_And_News_Features'])
                news = ast.literal_eval(news)
            except Exception as e:
                print(f"[WARN] Media_And_News_Features failed at index {index}: {e}")

            # Experience
            try:
                exp = parse_accreditations(data_dict['Experience_And_Practice_Profile'])
                exp = ast.literal_eval(exp)
            except Exception as e:
                print(f"[WARN] Experience failed at index {index}: {e}")

            # Image link (no parsing)
            try:
                img = data_dict['image_link']
                df.at[index, 'practitioner_image_link'] = img
            except Exception as e:
                print(f"[WARN] image_link assignment failed at index {index}: {e}")

            try:
                name = data_dict['Practitioner_Name']
                df.at[index, 'Practitioner_Name'] = name.split("(")[0]
            except Exception as e:
                print(f"[WARN] name assignment failed at index {index}: {e}")
        
            # ----- YOUR DATA SECTIONS -----
            all_strings = roles + qualifications + awards + news + exp

            # Calculate boundaries
            b0 = len(roles)
            b1 = b0 + len(qualifications)
            b2 = b1 + len(awards)
            b3 = b2 + len(news)
            b4 = b3 + len(exp)

            # Get indices to remove
            reject = dedupe_similar_strings(all_strings, 0.88)

            # Sort in reverse BEFORE deletion to prevent index shifting bugs
            reject.sort(reverse=True)
            #print("Before:",len(roles), len(qualifications), len(awards), len(news), len(exp))
            
            # Remove from original lists based on section boundaries
            for i in reject:
                try:
                    if i < b0:
                
                        del roles[i]

                    elif b0 <= i < b1:
                  
                        del qualifications[i - b0]

                    elif b1 <= i < b2:
           
                        del awards[i - b1]

                    elif b2 <= i < b3:
                
                        del news[i - b2]

                    elif b3 <= i < b4:
                     
                        del exp[i - b3]

                except Exception as e:
                    print(f"[WARN] Failed removing duplicate index {i}: {e}")
           # print("After:",len(roles), len(qualifications), len(awards), len(news), len(exp))
            try:
                df.at[index, 'Roles_And_Positions'] = json.dumps(roles)
                df.at[index, 'Qualifications_And_Professional_Affiliations'] = json.dumps(qualifications)
                df.at[index, 'Awards_And_Recognition'] = json.dumps(awards)
                df.at[index, 'Media_And_News_Features'] = json.dumps(news)
                df.at[index, 'Experience_And_Practice_Profile'] = json.dumps(exp)
            except Exception as e:
                pass
            
        except Exception as e:
            print(f"[WARN] Exception at index {index}: {e}")
            pass
        treatments = set()
        try:
            for key in REVERSE_LOOKUP.keys():
                if key.lower() in row['json_response'].lower():
                    treatments.add(key)
            df.at[index,'Treatments'] = json.dumps(list(treatments))
        
        except Exception as e:
            print("Reverse Lookup Error",e)
            pass
        try:

            categories = list(treatments)
            normalized = list(set([REVERSE_LOOKUP[cat] for cat in categories]))
            
            df.at[index,'Treatments_normalized'] = json.dumps(normalized)
            
        except Exception as e:
            print(e)
            pass
    print(df.columns)
    return df

df_clinics = enrich_data(df_clinics)
df_practitioners = enrich_data(df_practitioners)
df_practitioners.to_csv("test2_pract.csv")  
df_clinics.to_csv("test2_clinics.csv")
    

#slugs brackets)