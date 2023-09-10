from flask import Flask, request, jsonify
import requests
import concurrent.futures

app = Flask(__name__)

def fetch_numbers(url):
    try:
        response = requests.get(url, timeout=0.5)
        if response.status_code == 200:
            data = response.json()
            if "numbers" in data and isinstance(data["numbers"], list):
                return set(data["numbers"])
    except requests.exceptions.Timeout:
        pass  # Ignore timeouts
    except Exception as e:
        print(f"Error fetching data from {url}: {e}")
    return set()

@app.route("/numbers", methods=["GET"])
def get_numbers():
    urls = request.args.getlist("url")
    unique_numbers = set()

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(fetch_numbers, url) for url in urls]
        for future in concurrent.futures.as_completed(futures):
            unique_numbers.update(future.result())

    unique_numbers = sorted(unique_numbers)
    
    return jsonify({"numbers": unique_numbers})

if __name__ == "__main__":
    app.run(port=8008)
