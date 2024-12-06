"""
This script uses the OpenAI API to generate a haiku about API keys and security.
Functions:
  gen_haiku(): Generates a haiku using the OpenAI API.
Dependencies:
  openai: The OpenAI Python client library.
Usage:
  Run the script to print a haiku about API keys and security.
"""

from openai import OpenAI

client = OpenAI(api_key="REDACTED")

def gen_haiku():
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": "Write a haiku about API keys and security."
            }
        ]
    )
    return completion.choices[0].message.content

print(gen_haiku())
