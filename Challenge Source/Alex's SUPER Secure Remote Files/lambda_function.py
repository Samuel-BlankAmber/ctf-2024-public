import json
from base64 import b64encode
from urllib.request import urlopen
import re

def lambda_handler(event, context):
    path = event.get("rawPath")
    query_params = event.get("queryStringParameters")

    if path == "/":
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "text/plain"
            },
            "body": ("After the recent data breaches, the Company has decided to get rid"
                     " of Alex, and instead hire his twin, Adam. Adam has a"
                     " keen eye for security and definitely won't let anything slip!"
                     "\n\nAPI Example:\n/scan?url=https://x0.at/qVVL.png")
        }

    if path == "/scan":
        url = query_params.get("url") if query_params else None
        if not url:
            return {
                "statusCode": 400,
                "body": json.dumps("No url provided. Use ?url=<your-url>.")
            }

        if re.match(r"\s*file:(///[a-zA-Z]|/[a-zA-Z]|[a-zA-Z])", url):
            return {
                "statusCode": 400,
                "body": json.dumps("Nice try, but you're not going to fool me that easily.")
            }

        try:
            response = urlopen(url)
        except Exception as e:
            return {
                "statusCode": 400,
                "body": json.dumps(f"Failed to open URL: {e}")
            }

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
