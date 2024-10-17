import json
import requests
import numpy as np

API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
api_token = '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'
headers = {"Authorization": f"Bearer {api_token}"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

def text_similarity(flat_msg_list, prompt) :
    if type(prompt) != type([]) :
        data = query(
            {
                "inputs": {
                    "source_sentence": prompt,
                    "sentences": flat_msg_list
                }
            })

        sorted_idx = np.flip(np.argsort(data))
        sorted_data = np.flip(sorted(data))
        top_3_idx = [sorted_idx[0]]

        count = 0
        for idx, value in zip(sorted_idx, sorted_data) :
            if value < data[top_3_idx[count]] - 0.15:
                top_3_idx.append(idx)
                count += 1

                if count > 1 :
                    break

        if len(top_3_idx) != 3 :
            top_3_idx = sorted_idx[:3]

    else :
        top_3_idxs = []
        scores = []
        for text in prompt :
            top_3_idx, score = text_similarity(flat_msg_list, text)
            top_3_idxs.append(top_3_idx)
            scores.append(score)
        return top_3_idxs, scores
    
    return top_3_idx, sorted_data[0]