from flask import Flask, request, jsonify, render_template
from utils.textSimilarity import text_similarity
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/')
def load_json() :
    with open('./static/text_set.json', "r") as json_file :
        text_set = json.load(json_file)
    
    return text_set

@app.route('/search', methods=['POST'])
def search():
    search_text = request.json.get('search_text', '')  # 클라이언트로부터 검색어 받기

    text_set = load_json()
    max_index = text_similarity(text_set['text_list'], search_text)
    time = text_set['time_line'][max_index]


    processed_data = f"검색어 '{search_text}'를 처리했습니다."
    return jsonify({'result': str(time)})  # JSON 응답으로 데이터 전송

if __name__ == '__main__':
    app.run(debug=True)
