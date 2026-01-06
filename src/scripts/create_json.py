# generate_devices_json.py
import pandas as pd
from urllib.parse import unquote_plus
import json
import time
import numpy as np
import unicodedata
import re
from datetime import datetime
import codecs, re
from urllib.parse import urlparse
import ast
from fuzzywuzzy import fuzz
from sentence_transformers import SentenceTransformer

from sklearn.metrics.pairwise import cosine_similarity
model = SentenceTransformer("all-MiniLM-L6-v2")
CANONICAL_MAP = {

}

# categories = ['Accessory / everyday tool', 'Active Ingredient / Cosmetic Peptide', 
#               'Aesthetic & Dermatology Equipment', 'Aesthetic & Medical Accessories', 
#               'Aesthetic & Medical Devices', 'Aesthetic & Skincare', 
#               'Aesthetic & Skincare Devices', 'Aesthetic & dermatology devices', 
#               'Aesthetic & dermatology products', 'Aesthetic / Body\\u2011contouring Injectable',
#                 'Aesthetic / Combination Treatment Bundle', 'Aesthetic / Cosmetic Bundle', 
#                 'Aesthetic / Dermal Filler', 'Aesthetic / Dermal Filler / Skin Booster', 
#                 'Aesthetic / Dermatology Injectable', 'Aesthetic / Dermatology Product', 
#                 'Aesthetic / Dermatology injectable (mesotherapy / filler)', 
#                 'Aesthetic / Dermatology treatment accessory', 'Aesthetic / Injectable', 
#                 'Aesthetic / Medical Device', 'Aesthetic / Mesotherapy',
#                 'Aesthetic / Skin\\u2011booster Injectable', 'Aesthetic / cosmetic injectable',
#                 'Aesthetic / dermatology treatment product', 'Aesthetic Device', 
#                 'Aesthetic Equipment', 'Aesthetic Injectable / Dermal Filler', 'Aesthetic Injectable / Mesotherapy Solution', 
#                 'Aesthetic Injectable / Skin Booster', 'Aesthetic Injectable / Skin-Booster', 
#                 'Aesthetic Injectable \\u2013 Lipolytic Solution', 'Aesthetic Injectables', 
#                 'Aesthetic Intimate Care', 'Aesthetic LED light therapy device', 
#               'Aesthetic Laser Equipment', 'Aesthetic Medical Device', 'Aesthetic Medical Equipment',
#                 'Aesthetic Medicine', 'Aesthetic Medicine Devices', 'Aesthetic Medicine Products',
#                   'Aesthetic Medicine \\u2013 Body Dermal Filler', 'Aesthetic Pigments',
#                     'Aesthetic Product', 'Aesthetic Products', 'Aesthetic Skin Booster', 
#                     'Aesthetic Tools', 'Aesthetic Training Tools', 'Aesthetic Treatment', 
#                     'Aesthetic Treatments', 'Aesthetic clinic consumables',
#                       'Aesthetic consumable / medical device', 
#                       'Aesthetic consumable / medical device accessory', 'Aesthetic consumables', 
#                       'Aesthetic consumables / tools', 'Aesthetic consumables / training supplies',
#                         'Aesthetic dermatology', 'Aesthetic dermatology / mesotherapy solution',
#                           'Aesthetic gynaecology injectable', 'Aesthetic injectable', 
#                           'Aesthetic injectable / dermal filler', 'Aesthetic injectable / skin booster',
#                             'Aesthetic injectables', 'Aesthetic injectables and clinic consumables bundle',
#                               'Aesthetic lip treatment', 'Aesthetic medical device',
#                                 'Aesthetic medical device \\u2013 PLCL tensioning thread',
#                                   'Aesthetic medical laser device', 'Aesthetic medicine',
#                                     'Aesthetic medicine / IV therapy', 'Aesthetic medicine / dermal filler',
#                                       'Aesthetic medicine / mesotherapy', 'Aesthetic medicine \\u2013 dermal fillers',
#                                         'Aesthetic medicine \\u2013 threads', 'Aesthetic medicine injectable',
#                                           'Aesthetic medicine injectable (dermal filler / medical device)',
#                                             'Aesthetic medicine injectable (medical device)',
#                                             'Aesthetic mesotherapy / skin booster', 'Aesthetic skincare',
#                                               'Aesthetic skincare product', 'Aesthetic supplies / medical accessories', 
#                                               'Aesthetic training / injectable treatment', 'Aesthetic training kit',
#                                                 'Aesthetic treatment / Skin boosters bundle', 'Aesthetic/Mesotherapy Injectable', 
#                                                 'Aesthetic/Permanent makeup pigment', 'Aesthetic/dermal treatment product',
#                                                   'Aesthetics', 'Aesthetics / Dermal Filler', 'Aftercare', 'Airway Clearance',
#                                                     'Airway management device', 'Anti-aging / eye care skincare', 
#                                                     'Anti-aging skincare / corrective cream', 'Anti-cellulite apparel / compression legwear', 
#                                                     'Anti-cellulite legwear', 'Antimicrobial skin cleanser', 'Antimicrobial skin disinfectant', 
#                                                     'Antimicrobial wipes', 'Antioxidant / Anti-ageing', 'Apparel', 'At-home diagnostic test', 
#                                                     'At-home facial peel', 'Baby wipes', 'Barrier cream / skin protectant', 'Beauty Device',
#                                                       'Beauty device', 'Beauty equipment accessory', 'Beauty tools & accessories', 'Bio-remodelling injectable', 
#                                                       'Biomodulator', 'Biorevitalization', 'Biostimulator / Injectable Collagen', 'Biostimulator / Mesotherapy',
#                                                         'Blood Collection', 'Blood Pressure Accessories', 'Blood Pressure Equipment & Accessories', 
#                                                         'Blood Pressure Monitoring Accessories', 'Blood pressure accessories', 'Blood pressure accessories & parts',
#                                                           'Blood pressure measurement device', 'Blood pressure monitoring equipment', 'Body care / Professional aesthetic treatment',
#                                                             'Body care / anti-cellulite cream', 'Body contouring device', 'Body dermal filler', 
#                                                             'Body filler', 'Botulinum toxin (neurotoxin) injectable \\u2013 prescription-only medicine', 
#                                                             'Botulinum toxin type A biological medicine (prescription-only neuromodulator; Botulax brand unlicensed in the UK and US)', 'Botulinum toxin type A neuromodulator', 'Burn treatment and cold therapy', 'CE-marked hyaluronic acid dermal filler (medical device)', 'Cannulae / Needles / Syringes', 'Cannulae/Needles/Syringes', 'Capillary blood collection tube', 'Capnography and gas sampling accessories', 'Cardiology diagnostic accessory', 'Cardiology diagnostic software', 'Chemical Peels', 'Chemical peel', 'Chemical peel / bio-revitalisation medical device', 'Chemical peel / medical device', 'Chemical peel neutralising solution', 'Chemical peel neutralizer', 'Chemical peel preparation solution', 'Chemical peels', 'Cleaning & Disinfection', 'Cleaning & Maintenance', 'Cleaning and Hygiene', 'Cleanser', 'Cleansing / shower gel', 'Clinic Consumables', 'Clinic Essentials', 'Clinic and salon furniture', 'Clinic consumable / sterile dressing pack', 'Clinic consumables', 'Clinic consumables \\u2013 sterile surgical drape', 'Clinic essentials', 'Clinic promotional display', 'Clinic supplies & patient materials', 'Clinical Seating', 'Clinical Thermometers', 'Clinical Training Models & Simulators', 'Clinical Waste Disposal', 'Clinical consumable \\u2013 reusable tray', 'Clinical furniture accessory', 'Clinical seating \\u2013 bariatric patient armchair', 'Clinical transport containers / specimen transport', 'Clinical waste containers', 'Clinical waste management / transport containers', 'Clinical waste management and transport', 'Clothing & Footwear', 'Clothing & Scrubs', 'Clothing & Scrubs \\u2013 Workwear', 'Clothing & Scrubs \\u2013 respiratory protective equipment (RPE)', 'Clothing & Workwear', 'Clothing / Footwear', 'Cold & Hot Therapy', 'Cold Chain & Vaccine Transport Accessories', 'Cold Therapy', 'Cold and hot therapy', 'Cold therapy', 'Cold therapy device', 'Cold therapy pack', 'Cold therapy patch', 'Cold therapy spray', 'Collagen biostimulator / dermal filler', 'Collagen biostimulator \\u2013 injectable implant', 'Collagen biostimulator filler', 'Consumable / Protective apparel', 'Consumables', 'Consumables & Equipment', 'Consumables & equipment', 'Cosmeceutical', 'Cosmeceutical Skincare', 'Cosmeceutical anti-ageing skincare', 'Cosmeceutical anti-ageing treatment', 'Cosmeceutical exfoliating skincare', 'Cosmeceutical lip care', 'Cosmeceutical post-treatment aftercare cream', 'Cosmeceutical skincare', 'Cosmeceuticals / Facial skincare', 'Cosmetic / Aesthetic Skin Treatment', 'Cosmetic / Aesthetic skincare', 'Cosmetic / Dermocosmetic \\u2014 eye care', 'Cosmetic / Dermocosmetic \\u2014 facial cleanser', 'Cosmetic / Dermocosmetic \\u2014 facial serum', 'Cosmetic / Dermocosmetic \\u2014 lip care', 'Cosmetic / Dermocosmetic \\u2014 lip care balm', 'Cosmetic / Dermocosmetic \\u2014 night resurfacing cream', 'Cosmetic / Dermocosmetic \\u2014 post-procedure aftercare fluid', 'Cosmetic / Dermocosmetic \\u2014 post-procedure soothing fluid', 'Cosmetic / Dermocosmetic \\u2014 soothing and repair balm', 'Cosmetic / Dermocosmetic \\u2014 sunscreen', 'Cosmetic / Eye Care', 'Cosmetic / Eyelash and eyebrow enhancer', 'Cosmetic / Mesotherapy solution', 'Cosmetic / Permanent Makeup Accessory', 'Cosmetic / Permanent Makeup Pigments', 'Cosmetic / Permanent makeup supplies', 'Cosmetic / Skin Care Ingredients', 'Cosmetic / Skincare', 'Cosmetic / Skincare product', 'Cosmetic / Skincare set', 'Cosmetic / dermocosmetic product', 'Cosmetic / research peptide active for skin tone regulation (not a licensed medicinal product)', 'Cosmetic / skincare product', 'Cosmetic / wellness accessory \\u2014 cooling eye mask / compress', 'Cosmetic Care', 'Cosmetic Device', 'Cosmetic Rejuvenation System', 'Cosmetic Skin Care', 'Cosmetic Skincare', 'Cosmetic Skincare Product', 'Cosmetic \\u2013 foundation / corrective makeup', 'Cosmetic active ingredient \\u2013 anti-ageing peptide', 'Cosmetic body filler kit', 'Cosmetic coloured contact lenses', 'Cosmetic daily leave-on face peel', 'Cosmetic dermatology', 'Cosmetic dermocosmetic anti-aging night cream', 'Cosmetic dermocosmetic antioxidant facial serum', 'Cosmetic eye contour care', 'Cosmetic eyebrow makeup', 'Cosmetic eyebrow serum', 'Cosmetic facial cleanser (cosmeceutical skincare product)', 'Cosmetic lip booster serum', 'Cosmetic lip care', 'Cosmetic makeup', 'Cosmetic product / Skin care mask', 'Cosmetic skincare', 'Cosmetic skincare \\u2013 face mask', 'Cosmetic skincare \\u2013 facial mask', 'Cosmetic skincare \\u2013 lip mask', 'Cosmetic skincare \\u2013 serum/ampoule', 'Cosmetic skincare \\u2013 targeted body treatment', 'Cosmetic skincare \\u2014 sheet/face mask', 'Cosmetic skincare mask', 'Cosmetic skincare product', 'Cosmetic skincare product (eye cream)', 'Cosmetic skincare product (eye treatment)', 'Cosmetic skincare product (radiance and anti-dark spot face care)', 'Cosmetic skincare product \\u2013 after-sun / skin-regenerating oil', 'Cosmetic skincare product \\u2013 facial cleanser', 'Cosmetic skincare product \\u2013 moisturising cream', 'Cosmetic skincare product \\u2013 organic cold cream / night cream', 'Cosmetic skincare product \\u2013 organic day cream', 'Cosmetic skincare product \\u2013 organic floral water / hydrolat', 'Cosmetic skincare product \\u2013 organic lightening / brightening cream', 'Cosmetic skincare product \\u2013 organic nourishing oil', 'Cosmetic skincare product \\u2013 topical oil', 'Cosmetic skincare product; professional cosmeceutical anti-ageing facial moisturiser', 'Cosmetic topical skin\\u2011care product', 'Cosmetics', 'Cosmetics & Skincare', 'Cosmetics / Makeup', 'Cosmetics / Professional Tinting', 'Cosmetics / Skincare', 'Cosmetics / Suncare', 
#               'Couch Maintenance', 'Cryo Chiller', 'Cryotherapy device', 'Customer Service', 'DERMA FILLERS', 'Derma fillers', 'Dermal Filler', 'Dermal Fillers', 'Dermal filler', 'Dermal filler (medical device)', 'Dermal filler \\u2013 hyaluronic acid injectable', 'Dermal fillers', 'Dermal fillers / Mesotherapy', 'Dermatological photoprotection', 'Dermatological repair skincare', 'Dermatology & Aesthetic Skincare', 'Dermatology & Anti-ageing Skincare', 'Dermocosmetic', 'Dermocosmetic Skincare', 'Dermocosmetic \\u2014 tinted day cream with sun protection', 'Dermocosmetic liquid foundation with SPF 20', 'Dermocosmetic skincare', 'Device \\u2013 Microneedling Pen', 'Device \\u2013 Tattoo & PMU Machine', 'Diagnostic & Monitoring Accessories', 'Diagnostic & Monitoring Devices', 'Diagnostic & Monitoring Equipment', 'Diagnostic Cardiology', 'Diagnostic Equipment', 'Diagnostic Equipment & Accessories', 'Diagnostic Equipment Accessories', 'Diagnostic Instruments', 'Diagnostic Test', 'Diagnostic accessories', 'Diagnostic accessory', 'Diagnostic cardiology', 'Diagnostic cardiology / respiratory equipment accessory', 'Diagnostic equipment', 'Diagnostic equipment accessories', 'Diagnostic equipment accessory', 'Diagnostic equipment consumables', 'Diagnostics', 'Diagnostics & Monitoring', 'Dietary Supplement', 'Dietary Supplements', 'Dietary supplement', 'Dietary supplement / beauty supplement', 'Diluents', 'Disinfectant', 'Disinfectant & Infection Control Supplies', 'Disinfectant / Salon hygiene product', 'Disposable medical examination gloves', 'Disposables', 'Dressing & Wound Care', 'Dressings & Wound Care', 'ECG Accessories', 'ECG Monitoring & Accessories', 'Educational & Training Material', 'Educational / Clinic Supplies', 'Educational Material', 'Educational material / medical poster', 'Educational wall art', 'Emergency & first aid accessories', 'Emergency & rescue accessory', 'Emergency Medical Devices', 'Emergency medical kit', 'Emergency medicines pack', 'Emollient', 'Emollient Gel', 'Emollient cream', 'Emollient ointment', 'Energy-based aesthetic medical device', 'Energy-based aesthetic medical device (multi-application laser and light platform)', 'Essential Oil', 'Essential Oil / Fragrance Oil', 'Essential oil', 'Exosome skin booster', 'Exosome therapy', 'Exosome-based hair restoration treatment', 'Eye Protection', 'Eye care accessory', 'Eye cosmetics', 'Eye treatment', 'Eyelash conditioner serum', 'Face mask', 'Facial aesthetics cannulas', 'Facial cleanser', 'Facial exfoliant', 'Facial moisturiser & sunscreen', 'Facial skincare \\u2013 cleanser', 'Facial skincare treatment kit', 'Facial toner', 'Fat Dissolver', 'Fat Dissolvers', 'Fertility Treatment', 'First Aid', 'First Aid / Hot & Cold Therapy', 'First aid \\u2013 hot & cold therapy', 'Food Supplement', 'Food supplement', 'Food supplement (nutricosmetic beauty supplement)', 'Food supplement / Nutricosmetic', 'Food supplement / dietary supplement', 'Food supplement / functional confectionery', 'Food supplement / nutraceutical', 'Food supplement / nutricosmetic', 'Footwear', 'Furniture', 'Gauze Swabs', 'General Sales List (GSL) topical medicinal product; emollient shower gel', 'Gloves', 'Hair Loss Treatments', 'Hair Removal / Waxing', 'Hair booster injectable', 'Hair care', 'Hair care / Hair conditioner', 'Hair care / Hair shampoo', 'Hair care accessories', 'Hair mesotherapy treatment', 'Hair treatment / Therapy', 'Haircare / Professional aesthetic treatment', 'Hand Hygiene', 'Hand Sanitizer', 'Hand care moisturiser', 'Hand disinfectant wipes', 'Hand hygiene', 'Hand hygiene \\u2013 foam hand soap refill', 'Hand hygiene and infection control', 'Hand hygiene dispenser', 'Hand hygiene dispenser accessory', 'Hand sanitiser', 'Hand sanitiser dispenser', 'Hand soap', 'Hand, Hair & Body Wash (Foaming Soap Refill)', 'Hand, body and hair wash (cosmetic lotion wash)', 'Health Monitoring', 'Healthcare', 'Healthcare / Reception & Conference Furniture', 'Healthcare / Waiting\\u2011room / reception furniture accessory', 'Healthcare / Waiting\\u2011room furniture', 'Healthcare / clinical seating', 'Healthcare Waste Containers', 'Healthcare seating', 'Healthcare workwear', 'Heat therapy pack', 'Hi-vis workwear', 'Home & Bedding', 'Hormone Replacement Therapy (HRT)', 'Hormone Replacement Therapy (HRT) medicine', 'Hot & cold therapy', 'Hot & cold therapy pack', 'Hot and cold therapy', 'Household / Professional Cleaning', 'Hyaluronic acid dermal filler', 'Hyaluronic acid dermal filler (medical device)', 'Hygiene', 'Hygiene / Infection control accessory', 'Hygiene / Infection control equipment', 'Hyperpigmentation treatment', 'IM/IV Vitamin & Wellness Injection', 'IM/IV Vitamins & Electrolytes', 'IV wellness supplement (unlicensed NAD+ injectable)', 'Imaging & diagnostics equipment', 'In vitro diagnostic device \\u2013 capillary blood collection tube', 'Infection Control', 'Infection Control & Cleaning', 'Infection Control & Janitorial Supplies', 'Infection Control / Cleaning Wipes', 'Infection Control / Disinfectants', 'Infection Control / Disinfection equipment', 'Infection Control / First Aid Accessory', 'Infection Control / Hand Hygiene', 'Infection Control / Spill Management', 'Infection Control / Surface Disinfectant', 'Infection control', 'Infection control & hygiene', 'Infection control / Disinfection equipment', 'Infection control / PPE', 'Infection control / PPE storage', 'Infection control / Skin disinfection', 'Infection control / disinfectant', 'Infection control / hand hygiene', 'Infection control / skin antiseptic', 'Infection control / surface decontamination', 'Infection control / washroom dispenser', 'Infection control \\u2013 dental waterline disinfection', 'Infection control \\u2013 surface sanitising wipes', 'Infection control accessory', 'Infection control and cleaning', 'Infection control and hand hygiene accessories', 'Infection control and hygiene', 'Infection control and prevention', 'Infection control and skin preparation wipes', 'Infection control and spill management', 'Infection control equipment', 'Infection control supplies', 'Infection prevention and patient hygiene', 'Infusion & IV Therapy', 'Infusion Devices / Syringe Pumps', 'Injectable Aesthetic Treatment', 'Injectable Biostimulators & Fillers', 'Injectable Biostimulators & Skin Boosters', 'Injectable Body Filler', 'Injectable Medical Device', 'Injectable Skin Booster', 'Injectable Skin Boosters', 'Injectable Vitamin Supplement', 'Injectable \\u2013 Viscosupplement', 'Injectable aesthetic / skin\\u2011booster', 'Injectable aesthetic filler', 'Injectable aesthetic medical device', 'Injectable aesthetic medical device kit', 'Injectable aesthetic treatment', 'Injectable aesthetic/dermal treatment', 'Injectable antioxidant medicine', 'Injectable biostimulator', 'Injectable biostimulator / soft tissue implant', 'Injectable body contouring dermal filler', 'Injectable collagen-stimulating dermal filler (CE-marked medical device)', 'Injectable collagen-stimulating dermal filler (medical device)', 'Injectable dermal filler', 'Injectable dermal filler / skin biostimulator', 'Injectable dermal filler / skin booster', 'Injectable enzyme', 'Injectable enzyme (POM)', 'Injectable enzyme (prescription-only medicine)', 'Injectable fat-dissolving solution', 'Injectable hair and scalp biostimulator', 'Injectable hair biostimulator', 'Injectable hyaluronic acid gel', 'Injectable hyaluronic acid skin booster for aesthetic use', 'Injectable lip booster', 'Injectable medical device', 'Injectable mesotherapy / skin booster', 'Injectable periocular skin booster', 'Injectable poly-L-lactic acid (PLLA) collagen stimulator dermal filler', 'Injectable polynucleotide-based eye area treatment', 'Injectable prescription medicine', 'Injectable skin booster', 'Injectable skin booster / biorevitalisation', 'Injectable skin booster / biostimulator', 'Injectable skin booster / mesotherapy', 'Injectable vitamin preparation', 'Injectable vitamin supplement', 'Injectables', 'Injectables & Dermal Fillers', 'Injectables & Skin Boosters', 'Injectables & Skinboosters', 'Injection & Infusion', 'Injection & Infusion / Diabetes Care', 'Injection & Infusion / Enteral syringe accessory', 'Injection & Infusion / Medication Delivery Devices', 'Injection & Infusion Accessory', 'Injection & Infusion Consumable', 'Injection & Infusion Device', 'Injection & Infusion Devices', 'Injection & Infusion Medical Device', 'Injection & Infusion \\u2013 hypodermic needle (medical device)', 'Injection & Infusion \\u2013 insulin syringe (medical device)', 'Injection & Infusion \\u2013 intraosseous access device', 'Injection & infusion \\u2013 sterile disposable syringe', 'Injection & infusion consumable', 'Injection & infusion devices', 'Injection & infusion disposables', 'Injection accessories / microneedle devices', 'Injection and Infusion Devices', 'Injection and infusion devices', 'Insulin and GLP-1 pen needles', 'Insulin and GLP-1 safety pen needles', 'Intimate aesthetic injectable', 'Intimate injectable', 'Intravenous Fluids', 'Intravenous administration set', 'Irrigation syringe (medical device)', 'Laboratory Consumable / Storage', 'Laboratory Reagents', 'Laboratory accessory', 'Laboratory equipment', 'Laboratory reagent / parenteral diluent', 'Laser & Aesthetic Devices', 'Laser & Energy Devices', 'Laser & aesthetics equipment', 'Laser device', 'Lighting', 'Lighting accessory', 'Lip Care', 'Lip care', 'Makeup', 'Makeup / Corrector', 'Makeup / Post\\u2011procedural Skin Care', 'Marking and labelling tool', 'Medical & First Aid Supplies', 'Medical / Aesthetic Device', 'Medical / Aesthetic Devices & Fillers', 'Medical / Aesthetic Furniture', 'Medical / Aesthetic procedure accessory', 'Medical / Clinic Consumables', 'Medical / Clinical Furniture', 'Medical / Diagnostic Device', 'Medical / Infection Control Supplies', 'Medical / Intravenous & Phlebotomy Supplies', 'Medical / PPE', 'Medical / Protective Equipment', 'Medical / Surgical Instruments', 
#               'Medical / Surgical disposable consumable', 'Medical / Therapeutic Injection', 'Medical / Weighing Scale', 'Medical / aesthetic\\u2011dermal product', 'Medical / clinical furniture', 'Medical / treatment room furniture', 'Medical Accessories', 'Medical Aesthetics', 'Medical Consumable / Enteral Feeding Accessory', 'Medical Consumables', 'Medical Device', 'Medical Device / Clinical Waste', 'Medical Device Accessories', 'Medical Device Accessory', 'Medical Device \\u2013 Dermal Filler', 'Medical Device \\u2013 Injectable Hair Filler', 'Medical Device \\u2013 Injection Accessory', 'Medical Device \\u2013 Injection Needle', 'Medical Devices', 'Medical Devices & Equipment', 'Medical Devices & Needles', 'Medical Devices / Diagnostic Instruments', 'Medical Equipment', 'Medical Equipment Accessories', 'Medical Equipment Accessory', 'Medical Equipment Consumable', 'Medical Examination Gloves', 'Medical Furniture', 'Medical Furniture Accessory', 'Medical Furniture Spare Part', 'Medical IT & Office Equipment', 'Medical Instruments & Accessories', 'Medical Lighting', 'Medical Lighting & Examination Lights', 'Medical Supplies', 'Medical Supplies / Personal Protective Equipment (PPE)', 'Medical Waste Management / Sharps Bin Accessories', 'Medical accessory', 'Medical accessory / diagnostic accessory', 'Medical aesthetic accessories', 'Medical aesthetic device', 'Medical aesthetic device \\u2013 absorbable lifting threads', 'Medical aesthetic device \\u2013 radiofrequency skin tightening system', 'Medical aesthetic equipment', 'Medical aesthetic product', 'Medical aesthetics', 'Medical apparel & patient wear', 'Medical apparel / scrubs top', 'Medical clothing and uniforms', 'Medical consumable', 'Medical consumable / Injection needle', 'Medical consumable / Printer paper', 'Medical consumable / diagnostic accessory', 'Medical consumable / dressing', 'Medical consumable / infusion set', 'Medical consumable / procedure pack', 'Medical consumable / protective gloves', 'Medical consumables', 'Medical device', 'Medical device - hypodermic needle', 'Medical device - syringe and hypodermic needle combination', 'Medical device - syringe with fixed needle', 'Medical device - vial/ampoule fill needle', 'Medical device / Aesthetic injectable consumable', 'Medical device / Airway management accessory', 'Medical device / Diagnostic instrument accessory', 'Medical device / IV therapy accessory', 'Medical device / In-vitro diagnostic (IVD)', 'Medical device / Injectable accessory', 'Medical device / Injection & Infusion consumable', 'Medical device / Point-of-care (POCT) accessory', 'Medical device / Respiratory care consumable', 'Medical device / aesthetic consumable', 'Medical device / biohazard disposal', 'Medical device / dental consumable', 'Medical device / hypodermic needle', 'Medical device / injection & infusion', 'Medical device / injection needle', 'Medical device / sharps disposal', 'Medical device / sharps\\u2011handling accessory', 'Medical device \\u2013 Biostimulatory dermal filler', 'Medical device \\u2013 Class III hyaluronic acid dermal filler', 'Medical device \\u2013 IV administration', 'Medical device \\u2013 IV extension set', 'Medical device \\u2013 IV extension set / stopcock', 'Medical device \\u2013 IV fixation dressing', 'Medical device \\u2013 PRP preparation kit', 'Medical device \\u2013 absorbable PDO lifting thread', 'Medical device \\u2013 accessory / diagnostic equipment accessory', 'Medical device \\u2013 aesthetic injectable cannula', 'Medical device \\u2013 airway management / patient connection', 'Medical device \\u2013 blood collection and infusion set', 'Medical device \\u2013 blood collection set', 'Medical device \\u2013 blood pressure monitoring accessory', 'Medical device \\u2013 blunt fill needle for medication preparation', 'Medical device \\u2013 blunt microcannula for dermal filler injection', 'Medical device \\u2013 dermal filler', 'Medical device \\u2013 diagnostic accessory', 'Medical device \\u2013 hypoallergenic microporous paper tape', 'Medical device \\u2013 hypoallergenic surgical paper tape', 'Medical device \\u2013 hypoallergenic surgical paper tape (clinic consumable)', 'Medical device \\u2013 hypoallergenic surgical tape', 'Medical device \\u2013 hypodermic accessory', 'Medical device \\u2013 hypodermic syringe', 'Medical device \\u2013 injectable skin booster / biostimulator', 'Medical device \\u2013 injection accessory', 'Medical device \\u2013 injection needles', 'Medical device \\u2013 insulin syringe with fixed needle', 'Medical device \\u2013 needle and syringe combination', 'Medical device \\u2013 needles & cannulas', 'Medical device \\u2013 oral/enteral dosing syringe', 'Medical device \\u2013 peripheral IV catheter', 'Medical device \\u2013 peripheral intravenous catheter', 'Medical device \\u2013 peripheral intravenous catheter system', 'Medical device \\u2013 pre-injection skin cleansing swabs', 'Medical device \\u2013 resuscitation / first aid equipment', 'Medical device \\u2013 safety hypodermic needle', 'Medical device \\u2013 safety hypodermic syringe with needle', 'Medical device \\u2013 safety insulin pen needle', 'Medical device \\u2013 sharps safety and disposal aid', 'Medical device \\u2013 single-use vaginal speculum', 'Medical device \\u2013 spinal (lumbar puncture) needle', 'Medical device \\u2013 spinal needle', 'Medical device \\u2013 sterile hypodermic injection needle (single-use)', 'Medical device \\u2013 sterile single-use blunt-tip cannula for injectable treatments', 'Medical device \\u2013 sterile single-use pen needle for subcutaneous injection', 'Medical device \\u2013 syringe', 'Medical device \\u2013 syringe and needle', 'Medical device \\u2013 syringe with fixed needle', 'Medical device \\u2014 IV catheter', 'Medical device \\u2014 Suprapubic Foley catheter kit (introducer / Seldinger)', 'Medical device \\u2014 Syringe', 'Medical device \\u2014 hyaluronic acid dermal filler', 'Medical device \\u2014 infusion set', 'Medical device \\u2014 intravenous catheter', 'Medical device \\u2014 syringe', 'Medical device \\u2014 temperature probe / thermometer accessory', 'Medical device \\u2014 transparent film dressing (I.V. dressing / wound dressing)', 'Medical device \\u2014 transparent film dressing (IV dressing / wound dressing)', 'Medical device accessories', 'Medical device accessory', 'Medical device consumable', 'Medical device power accessory', 'Medical device spare part', 'Medical devices & consumables', 'Medical devices \\u2013 dressings & fixation', 'Medical devices \\u2013 injection & infusion', 'Medical devices \\u2013 injection consumables', 'Medical diagnostic device', 'Medical diagnostic equipment', 'Medical diagnostic equipment accessory', 'Medical diagnostic software \\u2013 ambulatory blood pressure monitoring', 'Medical diagnostic test', 'Medical disposable \\u2013 infection control', 'Medical disposables', 'Medical equipment', 'Medical equipment / PPE', 'Medical equipment \\u2013 Examination lamp / light', 'Medical equipment \\u2013 bedhead examination and reading light', 'Medical equipment \\u2013 examination lighting', 'Medical equipment accessory', 'Medical equipment accessory \\u2013 examination lighting', 'Medical equipment furniture', 'Medical examination and minor surgical lighting', 'Medical examination and surgical lighting device', 'Medical examination light', 'Medical examination lighting', 'Medical examination lighting accessory', 'Medical footwear', 'Medical furniture', 'Medical furniture & accessories', 'Medical furniture & equipment', 'Medical furniture / Massage & Therapy table', 'Medical furniture \\u2013 3-section outpatient examination and treatment couch (Class I medical device)', 'Medical furniture \\u2013 clinical seating', 'Medical furniture \\u2013 clinician seating', 'Medical furniture \\u2013 couches & accessories', 'Medical furniture \\u2013 instrument and dressing trolley', 'Medical furniture \\u2013 motorised dialysis chair', 'Medical furniture \\u2013 outpatient examination and treatment couch (Class I medical device)', 'Medical furniture accessory', 'Medical furniture accessory \\u2013 treatment room chairs & stools', 'Medical furniture parts', 'Medical injection consumable', 'Medical instrument', 'Medical instrument tray', 'Medical laser device', 'Medical lighting accessories', 'Medical lighting accessory', 'Medical supplies \\u2013 first aid', 'Medical syringe', 'Medical training simulator', 'Medical uniforms and workwear', 'Medical waste management', 'Medical workwear', 'Medical workwear / scrubs', 'Medication', 'Medication \\u2013 topical local anaesthetic', 'Medicinal Products', 'Medicinal emollient cream', 'Medicinal product', 'Medicinal product (prescription only medicine)', 'Medicine', 'Medicine / Vitamin supplement', 'Meso', 'Mesotherapy', 'Mesotherapy / cosmetic skin treatment', 'Mesotherapy / skin booster', 'Mesotherapy / skin-booster', 'Mesotherapy body treatment', 'Mesotherapy skin booster', 'Mesotherapy solution', 'Mesotherapy solution (professional cosmetic)', 'Metabolic health and weight management peptide', 'Micro-Needling Devices', 'Microblading tool for cosmetic eyebrow procedures', 'Microneedling / cellulite treatment device', 'Microneedling Devices', 'Microneedling accessories', 'Microneedling device', 'Microneedling device cartridge', 'Microneedling device set', 'Microneedling home-care kit', 'Moisturiser', 'Moisturizer', 'Monitoring & Diagnostics', 'Muscle Relaxant', 'Nail Equipment', 'Nail accessory', 'Nail care tools', 'Needles & Cannulas', 'Needles & Sharps', 'Needles & Syringes', 'Needles & cannulas (aesthetic medical device)', 'Needles and Sharps \\u2013 mesotherapy hypodermic needles (medical device)', 'Needling Device', 'Neuropeptide Serum', 'Nitrile Gloves', 'Nitrile gloves', 'Non-invasive blood pressure measurement accessory (reusable cuff)', 'Non-invasive pelvic floor therapy device', 'Nutraceutical / food supplement', 'Nutraceuticals / Food Supplement', 
#               'Nutraceuticals / Supplements', 'Nutritional Supplement', 'Nutritional Supplements', 'OTC drug', 'Occupational footwear', 'Occupational footwear / work clogs (PPE)', 'Office Supplies', 'Office supplies', 'Ophthalmic diagnostic accessory', 'Ophthalmic prescription medicine', 'Optical / Magnification accessory', 'Oral cardiovascular medicine', 'Orthopedic Injectable', 'Over-the-counter General Sales List (GSL) topical anti-acne medicinal product', 'PDO Thread', 'PDO Threads', 'PDO thread lifting device', 'PDO threads', 'PPE', 'PPE & Infection Control', 'PPE / Infection Control', 'PPE / Medical Consumables', 'PRP / Orthobiologic preparation system', 'PRP / laboratory centrifuge', 'Pain Relief & Therapy Devices', 'Pain relief', 'Patient Hygiene', 'Patient cleansing wipes', 'Patient hygiene & bathing', 'Peptide', 'Peptide / Biologic', 'Peptide / Research compound', 'Peptide bioregulator for joint and cartilage support (non-medicinal research/supplement product)', 'Peptide hormone / research peptide', 'Peptides', 'Peptides; weight-loss and aesthetic products', 'Peripheral IV catheters', 'Permanent Makeup', 'Permanent Makeup / Tattoo Supplies', 'Permanent Makeup Pigments', 'Permanent dermal filler (cosmetic injectable)', 'Permanent makeup accessories', 'Permanent makeup tool', 'Personal Care', 'Personal Protective Equipment', 'Personal Protective Equipment (PPE)', 'Personal care / hygiene', 'Personal protective equipment', 'Personal protective equipment (PPE)', 'Personal protective equipment (PPE) \\u2013 filtering half mask respirators', 'Pharmaceutical Product', 'Pharmaceutical \\u2013 Antibiotic Eye & Ear Drops', 'Pharmaceutical \\u2013 Injectable Antibiotic', 'Pharmaceutical product', 'Pharmaceutical product (prescription-only medicine)', 'Pharmaceuticals', 'Platelet-rich plasma (PRP) preparation kit', 'Polynucleotide Skin Booster', 'Polynucleotide injectable skin booster', 'Polynucleotide skin booster / biorevitalizant', 'Polynucleotide skin booster kit', 'Post-procedure care \\u2013 medical aesthetics', 'Post-procedure recovery cream', 'Post-surgical & support garment', 'Post-treatment cosmetic cream', 'Precious metals investment', 'Prescription / OTC medicine', 'Prescription Medication', 'Prescription Medicine', 'Prescription Medicines', 'Prescription and pharmacy medicine', 'Prescription androgen therapy', 'Prescription anti-glaucoma ophthalmic medicine', 'Prescription botulinum toxin type A medicine', 'Prescription corticosteroid injection', 'Prescription injectable medicine', 'Prescription medicinal product', 'Prescription medicine', 'Prescription medicine (antidiabetic / weight\\u2011management drug)', 'Prescription medicine / aesthetic medicine', 'Prescription medicine \\u2013 hair loss treatment', 'Prescription only medicine', 'Prescription only medicine (POM)', 'Prescription ophthalmic medicine', 'Prescription-only androgen replacement medicine', 'Prescription-only antimicrobial nasal cream (antibiotic and antiseptic medicine)', 'Prescription-only antiviral medicine (POM)', 'Prescription-only botulinum toxin neuromodulator', 'Prescription-only botulinum toxin type A injectable medicine', 'Prescription-only botulinum toxin type A neuromodulator (POM)', 'Prescription-only corticosteroid medicine (POM)', 'Prescription-only high-dose vitamin D3 medicine (POM; imported unlicensed in the UK)', 'Prescription-only hormone replacement therapy (HRT) medicine', 'Prescription-only hormone replacement therapy (POM)', 'Prescription-only injectable medicine', 'Prescription-only local anaesthetic medicine (POM)', 'Prescription-only medicine', 'Prescription-only medicine (POM)', 'Prescription-only medicine (POM) \\u2013 adrenergic emergency injection', 'Prescription-only medicine (antibiotic)', 'Prescription-only medicine (botulinum neurotoxin)', 'Prescription-only medicine (pharmaceutical product)', 'Prescription-only medicine / diluent', 'Prescription-only oral medicine for rosacea', 'Prescription-only systemic antibacterial (parenteral antibiotic)', 'Prescription-only topical antibiotic', 'Prescription-only vitamin B12 injection (POM)', 'Professional CPD-accredited online training with aesthetic regenerative treatment product', 'Professional Skincare Serum', 'Professional aesthetic device', 'Professional aesthetic microneedling consumable', 'Professional aesthetic skin booster', 'Professional beauty clinic accessory', 'Professional beauty treatment product', 'Professional chemical peel', 'Professional chemical peel (in-office treatment)', 'Professional chemical peel (medical device)', 'Professional chemical peel / medical device', 'Professional chemical peel solution', 'Professional chemical skin peel', 'Professional cosmetic / mesotherapy serum', 'Professional cosmetic acne treatment', 'Professional cosmetic mesotherapy solution', 'Professional cosmetic pre-peel cleanser / skin preparation solution', 'Professional depigmentation system', 'Professional exosome hair & scalp treatment', 'Professional exosome skin treatment', 'Professional hair and scalp treatment', 'Professional hair-restorative mesotherapy solution (cosmetic / aesthetic use, not a licensed medicine)', 'Professional mesotherapy / biorevitalization solution', 'Professional microneedling device', 'Professional nail and clinic consumable', 'Professional nail care tool', 'Professional nail enhancement accessory', 'Professional online training with CE-marked injectable medical device (PLLA dermal filler)', 'Professional skin care', 'Professional skin rejuvenation bundle', 'Professional skincare', 'Professional skincare / cosmeceutical', 'Professional skincare mask', 'Professional skincare system', 'Professional skincare treatment mask', 'Professional work footwear', 'Protective Wear / Clothing & Scrubs', 'Protective workwear', 'Reception & Waiting Room Seating', 'Regenerative Medicine & PRP', 'Replacement part / fastener', 'Research Peptides', 'Research Peptides & Biochemicals', 'Research chemical / peptide', 'Research chemical / peptide reagent', 'Research chemical \\u2013 peptide bioregulator', 'Research compound / peptide capsules', 'Research peptide / small-molecule reagent', 'Research peptide bundle (laboratory chemical \\u2013 not authorised medicinal product)', 'Research peptide combination', 'Research peptide product', 'Research peptides / unlicensed medicinal products', 'Research-use-only peptide; growth hormone secretagogue', 'Research-use-only peptide; human growth hormone fragment', 'Research-use-only peptide; insulin-like growth factor analogue', 'Reusable protective clothing \\u2013 adult dignity apron / clothing protector', 'Safety / First Aid signage', 'Salon & spa supplies', 'Self Tanning', 'Self Test Kits', 'Self-tanning accessory', 'Self-tanning cosmetic', 'Self-tanning cosmetic kit', 'Service', 'Sharps Bins', 'Sharps Safety & Handling', 'Sharps bins accessories', 'Sharps disposal', 'Sharps disposal / biohazard control', 'Sharps disposal accessories', 'Single-use medical device \\u2013 holloware container', 'Single-use medical instrument', 'Single-use medical procedure pack', 'Single-use sterile hypodermic syringe (medical device)', 'Skin & Hair Care', 'Skin & hair care oil', 'Skin Booster', 'Skin Boosters', 'Skin Boosters / Hair Treatments', 'Skin Care', 'Skin Care / Cleanser', 'Skin Rejuvenation', 'Skin analysis device', 'Skin booster', 'Skin booster / bio-restructuring solution', 'Skin booster / collagen biostimulator', 'Skin booster / mesotherapy solution', 'Skin booster / tissue stimulator', 'Skin booster \\u2013 collagen biostimulator', 'Skin boosters', 'Skin care', 'Skincare', 'Skincare - Face Mask', 'Skincare - Facial Cleanser', 'Skincare - Reparative Photoprotection', 'Skincare - Serum / Ampoule', 'Skincare - Toner & Pads', 'Skincare / Chemical peel system accessory', 'Skincare / Cleanser', 'Skincare / Eye Care Patch', 'Skincare / Lotion', 'Skincare / Makeup remover', 'Skincare / Mask', 'Skincare / Moisturizer', 'Skincare / Night Cream', 'Skincare / Night Serum', 'Skincare / Professional Serum', 'Skincare / Professional aesthetic treatment', 'Skincare / Serum', 'Skincare / Serums', 'Skincare / Sun Protection', 'Skincare / Sun protection', 'Skincare / Sunscreen', 'Skincare / Toner / Exfoliating solution', 'Skincare / clinical accessory', 'Skincare / corrective serum', 'Skincare / eye care', 'Skincare / mask', 'Skincare / serum', 'Skincare \\u2013 Anti-ageing serum', 'Skincare \\u2013 Face Mask', 'Skincare \\u2013 Face mask', 'Skincare \\u2013 Face serum', 'Skincare \\u2013 Lip care', 'Skincare \\u2013 Moisturizer / Mattifying Cream', 'Skincare \\u2013 Soothing & Repair Care', 'Skincare \\u2013 eye care', 'Skincare \\u2013 face & body moisturizer', 'Skincare \\u2013 face moisturizer', 'Skincare \\u2013 face treatment', 'Skincare \\u2013 night cream', 'Skincare \\u2013 restorative cream', 'Skincare moisturiser', 'Skincare product', 'Soap and sanitizer dispenser', 'Sports first aid kit', 'Sterile lyophilized NAD+ powder vial for intravenous/subcutaneous wellness use (dietary supplement)', 'Sterile lyophilized NAD+ powder vials for intravenous and subcutaneous wellness/anti-ageing therapy', 'Sterile saline irrigation solution; Class IIb medical device', 'Sterile saline wound and skin cleansing wipes (medical device, infection control)', 'Stethoscope accessories', 'Sun Protection / Medical Device', 'Sun Protection / Sunscreen', 'Supplements', 'Surface and environmental disinfectant tablets (chlorine-releasing biocide)', 'Surface disinfectant', 'Surgical Instruments', 'Survival Gear', 'Systemic antibiotic medicine', 'Tools & Applicators', 'Topical Aftercare Gel', 'Topical Aftercare Treatment', 'Topical Anaesthetic', 'Topical Anesthetic', 'Topical Research Peptide', 'Topical acne medicine (Pharmacy medicine)', 'Topical antiseptic / licensed medicinal product', 'Topical antiseptic medicinal product', 'Topical antiviral medicine (GSL/P in UK)', 'Topical cooling gel', 'Topical copper peptide cosmetic serum', 'Topical cosmetic serum',
#               'Topical dermatological medicine', 'Topical dermatology medication', 'Topical dermatology treatment', 'Topical herbal medicinal cream', 'Topical herbal medicine', 'Topical local anaesthetic cream', 'Topical medical device \\u2013 professional chemical peel', 'Topical photoprotective sunscreen', 'Topical scar treatment', 'Topical skincare', 'Training & Education', 'Training Models', 'Treatment Room Chairs & Stools', 'Treatment room furniture', 'Uniform accessory', 'Uniforms', 'Uniforms & Workwear', 'Unlicensed medicine / diluent', 'Unlicensed medicine / prescription-only diluent', 'Unlicensed peptide for weight management and fat metabolism research / cosmetic use', 'Veterinary diagnostic equipment', 'Veterinary diagnostic instruments & accessories', 'Veterinary medical equipment', 'Vital Signs Monitors Accessories', 'Vital signs monitor accessories', 'Vitamins', 'Vitamins and Infusion', 'Wall Holders', 'Wall Mounts', 'Weight Management', 'Wellness & Anti-ageing', 'Wellness & Skin Boosters', 'Wellness Injectables', 'Work In Style', 'Workplace identification', 'Workwear', 'Workwear & Uniforms', 'Workwear / Healthcare apparel', 'Workwear / Medical Apparel', 'Workwear / Safety footwear', 'Workwear / Uniform', 'Workwear / Uniforms', 'Workwear footwear', 'Wound Care', 'Wound Care & Dressings', 'Wound Care & Surgical Consumables', 'Wound care / Adhesive remover']
# df =pd.DataFrame(categories, columns=['Category'])
# # Generate embeddings (list of numpy arrays)
# df["Embeddings"] = list(
#     model.encode(
#         df["Category"].tolist(),
#         normalize_embeddings=True
#     )
# )
# for index, row in df.iterrows():
#     sim_array = []
#     fuzz_array =[]
#     try:
#         for index_1, row_1 in df.iterrows():
#             if index != index_1:
#                     cos_similarity = float(row["Embeddings"] @ row_1["Embeddings"])
#                     if cos_similarity > 0.85:
#                         sim_array.append(row_1['Category'])
                    
