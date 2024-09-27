from transformers import BertModel, BertTokenizer
import torch
from sklearn.metrics.pairwise import cosine_similarity

# BERT 모델 및 토크나이저 불러오기
model_name = 'bert-base-multilingual-cased'
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertModel.from_pretrained(model_name)

# 문장을 BERT 토큰으로 변환하고 임베딩 계산
def sentence_embedding(sentence):
    inputs = tokenizer(sentence, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()

# 예제 문장
sent1 = "나는 오늘 날씨가 좋아서 공원에 갔다."
sent2 = "날씨가 좋아서 나는 공원을 갔다."

# BERT 임베딩 생성
vec1 = sentence_embedding(sent1)
vec2 = sentence_embedding(sent2)

# 코사인 유사도 계산
cosine_sim = cosine_similarity([vec1], [vec2])
print("BERT 코사인 유사도:", cosine_sim[0][0])
