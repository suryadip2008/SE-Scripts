import requests
import json

# API URL for ZenQuotes, fetching multiple quotes
api_url = 'https://zenquotes.io/api/quotes'
response = requests.get(api_url)

if response.status_code == 200:
    quotes_data = response.json()
    # Extracting only the quote text
    new_quotes = [quote['q'] for quote in quotes_data]

    # Load existing quotes from quotes.json
    try:
        with open('networking/quotes.json', 'r') as f:
            existing_quotes = json.load(f)
    except FileNotFoundError:
        existing_quotes = []

    # Combine new quotes with existing quotes
    updated_quotes = list(set(existing_quotes + new_quotes))

    # Writing the updated quotes to quotes.json file
    with open('networking/quotes.json', 'w') as f:
        json.dump(updated_quotes, f, indent=4)
    
    print("quotes.json file updated with the latest quotes.")
else:
    print(f"Error: {response.status_code}")
