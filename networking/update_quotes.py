import requests
import json

# API URL for ZenQuotes, fetching multiple quotes
api_url = 'https://zenquotes.io/api/quotes'
response = requests.get(api_url)

if response.status_code == 200:
    quotes_data = response.json()
    # Extracting only the quote text
    quotes = [quote['q'] for quote in quotes_data]

    # Writing the new quotes to quotes.json file
    with open('networking/quotes.json', 'w') as f:
        json.dump(quotes, f, indent=4)
    
    print("quotes.json file updated with the latest quotes.")
else:
    print(f"Error: {response.status_code}")
