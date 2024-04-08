import json
import requests
import numpy as np

API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
api_token = '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'
headers = {"Authorization": f"Bearer {api_token}"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

def text_similarity(flat_msg_list, pormpt) :
    data = query(
        {
            "inputs": {
                "source_sentence": pormpt,
                "sentences": flat_msg_list
            }
        })

    sorted_idx = np.argsort(data)
    top_3_idx = sorted_idx[-3:]
    
    return top_3_idx