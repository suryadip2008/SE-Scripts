import requests
import json

# API endpoint and parameters
category = 'happiness'
api_url = 'https://api.api-ninjas.com/v1/quotes?category={}'.format(category)
headers = {'X-Api-Key': 'fDfoOTpsStHRc19vimAMjA==9nwVTXbZUXhitKYZ'}

# Fetch the quotes data
response = requests.get(api_url, headers=headers)

# Check if the response is successful
if response.status_code == requests.codes.ok:
    quotes_data = response.json()

    # Extract the quotes (text and author) if available
    if len(quotes_data) > 0:
        quotes = [{"quote": quote['quote'], "author": quote['author']} for quote in quotes_data]

        # Prepare the JSON data
        quotes_json = {"quotes": quotes}

        # Overwrite the networking/quotes.json file with new quotes
        with open('networking/quotes.json', 'w') as f:
            json.dump(quotes_json, f, indent=4)
        print("quotes.json file updated with the latest quotes.")
    else:
        print("No quotes found.")
else:
    print(f"Error: {response.status_code}, {response.text}")
