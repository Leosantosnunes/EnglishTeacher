
from datetime import datetime
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

def textToSpeech(input):
    filename = datetime.utcnow().strftime('%m%d%Y%H%M%S')
    speech_file_path = "C:/Users/leona/Desktop/Projects/EnglishTeacher_bot/englishteacher_bot/media/generatedMedia/"+filename+".mp3"
    response = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input=input
)
    response.stream_to_file(speech_file_path)
    return {'name':filename+".mp3", 'path': speech_file_path}
