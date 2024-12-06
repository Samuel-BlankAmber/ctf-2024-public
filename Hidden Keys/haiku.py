from openai import OpenAI

client = OpenAI(api_key="sk-proj-KAINOS{n3v3r_c0mm1t_y0ur_k3ys!}")

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Write a haiku about recursion in programming."
        }
    ]
)

print(completion.choices[0].message.content)
