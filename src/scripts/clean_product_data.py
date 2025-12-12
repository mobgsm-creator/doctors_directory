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
df= pd.read_excel(r"C:\Users\agney\Desktop\Aesthetic Products\Grouped_Data.xlsx", sheet_name='Sheet2')
error_count = 0
for index,row in df.iterrows():
    try:
        try:
            loaded_json = json.loads(row['json_response'])
            data_dict=json.loads(re.sub(r':contentReference\[oaicite:\d+\]\{index=\d+\}', '', loaded_json))
        except Exception as e:
            
            if row['json_response'][-1] == '"' and row['json_response'][0] == '"':
                loaded_json = json.loads(row['json_response'][1:-1])
                if type(loaded_json) != dict:
                    data_dict=json.loads(re.sub(r':contentReference\[oaicite:\d+\]\{index=\d+\}', '', loaded_json))
            pass
        #data_dict=json.loads(re.sub(r':contentReference\[oaicite:\d+\]\{index=\d+\}', '', loaded_json))
    except Exception as e:
        
        if(type(loaded_json) == dict):
            data_dict=loaded_json
        pass

    #Got data dicts
    try:
        for key in data_dict.keys():
            df.at[index,key]=json.dumps(data_dict[key])
    except Exception as e:
        print(index)
        pass



df.to_csv("Products.csv")
