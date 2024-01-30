import base64
from datetime import datetime
import wave
from bson import ObjectId, json_util
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from pymongo import MongoClient
from dateutil import parser
from .utils import generate_text, speechToText, textToSpeech
from pydub import AudioSegment
from django.core.files.storage import default_storage




client = MongoClient("localhost", 27017)
db = client.english_teacher
collection = db.chat

id = None
chat_history = None

@api_view(['POST'])
def initialization(request):
    global id
    timestamp = datetime.utcnow()

    # Format the timestamp
    formatted_timestamp = timestamp.strftime('%m/%d/%Y %H:%M:%S')
    response_data = {
        'role': 'system',
        'content': "You are an English Professor. Follow these steps to answer the user \n\nStep 1 - First, check if the english grammar is correct. \n\nStep 2 - If the english grammar is not correct, you should provide the correct way of speaking and explain why \n\nStep 3 - Continue the conversation",
        'timestamp': formatted_timestamp,  # Use UTC time for consistency
    }
    
    # Insert a new document into the collection and store its _id
    inserted_id = collection.insert_one({'chat':[response_data]}).inserted_id
    id = str(inserted_id)  # Convert ObjectId to string for simplicity
    return Response({'id': id}, status=201)

@api_view(['POST'])
def chat(request):
    global id
    if id is None:
        return Response({'error': 'No chat initialized'}, status=400)
    
    print(request.data)

    new_message = {
        'role': request.data['chat']['role'],
        'content': request.data['chat']['content'],
        'timestamp': datetime.utcnow(),
    }

    
    collection.update_one({'_id': ObjectId(id)}, {'$push': {'chat': new_message}})

    data = collection.find_one({'_id':ObjectId(id)})
    result_list = []

    # Iterate through the 'content' list
    for item in data['chat']:
        # Check if the item is a dictionary with 'user' and 'content' keys
        if isinstance(item, dict) and 'role' in item and 'content' in item:
            role = item['role']
            content = item['content']
            result_list.append({"role": role, "content": content})    

    generated_text = generate_text(result_list)

    new_message_system = {
        'role': 'assistant',
        'content': generated_text,
        'timestamp': datetime.utcnow(),
    }

    collection.update_one({'_id': ObjectId(id)}, {'$push': {'chat': new_message_system}});

    responseData = collection.find_one({'_id':ObjectId(id)})
    if responseData:
            # Convert ObjectId to string for JSON serialization
            responseData['_id'] = str(responseData['_id'])
            return Response(responseData, status=200)
    else:
            return Response({"error": "Chat not found"}, status=404)

@api_view(['GET'])
def get_chat(request):
    try:
        # Execute the find query with projection to include only the timestamp field
        data = list(collection.find({}, {'chat.timestamp': 1, '_id': 0}))        
        if data:
            return Response(data)
        else:
            return Response({"error": "Chat not found"}, status=404)
    except Exception as e:
        return Response({"error": f"Error retrieving data: {str(e)}"}, status=500)
    
from datetime import datetime

@api_view(['GET'])
def getByDate(request):
    try:
        global id
        date_str = request.GET.get('date')
        date_obj = datetime.strptime(date_str, "%a %b %d %Y %H:%M:%S GMT%z (%Z)")
        
        formatted_timestamp = date_obj.strftime('%m/%d/%Y %H:%M:%S')

        # Use projection to exclude the '_id' field
        data = collection.find_one({'chat.0.timestamp': formatted_timestamp})
        print(formatted_timestamp)
        id = data["_id"]
        if data:
            # Convert ObjectId to string for JSON serialization
            data['_id'] = str(data['_id'])
            
            return Response(data, status=200)
        else:
                return Response({"error": "Chat not found"}, status=404)
        serialized_data = list(data['chat'])
        serialized_data = json_util.dumps(data['chat'])  # Serialize the data
        print('Date', id, serialized_data)        
        return Response(serialized_data)
    except Exception as e:
        return Response({"error": f"Error retrieving data: {str(e)}"}, status=500)

@api_view(['POST'])
def voice(request):
    try:
        audio_data = request.FILES['recording']        
        file_name = default_storage.save('C:/Users/leona/Desktop/Projects/EnglishTeacher_bot/englishteacher_bot/media/' + audio_data.name, audio_data)
        filepath =  'C:/Users/leona/Desktop/Projects/EnglishTeacher_bot/englishteacher_bot/media/' + audio_data.name

        transcript = speechToText(filepath) 

        with open(filepath, "rb") as audio_file:
            encoded_audio_user = base64.b64encode(audio_file.read()).decode('utf-8')       

        new_message = {
        'role': 'user',
        'content_name': audio_data.name,
        'content': transcript.text,
        'timestamp': datetime.utcnow(),
        'audio_content': encoded_audio_user
        }        
        
        collection.update_one({'_id': ObjectId(id)}, {'$push': {'chat': new_message}})
        
        data = collection.find_one({'_id':ObjectId(id)})
        result_list = []

        # Iterate through the 'content' list
        for item in data['chat']:
            # Check if the item is a dictionary with 'user' and 'content' keys
            if isinstance(item, dict) and 'role' in item and 'content' in item:
                role = item['role']
                content = item['content']
                result_list.append({"role": role, "content": content})    

        generated_text = generate_text(result_list)

        speechFile = textToSpeech(generated_text)

        with open(speechFile['path'], "rb") as audio_file:
            encoded_audio_assistant = base64.b64encode(audio_file.read()).decode('utf-8')  

        assistant_new_message = {
        'role': 'assistant',
        'content_name': speechFile['name'],
        'content': generated_text,
        'timestamp': datetime.utcnow(),
        'audio_content': encoded_audio_assistant
        }   

        collection.update_one({'_id': ObjectId(id)}, {'$push': {'chat': assistant_new_message}})

        responseData = collection.find_one({'_id':ObjectId(id)})
        if responseData:
            # Convert ObjectId to string for JSON serialization
            responseData['_id'] = str(responseData['_id'])
            return Response(responseData, status=200)
        else:
            return Response({"error": "Chat not found"}, status=404)

    except Exception as e:
        return Response({'success': False, 'error': str(e)})