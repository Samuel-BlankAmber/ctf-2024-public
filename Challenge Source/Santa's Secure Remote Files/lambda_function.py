import json
from base64 import b64encode
from urllib.request import urlopen

def lambda_handler(event, context):
    path = event.get("rawPath")
    query_params = event.get("queryStringParameters")

    if path == "/":
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "text/plain"
            },
            "body": ("Santa has decided to move into the security sector."
                     " He has hired his most brilliant elf, Rupert, to develop"
                     " the Surveillance Network of Observation and Watchfulness, or"
                     " SNOW for short. The first step of this is a malware detection"
                     " service that scans any incoming files."
                     "\n\nAPI Example:\n/scan?url=https://x0.at/X9K8.jpg")
        }

    if path == "/scan":
        url = query_params.get("url") if query_params else None
        if not url:
            return {
                "statusCode": 400,
                "body": json.dumps("No url provided. Use ?url=<your-url>.")
            }

        response = urlopen(url)
        content_length = response.headers.get("Content-Length")
        if not content_length:
            # No content is suspicious!
            return {
                "statusCode": 406,
                "body": json.dumps("Malware!")
            }
        if int(content_length) > 2000:
            # Too big, it must be malware!
            return {
                "statusCode": 406,
                "body": json.dumps("Malware!")
            }
        base64_encoded = b64encode(response.read()).decode("utf-8")
        return {
            "statusCode": 200,
            "body": base64_encoded
        }

    return {
        "statusCode": 404,
        "body": json.dumps("Route not found.")
    }
