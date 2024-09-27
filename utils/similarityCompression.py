from transformers import BertModel, BertTokenizer
import torch
import numpy as np


def cos_sim(A, B):
    return np.dot(A, B)/(np.linalg.norm(A)*np.linalg.norm(B))

def sentence_embedding(sentence):
    model_name = 'bert-base-multilingual-cased'
    tokenizer = BertTokenizer.from_pretrained(model_name)
    model = BertModel.from_pretrained(model_name)
    inputs = tokenizer(sentence, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()


def similarity_compression(flat_msg_list, time_line) :
    frame_list = []
    caption_list = []
    times = []

    sentence_embeddings = sentence_embedding(flat_msg_list)

    frame_list.append(0)
    caption_list.append(flat_msg_list[0])
    times.append(time_line[0])

    for i in range(len(sentence_embeddings)-1) :
        sim = cos_sim(sentence_embeddings[i], sentence_embeddings[i+1])
        if sim < 0.8 :
            frame_list.append(i)
            caption_list.append(flat_msg_list[i])
            times.append(time_line[i])

    output_dict = {}
    output_dict['text_list'] = caption_list
    output_dict['time_line'] = times

    return output_dict