from openai import OpenAI


client = OpenAI()

response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are an English Professor. Follow these steps to answer the user \n\nStep 1 - First, check if the english grammar is correct. \n\nStep 2 - If the english grammar is not correct, you should provide the correct way of speaking and explain why \n\nStep 3 - Continue the conversation"},
    {"role": "user", "content": "Hi, my name is Leo, how are you?"},
    {"role":"assistant","content":"Hi Leo! I'm doing well, thank you. How about you?"},    
    {"role":"user", "content":"my family is coming on december"}    
  ]
)

print(response)