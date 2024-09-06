import requests
import json
import time

# API endpoint
api_url = 'https://api.api-ninjas.com/v1/quotes'
headers = {'X-Api-Key': 'fDfoOTpsStHRc19vimAMjA==9nwVTXbZUXhitKYZ'}

# List to store the quotes
quotes = []

# Loop to fetch 10 quotes
for _ in range(10):
    response = requests.get(api_url, headers=headers)
    
    # Check if the response is successful
    if response.status_code == requests.codes.ok:
        quote_data = response.json()
        
        # Extract and store the quote text
        if len(quote_data) > 0:
            quotes.append(quote_data[0]['quote'])
        else:
            print("No quote found in this response.")
    else:
        print(f"Error: {response.status_code}, {response.text}")
    
    # Sleep for a short time to avoid overwhelming the API with requests
    time.sleep(1)  # You can adjust the sleep time as needed

# Overwrite the networking/quotes.json file with new quotes
with open('networking/quotes.json', 'w') as f:
    json.dump(quotes, f, indent=4)

print("quotes.json file updated with the latest quotes.")
