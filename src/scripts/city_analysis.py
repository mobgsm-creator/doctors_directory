import json
import re
import pandas as pd
import ast
import torch
from sentence_transformers import SentenceTransformer, util
import spacy
nlp = spacy.load("en_core_web_lg")
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
STOP_WORDS = set(spacy.lang.en.stop_words.STOP_WORDS)
df = pd.read_json(r"C:\Users\agney\Documents\Files\Projects\doctor-directory\public\clinics_processed_new.json")
cities = df.City.unique()
fees_intent = [
    "Anti-Wrinkle Injections (example start price): From approximately £300 per area.",
    "Procedures from approx. £600 (e.g., tear trough rejuvenation)",
    "£35 (30 mins)",
    "Botox from ~£150; Fillers from ~£200",
    "Wrinkle reducing injections (1 facial area, 20–30 units): £210",
    "Wrinkle reducing injections (2 facial areas, 30–40 units): £275",
    "Wrinkle reducing injections (3 facial areas, 40–50 units): £330",
    "Crows' feet only: £135",
    "Treatment for hyperhidrosis (both underarms): £440",
    "Genuine Dermaroller (single treatment): £250",
    "Genuine Dermaroller (course of 3): £600",
    "Silhouette Soft Thread Lift: from £600",
    "Tear troughs (specialist filler treatment): £350",
    "Sculptra per vial: £300"
]

payments_intent = [ 'Card payments', 'Online booking', 'Cash payments', 'PayPal', 'Credit cards', 'Debit cards', 'Cheque payments', 'Bank transfers','NHS']
def preprocess(text):
    if not isinstance(text, str):  # Check if input is not a string
        return ""  # Return an empty string if input is not a string
    doc = nlp(text)
    tokens = [token.text for token in doc if token.text.lower() not in STOP_WORDS and not token.is_punct]
    return " ".join(tokens)

def calculate_similarity(embedding1, embedding2):
    return util.pytorch_cos_sim(embedding1, embedding2)

def calculate_similarity_scores(new_comments, base_comments):
    new_comments_preprocessed = [preprocess(comment) for comment in new_comments]
    base_comments_preprocessed = [preprocess(comment) for comment in base_comments]
    new_embeddings = model.encode(new_comments_preprocessed, convert_to_tensor=True)
    base_embeddings = model.encode(base_comments_preprocessed, convert_to_tensor=True)
    similarity_matrix = calculate_similarity(new_embeddings, base_embeddings)
    avg_similarities = torch.mean(similarity_matrix, dim=1)  # Calculate mean along rows
    
    return avg_similarities

df_final = pd.DataFrame()
for index,city in enumerate(cities):
    print(index,len(df_final))
    df_city = df[df.City == city]
    number_of_clinics = f"Number of cinics: {len(df_city)}"
    # samples = set()
    # sample_clinics = df_city.slug.to_list()[:5] 
    # sample_addresses = df_city.gmapsAddress.to_list()[:5]
    # for index, clinic in enumerate(sample_clinics):
    #     samples.add(f"Clinic: {clinic}, Address: {sample_addresses[index]}")
    unique_categories = f"Unique Categories: {df_city.category.unique()}"
    review_count = f"Review Count: {df_city.reviewCount.sum()}"
    ratings = f"Average Rating: {df_city.rating.mean()}"
    unique_specializations = set()
    target_sentences = set()
    df_new = pd.DataFrame()
    for item in df_city.Fees.to_list():
        sentence_list = str(item).split(",")
        for sentence in sentence_list:
            sentence = preprocess(sentence)
            target_sentences.add(sentence)
    similarity_scores = calculate_similarity_scores(target_sentences, fees_intent)
    df_new["Sentence"] = list(target_sentences)
    df_new["Similarity_Score"] = similarity_scores
    df_new = df_new[df_new.Similarity_Score > 0.2]
    fees_text = f"Price info: {str(df_new.Sentence.to_list())}"
    for items in df_city.Treatments:
        for item in items:
            unique_specializations.add(item)
    treatments = f"Treatments: {str(list(unique_specializations))}"
    acc = f"Accreditations: {str(df_city.accreditations.to_list())}"
    df_final.at[index,"City"] = city
    df_final.at[index,"Number of Clinics"] = number_of_clinics
    df_final.at[index,"Unique Categories"] = unique_categories
    df_final.at[index,"Unique Specializations"] = treatments
    df_final.at[index,"Accreditations"] = acc
    df_final.at[index,"Fees"] = fees_text
    df_final.at[index, "Reviews"] = review_count
    df_final.at[index, "Rating"] = ratings
    #df_final.at[index, "Samples"] = str(list(samples))
    df_final.to_csv("City Data.csv")