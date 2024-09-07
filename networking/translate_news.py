import json
from libretranslatepy import LibreTranslateAPI

# Function to translate text
def translate_text(text, target_language):
    lt = LibreTranslateAPI("https://translate.terraprint.co/")  # Use your preferred LibreTranslate API URL
    return lt.translate(text, target_language)

# Function to translate headlines and save to individual files
def translate_headlines(news_data, target_languages):
    for lang_name, lang_code in target_languages.items():
        translated_data = {"headlines": []}
        for headline in news_data['headlines']:
            translated_headline = translate_text(headline, lang_code)
            translated_data["headlines"].append(translated_headline)
        
        # Save each translation in a separate JSON file
        with open(f'news_{lang_code}.json', 'w', encoding='utf-8') as file:
            json.dump(translated_data, file, ensure_ascii=False, indent=4)
        print(f"Translation saved to news_{lang_code}.json")

# Main execution
if __name__ == "__main__":
    # Load original news.json
    with open('news.json', 'r', encoding='utf-8') as file:
        news_data = json.load(file)
    
    # Define target languages (ISO codes)
    languages = {
        "Portuguese": "pt",
        "Punjabi": "pa",
        "French": "fr",
        "German": "de",
        "Russian": "ru",
        "Arabic": "ar"
    }
    
    # Translate and save headlines
    translate_headlines(news_data, languages)
