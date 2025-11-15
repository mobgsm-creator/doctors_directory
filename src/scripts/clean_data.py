import pandas as pd
import json
import textwrap
import re
import ast


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
df= pd.read_excel(r"C:\Users\agney\Downloads\5600_UK_slug_search_results_2k_.xlsx",sheet_name='exists')
print(len(df))
def parse_accreditations(accreditations):
    result = ""
    try:
        if type(accreditations) == list:
            try:
                result = "".join(accreditations)
            except Exception as e:
                result = "".join(accreditations[0])
        elif type(accreditations) == dict:
            result="".join([key+": "+accreditations[key]+"\n" for key in accreditations.keys()])
        elif type(accreditations) == str:
            result="\nAccreditations: "+accreditations
    except Exception as e:
        pass
    return result


for index,row in df.iterrows():
    try:
        data_dict=json.loads(re.sub(r':contentReference\[oaicite:\d+\]\{index=\d+\}', '', json.loads(row['json_response'])))
        try:
            about_section=data_dict['ABOUT']+parse_accreditations(data_dict['ACCREDITATIONS'])
        except Exception as e:
            pass
        try:
            accreditiations = parse_accreditations(data_dict['ACCREDITATIONS'])
        except Exception as e:
            pass
        try:
            accreditiations=accreditiations+"\n"+parse_accreditations(data_dict['AWARDS'])
        except Exception as e:
            pass
        try:
            accreditiations=accreditiations+"\n"+parse_accreditations(data_dict['AFFILIATIONS'])
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
            df.at[index, 'isJCCP']=str(isJCCP)
            df.at[index,'isCQC']=str(isCQC)
            df.at[index,'isHIW']=str(isHIW)
            df.at[index,'isHIS']=str(isHIS)
            df.at[index,'isRQIA']=str(isRQIA)
        except Exception as e:
            print("ere",e)
            pass

        try:

            df.at[index,'about_section']=about_section
            df.at[index,'accreditations']=accreditiations
            df.at[index,'hours']=json.dumps(hours)
            df.at[index,'Practitioners']=json.dumps(data_dict['PRACTITIONERS'])
            df.at[index, 'Insurace'] = json.dumps(data_dict['INSURANCE_ACCEPTED'])
            df.at[index, 'Payments'] = json.dumps(data_dict['PAYMENT_OPTIONS'])
            df.at[index, 'Fees'] = json.dumps(data_dict['ESTIMATED_FEES'])
        except Exception as e:
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
 
        

        # # Write the error info to file
        with open(f"json_error_debug_{index}.txt", "w", encoding="utf-8") as f:
            f.write(e.doc)
        
        # print("JSON error details written to json_error_debug.txt")
        # print(f"\n{error_info}")
        pass


df.to_csv("test1.csv")