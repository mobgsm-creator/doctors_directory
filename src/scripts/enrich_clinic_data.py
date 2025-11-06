import json
import pandas as pd
import ast
from fuzzywuzzy import fuzz
df = pd.read_excel(r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\old data\5600_UK_slug.xlsx",sheet_name='Sheet2')
for index,row in df.iterrows():
    if index % 50 == 0:
        print(index)
    try:    
        lst = set()
        p = json.loads(row['Review Analysis'])
        result = []
        names = []
        for i in p['practitioners']:
            names.append(i['name'])

        for j in names:
             if not any(fuzz.ratio(j, existing) >= 70 for existing in result):
                result.append(j)
        print(result)
        for k in result:
            if(len(result)>3):
                if(row['Review Analysis'].count(k)>3):
         
                    if i['role_title'].lower() in ["staff","doctor", "dr", "nurse", "therapist", "aesthetician", "specialist", "surgeon", "clinician", "consultant"]:
                        lst.add(f"{row['gmaps_address']} {row['slug']} {k} Search google and linkedin to get all the information")
            else:
                if i['role_title'].lower() in ["staff","doctor", "dr", "nurse", "therapist", "aesthetician", "specialist", "surgeon", "clinician", "consultant"]:
                    lst.add(f"{row['gmaps_address']} {row['slug']} {k} Search google and linkedin to get all the information")
                            
        df.at[index,'keyword'] = json.dumps(list(lst), ensure_ascii=False)

        
    except Exception as e:
        print(index,e)
        pass
df['keyword'] = df['keyword'].apply(lambda x: json.loads(x) if pd.notnull(x) else [])
df_exploded = df.explode('keyword', ignore_index=True)
df_exploded.to_excel(r"C:\Users\agney\Documents\Files\Projects\UK-Dermatologists\5600_UK_slug_search.xlsx",sheet_name='Sheet1')
