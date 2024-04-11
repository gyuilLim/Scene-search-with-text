from flask import Flask, request, jsonify, render_template
from utils.textSimilarity import text_similarity
import json
import cv2

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
    search_text = request.json.get('search_text', '')  

    text_set = load_json()
    top_3_idx = text_similarity(text_set['text_list'], search_text)

    time = []
    for idx in top_3_idx :
        time.append(text_set['time_line'][idx])

    return jsonify({'result': str(time)})  

@app.route('/get_frame')
def get_frame():
    # 클라이언트가 전달한 시간을 가져옵니다.
    time = request.args.get('time', '')
    index = request.args.get('index', '')
    # 여기에서 time 변수를 기반으로 해당 시간에 해당하는 비디오 프레임을 반환하는 코드를 작성합니다.
    # 예를 들어, 시간을 기반으로 비디오 파일에서 해당 프레임을 추출하고, 해당 프레임을 클라이언트에게 반환할 수 있습니다.
    
    # 여기에서는 간단하게 예시를 작성합니다.
    # 클라이언트에게는 시간에 해당하는 비디오 프레임의 URL을 반환합니다.
    # 실제로는 해당 URL에 비디오 프레임을 반환하는 코드를 작성해야 합니다.
    video_frame_url = f'./static/frames/{index}.jpg'  # 예시: 시간을 파일 이름으로 하는 프레임 이미지 파일 경로
    save_frame('./static/video.mp4', time, video_frame_url)
    return jsonify({'frame_url': video_frame_url})

def save_frame(video_path, time_in_seconds, output_path):
    # 비디오 파일 열기
    time_in_seconds = float(time_in_seconds)
    cap = cv2.VideoCapture(video_path)
    
    # 비디오 파일 열기에 성공했는지 확인
    if not cap.isOpened():
        print("Error: Unable to open video file.")
        return None
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_index = int(time_in_seconds * fps)
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
    ret, frame = cap.read()
    cap.release()
    if not ret:
        print("Error: Unable to read frame.")
        return None
    
    cv2.imwrite(output_path, frame)
    
    return True


if __name__ == '__main__':
    app.run(debug=True)
