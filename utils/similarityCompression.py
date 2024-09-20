from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F
import numpy as np


def cos_sim(A, B):
    return np.dot(A, B)/(np.linalg.norm(A)*np.linalg.norm(B))


def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0] #First element of model_output contains all token embeddings
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

def similarity_compression(flat_msg_list, time_line):

    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

    # Load model from HuggingFace Hub
    tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
    model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')

    # Tokenize sentences
    encoded_input = tokenizer(flat_msg_list, padding=True, truncation=True, return_tensors='pt')

    # Compute token embeddings
    with torch.no_grad():
        model_output = model(**encoded_input)

    # Perform pooling
    sentence_embeddings = mean_pooling(model_output, encoded_input['attention_mask'])

    # Normalize embeddings
    sentence_embeddings = F.normalize(sentence_embeddings, p=2, dim=1)
    
    frame_list = []
    caption_list = []
    times = []

    for i in range(len(sentence_embeddings)-1) :
        sim = cos_sim(sentence_embeddings[i], sentence_embeddings[i+1])
        if sim < 0.5 :
            frame_list.append(i)
            caption_list.append(flat_msg_list[i])
            times.append(time_line[i])

    ret_dict = {}

    ret_dict['text_list'] = caption_list
    ret_dict['time_line'] = times

    return ret_dict