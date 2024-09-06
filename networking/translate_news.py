import json
import subprocess

# List of languages and their file suffixes
languages = {
    'fr': 'French',
    'pt': 'Portuguese',
    'pa': 'Punjabi',
    'de': 'German',
    'ru': 'Russian',
    'ar': 'Arabic'
}

# Function to call node script for translation
def translate_text(text, target_lang):
    try:
        result = subprocess.run(
            ['node', 'translate.js', text, target_lang],
            capture_output=True,
            text=True
        )
        return result.stdout.strip()
    except Exception as e:
        print(f"Error during translation: {e}")
        return None

# Load the original news.json file
with open('networking/news.json', 'r') as f:
    news_data = json.load(f)

# Loop through each language and generate translated files
for lang_code, lang_name in languages.items():
    translated_news = {}
    for title in news_data:
        translated_text = translate_text(title, target_lang=lang_code)
        translated_news[title] = translated_text
    
    # Save the translated data to a new JSON file
    translated_file = f'networking/news_{lang_code}.json'
    with open(translated_file, 'w', encoding='utf-8') as f:
        json.dump(translated_news, f, ensure_ascii=False, indent=4)
    
    print(f"Translation complete: {translated_file}")
