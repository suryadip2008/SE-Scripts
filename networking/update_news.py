import requests
import json

# API endpoint and parameters
url = ('https://newsapi.org/v2/top-headlines?'
       'country=us&'
       'apiKey=73309e4f35f649eb90fdf02c81c5bcd6')

# Fetch the news data
response = requests.get(url)
news_data = response.json()

if news_data['status'] != 'ok':
    print(f"API returned an error: {news_data.get('message', 'Unknown error')}")

# Print the entire response for debugging
print(news_data)  # Check if the API returns data

# Extract headlines (only titles) if articles are present
if 'articles' in news_data and len(news_data['articles']) > 0:
    headlines = [article['title'] for article in news_data['articles']]

    # Prepare the JSON data
    news_json = {"headlines": headlines}

    # Save the headlines to networking/news.json
    with open('networking/news_en.json', 'w') as f:
        json.dump(news_json, f, indent=4)
    print("news_en.json file updated with latest headlines.")
else:
    print("No articles found or API error.")
