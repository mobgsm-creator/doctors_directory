import pandas as pd
import json
import textwrap
import re
import ast
import unicodedata
import spacy
import numpy as np

from sklearn.metrics.pairwise import cosine_similarity
#df = pd.read_json(r'C:\Users\agney\Documents\Files\Projects\doctor-directory\public\clinics_processed.json')
df= pd.read_excel(r"C:\Users\agney\Documents\Files\Projects\clinics_processed.xlsx")
values = set()
bl = ['Monday', 'Sat', 'Tue', 'Thu', 'Fri', 'Mon-Fri', 'Sun', 'SourceNote', 'Sat-Sun', 'Mon', 'Wed', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Source','Typical_hours_recorded_in_public_listings', 'Notes', 'Note']
for index,row in df.iterrows():
    try:
        loaded_json = json.loads(row['hours'].replace("'",'"'))
        if len(loaded_json.keys() - bl)>=3:
                print(index, loaded_json.keys() - bl)
                df.at[index,'error']=1
    except Exception as e:
        #df.at[index,'error']=1
        pass
df.to_csv("test2.csv")
time.sleep(100)
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


#Repetitions in practitioner about section
#Build errors SSG
#Data transform errors


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
                print(name)
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
            print("Before:",len(roles), len(qualifications), len(awards), len(news), len(exp))
            
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
            print("After:",len(roles), len(qualifications), len(awards), len(news), len(exp))
            df.at[index, 'Roles_And_Positions'] = json.dumps(roles)
            df.at[index, 'Qualifications_And_Professional_Affiliations'] = json.dumps(qualifications)
            df.at[index, 'Awards_And_Recognition'] = json.dumps(awards)
            df.at[index, 'Media_And_News_Features'] = json.dumps(news)
            df.at[index, 'Experience_And_Practice_Profile'] = json.dumps(exp)
        except Exception as e:
            #print(f"[WARN] Exception at index {index}: {e}")
            pass
    return df

df_clinics = enrich_data(df_clinics)
df_practitioners = enrich_data(df_practitioners)
df_practitioners.to_csv("test2_pract.csv")  
df_clinics.to_csv("test2_clinics.csv")
    

#slugs brackets)