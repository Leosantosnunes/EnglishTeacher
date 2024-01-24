
from openai import OpenAI
from django.core.files import File
from pydub import AudioSegment
from pathlib import Path
import os


client = OpenAI()

def generate_text(chat_history):
    response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=chat_history)
    return response.choices[0].message.content
  

def speechToText(filepath):
    audio_file= open(filepath, "rb")    
    
    transcript = client.audio.transcriptions.create(
        model="whisper-1", 
        file=audio_file)
    return transcript
