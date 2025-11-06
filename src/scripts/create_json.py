# generate_devices_json.py
import pandas as pd
from urllib.parse import unquote_plus
import json
JCCP_Greens = r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\prod_DB\JCCP_Greens_P.csv"
JCCP_Yellows = r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\prod_DB\JCCP_Yellow_C.csv"
doctify_jccp = r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\prod_DB\practitioners\DB.xlsx"
# Path to your CSV file
csv_file = doctify_jccp 

# Load CSV
#df = pd.read_csv(csv_file)
df = pd.read_excel(doctify_jccp,sheet_name='Sheet1')
def clean(x):
    if "Show less" in x:
        x = x.split("Show less")
        clean_x = "".join(x[:len(x)-1])+'"]'
        return clean_x
    else: 
        return x
df['SPECIALTIES'] = df['SPECIALTIES'].apply(lambda x: clean(x))

# Convert DataFrame to list of dicts
devices_list = df.to_dict(orient='records')



# # Write JSON file
with open('derms.json', 'w', encoding='utf-8') as f:
    json.dump(devices_list, f, indent=2, ensure_ascii=False)

# print("JSON file generated successfully at devices.json")
# for index,row in df.iterrows():
#     df.at[index,'slug']=unquote_plus(row['links'].split("/place/")[-1].split("/")[0].replace("+"," "))
# df.to_excel(r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\5600_UK_slug.xlsx",sheet_name='Sheet1')