#                     fuzz_similarity =fuzz.ratio([row['Category']], [row_1['Category']])
#                     if fuzz_similarity > 85:
#                         fuzz_array.append(row_1['Category'])
#         df.at[index,'Similarity_Array_fuzz']=json.dumps(fuzz_array)
#         df.at[index,'Similarity_Array_cosine']=json.dumps(sim_array)
#     except Exception as e:
#         print(e)
#         pass
AESTHETIC_INJECTABLES = [
    "injectable",
    "filler",
    "skin booster",
    "botox",
    "dermatological",
    "fat dissolver",
    "mesotherapy",
    "micro-needling",
    "microblading",
    "microneedling",
    "peptide",
    "threads",]

MEDICAL_AND_AESTHETIC_DEVICES=["device",
    "equipment",
    "airway",
    "tools",
    "monitor",
    "diagnostic",
    "laboratory",
    "laser",
    "instrument",
    "tanning",]

TOPICAL_AND_PHARMACEUTICAL_PRODUCTS = [
    "treatment",
    "medicine",
    "consumable",
    "accessories",
    "product",
    "dermatology",
    "skincare",
    "anti-ageing",
    "essentials",
    "cosmeceutical",
    "cosmetic",
    "hrt",
    "insulin",
    "lip care",
    "pigment",
    "peel",
    "exosome",
    "essential oil",
    "drug",
    "prp",
    "pharmaceutical",
    "post",
    "prescription",
    "topical",]
