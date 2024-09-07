import json
from translate import Translator
import os

# Define the path to the news.json file
news_file_path = 'networking/news.json'

# Define the target languages and their respective file suffixes
languages = {
    "pt": "Portuguese",
    "pa": "Punjabi",
    "fr": "French",
    "de": "German",
    "ru": "Russian",
    "ar": "Arabic"
}

# Load the news headlines from the original news.json file
with open(news_file_path, 'r') as f:
    news_data = json.load(f)

# Extract the headlines
headlines = news_data.get("headlines", [])

# Function to translate headlines and save to a new JSON file
def translate_and_save(headlines, lang_code, lang_name):
    translated_headlines = []

    # Set up the translator for the target language
    translator = Translator(to_lang=lang_code)

    # Translate each headline
    for headline in headlines:
        try:
            translated = translator.translate(headline)
            translated_headlines.append(translated)
        except Exception as e:
            print(f"Failed to translate to {lang_name}: {e}")
            return
    
    # Prepare the translated data in JSON format
    translated_data = {
        "headlines": translated_headlines
    }
    
    # Save the translated headlines to a new file in the networking folder
    translated_file_path = f'networking/news_{lang_code}.json'
    with open(translated_file_path, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=4)

# Translate headlines to all specified languages and save them
for lang_code, lang_name in languages.items():
    translate_and_save(headlines, lang_code, lang_name)

print("Translation completed and saved to respective JSON files.")
