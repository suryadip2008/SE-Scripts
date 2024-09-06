import requests
import json

# API endpoint to fetch 10 random quotes
api_url = 'https://api.api-ninjas.com/v1/quotes?limit=10'
headers = {'X-Api-Key': 'fDfoOTpsStHRc19vimAMjA==9nwVTXbZUXhitKYZ'}

# Fetch the quotes data
response = requests.get(api_url, headers=headers)

# Check if the response is successful
if response.status_code == requests.codes.ok:
    quotes_data = response.json()

    # Extract only the quote text from the API response
    if len(quotes_data) > 0:
        quotes = [quote['quote'] for quote in quotes_data]

        # Overwrite the networking/quotes.json file with new quotes
        with open('networking/quotes.json', 'w') as f:
            json.dump(quotes, f, indent=4)
        print("quotes.json file updated with the latest quotes.")
    else:
        print("No quotes found.")
else:
    print(f"Error: {response.status_code}, {response.text}")
