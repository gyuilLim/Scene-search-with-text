from transformers import pipeline

# Hugging Face 사전 학습된 요약 모델 불러오기
summarizer = pipeline("summarization")

# 요약할 텍스트
text = """
인공지능은 인간의 지능을 모방하여 학습, 추론, 문제 해결 등을 수행하는 기술입니다.
최근 인공지능 기술은 머신러닝, 딥러닝 등의 발전으로 크게 주목받고 있으며, 다양한 산업 분야에서 활용되고 있습니다.
특히 자율주행차, 의료 진단, 추천 시스템, 챗봇 등에서 중요한 역할을 하고 있습니다.
인공지능 기술의 발전은 우리의 삶을 변화시키고 있으며, 향후 그 잠재력은 더욱 커질 것으로 예상됩니다.
"""

# 요약 수행
summary = summarizer(text, max_length=50, min_length=25, do_sample=False)
print(summary[0]['summary_text'])