APPAREL =[
    "apparel",
    "legwear",
    "clothing",
    "gloves",
    "footwear",
    "workwear",
    "uniform",]
BLOOD =[

    "blood",]
INJECTION_CONSUMABLES =[
    "cannulae",
    "needle",
    "syringes","sharp"
]
THERAPY = [
    "therapy",]
FURNITURE_AND_INFRASTRUCTURE=[
    "furniture",
    "couch",
    "seat",
    "bed",
    "lighting",
    "office",
    "office supplies",
    "wall",]
NUTRITION=[

    "diet",
    "food",
    "nutraceutical",
    "nutritional",]

EDUCATION_AND_TRAINING=[    "educational","training"]
INFECTION_EMERGENCIES=[
    "emergency",
    "first aid",
    "gauze",
    "waste",
    "dressing",
    "hygiene",
    "infection",
    "iv",
    "im",
    "vitamin",
    "electrolyte",
    "wellness",
    "disinfectant",
    "wipes",
    "moisturizer",
    "dispenser",
    "sanitizer",
    "soap",
    "cream",
    "clean",
    "infusion",
    "intravenous",
    "ppe",
    "protective",
    "surgical",
    "weighing scale",
    "supplies",
    "medical consumable",
    "sun",
    "sterile",
    "wound",
    "disposables"]
