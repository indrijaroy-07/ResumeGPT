import json
import urllib.request
import os

api_key = "AIzaSyD2LF4FqwOyIlhXwsowZstpkIfwZa-4JEY"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f"Error: {e}")
