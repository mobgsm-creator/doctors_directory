# generate_devices_json.py
import pandas as pd
from urllib.parse import unquote_plus
import json
import time
import numpy as np
import unicodedata
import re
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
        slug= re.sub(r'^-|-$', '', slug)
    except Exception as e:
        print(e)
        slug = None

    return slug

# def clean(x):
#     if "Show less" in x:
#         x = x.split("Show less")
#         clean_x = "".join(x[:len(x)-1])+'"]'
#         return clean_x
#     else: 
#         return x
# df['SPECIALTIES'] = df['SPECIALTIES'].apply(lambda x: clean(x))
df_clinics = pd.read_csv(r"C:\Users\agney\Documents\Files\Projects\doctor-directory\test2_clinics.csv")
# Convert DataFrame to list of dicts
df_clinics['slug'] = df_clinics['slug'].apply(slugify)
df_clinics = df_clinics.replace([None, np.nan, "None"], "")
#df.to_csv("Clinics3.5k.csv")
clinics_list = df_clinics.to_dict(orient='records')


df_pract = pd.read_csv(r"C:\Users\agney\Documents\Files\Projects\doctor-directory\test2_pract.csv")
# Convert DataFrame to list of dicts
df_pract['practitioner_name'] = df_pract['Practitioner_Name'].apply(slugify)
df_pract = df_pract.replace([None, np.nan, "None"], "")
#df.to_csv("Clinics3.5k.csv")
pract_list = df_pract.to_dict(orient='records')


# # # Write JSON file
with open(r'C:\Users\agney\Documents\Files\Projects\doctor-directory\public\clinics.json', 'w', encoding='utf-8') as f:
    json.dump(clinics_list, f, indent=2, ensure_ascii=False)

with open(r'C:\Users\agney\Documents\Files\Projects\doctor-directory\public\derms.json', 'w', encoding='utf-8') as f:
    json.dump(pract_list, f, indent=2, ensure_ascii=False)
print("JSON file generated successfully at devices.json")
# for index,row in df.iterrows():
#     df.at[index,'slug']=unquote_plus(row['links'].split("/place/")[-1].split("/")[0].replace("+"," "))
# df.to_excel(r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\5600_UK_slug.xlsx",sheet_name='Sheet1')