PERSONAL_CARE_AND_BEAUTY=[

    "eye",
    "face",
    "facial",
    "makeup",
    "hair",
    "nail",
    "salon",
    "spa"
]
BUCKETS = {    "AESTHETIC_INJECTABLES" : AESTHETIC_INJECTABLES,
    "MEDICAL_AND_AESTHETIC_DEVICES": MEDICAL_AND_AESTHETIC_DEVICES,
    "TOPICAL_AND_PHARMACEUTICAL_PRODUCTS": TOPICAL_AND_PHARMACEUTICAL_PRODUCTS,
    "APPAREL": APPAREL,
    "BLOOD": BLOOD,
    "INJECTION_CONSUMABLES": INJECTION_CONSUMABLES,
    "THERAPY": THERAPY,
    "FURNITURE_AND_INFRASTRUCTURE": FURNITURE_AND_INFRASTRUCTURE,
    "NUTRITION": NUTRITION,
    "EDUCATION_AND_TRAINING": EDUCATION_AND_TRAINING,
    "INFECTION_EMERGENCIES": INFECTION_EMERGENCIES,
    "PERSONAL_CARE_AND_BEAUTY": PERSONAL_CARE_AND_BEAUTY,
}

# df=pd.read_csv("category_embeddings_matches_resolved.csv")
# df_1 = pd.read_excel(r"C:\Users\agney\Desktop\Aesthetic Products\Products_slugs.xlsx",sheet_name='Sheet1')
# category_map = dict(
#     zip(df["Category"], df["Resolved_Bucket"])
# )
# df_1["Category"] = df_1["product_category"].map(category_map)
# df_1.to_excel("Product_Categories.xlsx",sheet_name='Sheet1')
# print("done sleep")
# time.sleep(1000)

