from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    search_text = request.json.get('search_text', '')  # 클라이언트로부터 검색어 받기
    processed_data = f"검색어 '{search_text}'를 처리했습니다."
    return jsonify({'result': processed_data})  # JSON 응답으로 데이터 전송

if __name__ == '__main__':
    app.run(debug=True)
