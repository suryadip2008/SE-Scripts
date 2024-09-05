import requests
import json

# API endpoint and parameters
url = ('https://newsapi.org/v2/everything?'
       'q=Apple&'
       'from=2024-09-05&'
       'sortBy=popularity&'
       'apiKey=73309e4f35f649eb90fdf02c81c5bcd6')

# Fetch the news data
response = requests.get(url)
news_data = response.json()

# Extract headlines (only titles)
headlines = [article['title'] for article in news_data['articles']]

# Prepare the JSON data
news_json = {"headlines": headlines}

# Save the headlines to networking/news.json
with open('networking/news.json', 'w') as f:
    json.dump(news_json, f, indent=4)

print("news.json file updated with latest headlines.")