distr = {
    "www.teleta.co.uk":"Teleta",
    "mirrorpharma.co.uk":"Mirrorpharma",
    "thecrystalpharmacy.co.uk":"Thecrystalpharmacy",
    "agelessfillers.co.uk":"Agelessfillers",
    "www.medisave.co.uk":"Medisave",
    "www.france-health.com":"France-health",
    "www.lpgclinicswholesale.com": "Lpgclinicswholesale",
    "www.twofaceaesthetics.com": "Twofaceaesthetics" ,
    "laserandaesthetics.co.uk": "Laserandaesthetics",
    "dermafillerltd.uk": "Dermafillerltd",
    "aesthipharma.co.uk":"Aesthipharma",
    "www.wms.co.uk":"Wms",
    "www.ddgroup.com":"DDgroup",
    "www.fillersdirect.co.uk":"Fillersdirect" ,
    "aestheticswarehouse.co.uk":"Aestheticswarehouse",
    "aestheticsrxpharma.co.uk":"Aestheticsrxpharma"
}

def clean_string(s: str) -> str:
    try:
        s = s.strip()
        # try to decode escapes first
        try:
            decoded = codecs.decode(s, "unicode_escape")
        except Exception:
            decoded = s
        # if decode didn't change anything and escapes still present, remove them
        if re.search(r'\\u[0-9A-Fa-f]{4}|\\x[0-9A-Fa-f]{2}', decoded):
            decoded = re.sub(r'\\u[0-9A-Fa-f]{4}|\\u\{[0-9A-Fa-f]+\}|\\x[0-9A-Fa-f]{2}', '', decoded)
        return decoded.encode("utf-8", "surrogatepass").decode("utf-8", "replace")
    except Exception as e:
        return s
