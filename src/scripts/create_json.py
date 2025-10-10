# generate_devices_json.py
import pandas as pd
import json
JCCP_Greens = r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\prod_DB\JCCP_Greens_P.csv"
JCCP_Yellows = r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\prod_DB\JCCP_Yellow_C.csv"
doctify_jccp = r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\prod_DB\practitioners\DB.xlsx"
# Path to your CSV file
csv_file = JCCP_Yellows

# Load CSV
#df = pd.read_csv(csv_file)
df = pd.read_excel(doctify_jccp,sheet_name='p1')


# Convert DataFrame to list of dicts
devices_list = df.to_dict(orient='records')



# Write JSON file
with open('derms.json', 'w', encoding='utf-8') as f:
    json.dump(devices_list, f, indent=2, ensure_ascii=False)

print("JSON file generated successfully at devices.json")
