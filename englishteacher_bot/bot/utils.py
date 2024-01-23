from openai import OpenAI

client = OpenAI()

def generate_text(chat_history):
    response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=chat_history)
    return response.choices[0].message.content
  