def default_serializer(o):
    if isinstance(o, datetime):
        return o.isoformat()  # "2025-12-12T15:20:00"
    raise TypeError(f"Type not serializable: {type(o)}")
JCCP_Greens = r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\prod_DB\JCCP_Greens_P.csv"
JCCP_Yellows = r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\prod_DB\JCCP_Yellow_C.csv"
doctify_jccp = r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\prod_DB\practitioners\DB.xlsx"
# Path to your CSV file
csv_file = doctify_jccp 

def slugify(raw: str) -> str:
    try:
        slug = raw.lower().strip()
        
        # & + → 'and'
        slug = re.sub(r"[&+]", "and", slug)

        # / \ → -
        slug = re.sub(r"[\\/]+", "-", slug)

        # normalize accented characters → ascii
        slug = unicodedata.normalize("NFKD", slug)

        # strip combining accent marks
        slug = "".join(c for c in slug if not unicodedata.combining(c))

        # spaces → -
        slug = re.sub(r"\s+", "-", slug)

        # remove everything except a-z 0-9 -
        slug = re.sub(r"[^a-z0-9\-]", "", slug)

        # collapse multiple dashes
        slug = re.sub(r"\-+", "-", slug)

        # trim leading/trailing dashes
        slug = re.sub(r"^-+|-+$", "", slug)
        slug= re.sub(r'^-|-$', '', slug).replace(" ","-")
    except Exception as e:
        print(e)
        slug = None

    return slug

df = pd.read_excel(r"C:\Users\agney\Desktop\Aesthetic Products\Product_Categories.xlsx",sheet_name='Sheet1')

df = df.replace([None,np.nan,"None"], "")
products_list = df.to_dict(orient='records')
with open(r'C:\Users\agney\Documents\Files\Projects\doctor-directory\public\products.json', 'w', encoding='utf-8') as f:
    json.dump(products_list, f, indent=2, ensure_ascii=False)
print("Done")
time.sleep(100)
# def clean(x):
#     if "Show less" in x:
#         x = x.split("Show less")
#         clean_x = "".join(x[:len(x)-1])+'"]'
#         return clean_x
#     else: 
#         return x
# df['SPECIALTIES'] = df['SPECIALTIES'].apply(lambda x: clean(x))
df_clinics= pd.read_csv(r"C:\Users\agney\Documents\Files\Projects\doctor-directory\test2_clinics.csv")
# # Convert DataFrame to list of dicts
df_clinics = df_clinics.applymap(clean_string)
df_clinics['slug'] = df_clinics['slug'].apply(slugify)
df_clinics = df_clinics.replace([None, np.nan, "None"], "")
#df.to_csv("Clinics3.5k.csv")
clinics_list = df_clinics.to_dict(orient='records')


df_pract = pd.read_csv(r"C:\Users\agney\Documents\Files\Projects\doctor-directory\test2_pract.csv")
# # Convert DataFrame to list of dicts
df_pract['practitioner_name'] = df_pract['Practitioner_Name'].apply(slugify)
df_pract = df_pract.replace([None, np.nan, "None"], "")
# #df.to_csv("Clinics3.5k.csv")
pract_list = df_pract.to_dict(orient='records')


# # # Write JSON file
with open(r'C:\Users\agney\Documents\Files\Projects\doctor-directory\public\clinics.json', 'w', encoding='utf-8') as f:
    json.dump(clinics_list, f, indent=2, ensure_ascii=False,default=default_serializer)

with open(r'C:\Users\agney\Documents\Files\Projects\doctor-directory\public\derms.json', 'w', encoding='utf-8') as f:
    json.dump(pract_list, f, indent=2, ensure_ascii=False)
print("JSON file generated successfully at devices.json")
# for index,row in df.iterrows():
#     df.at[index,'slug']=unquote_plus(row['links'].split("/place/")[-1].split("/")[0].replace("+"," "))
# df.to_excel(r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\5600_UK_slug.xlsx",sheet_name='Sheet1')