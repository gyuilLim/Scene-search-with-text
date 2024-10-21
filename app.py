from flask import Flask, request, jsonify, render_template
from utils.textSimilarity import text_similarity
from threading import Thread
import time
from status_manager import processing_status
from texting import video_texting
import json
import cv2
import os

app = Flask(__name__)

# 업로드할 디렉토리 설정
UPLOAD_FOLDER = './static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/')
def load_json() :
    with open('./static/text_set.json', "r") as json_file :
        text_set = json.load(json_file)
    
    return text_set

@app.route('/upload_video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided.'}), 400

    video_file = request.files['video']
    print(video_file)
    
    if video_file.filename == '':
        return jsonify({'error': 'No selected file.'}), 400

    # 비디오 파일 저장
    video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_file.filename)
    video_file.save(video_path)

    return jsonify({'message': 'Video uploaded successfully.', 'video_path': video_path})

@app.route('/check_text_set', methods=['GET'])
def check_text_set():
    # text_set.json 파일의 존재 여부 확인
    file_path = './static/text_set.json'
    file_exists = os.path.exists(file_path)
    return jsonify({'exists': file_exists})


# @app.route('/inference', methods=['POST'])
# def inference():

#     task_id = str(time.time())  # 고유한 작업 ID 생성
#     processing_status[task_id] = "시작됨"
#     thread = Thread(target=video_texting, args=('./static/video.mp4', task_id))
#     thread.start()
#     return jsonify({'task_id': task_id})

@app.route('/inference', methods=['POST'])
def inference():
    # 여기에 저장된 비디오 파일 경로 사용
    video_path = request.json.get('video_path')  # 클라이언트에서 비디오 경로를 받아옴
    print("asdasd", video_path)
    task_id = str(time.time())  # 고유한 작업 ID 생성
    processing_status[task_id] = "시작됨"
    thread = Thread(target=video_texting, args=(video_path, task_id))  # 경로 수정
    thread.start()
    return jsonify({'task_id': task_id})


@app.route('/status/<task_id>', methods=['GET'])
def status(task_id):
    print(f"Received status check for task_id: {task_id}")
    status = processing_status.get(task_id, "작업 ID가 유효하지 않습니다.")
    return jsonify({'status': status})

# def inference() :
#     video_texting('./static/video.mp4', 0)
#     return jsonify({'result': True})

@app.route('/search', methods=['POST'])
def search():
    search_text = request.json.get('search_text', '')  

    text_set = load_json()
    top_3_idx, score = text_similarity(text_set['text_list'], search_text)

    time = []
    for idx in top_3_idx :
        time.append(text_set['time_line'][idx])

    return jsonify({'result': str(time)})

# @app.route('/get_frame')
# def get_frame():
#     time = request.args.get('time', '')
#     index = request.args.get('index', '')
#     video_frame_url = f'./static/frames/{index}.jpg' 
#     save_frame('./static/video.mp4', time, video_frame_url)
#     return jsonify({'frame_url': video_frame_url})

# 프레임을 추출하는 라우트
@app.route('/get_frame', methods=['GET'])
def get_frame():
    time = request.args.get('time', '')  # 요청에서 시간 값을 받음
    index = request.args.get('index', '')  # 프레임 인덱스 (저장 파일명)
    video_path = request.args.get('video_path', '')  # 클라이언트에서 비디오 경로 전달
    if not video_path or not os.path.exists(video_path):
        return jsonify({'error': 'Invalid video path'}), 400

    # 프레임 이미지를 저장할 경로 설정
    video_frame_url = f'./static/frames/{index}.jpg'
    
    # 프레임 저장 함수 호출
    save_frame(video_path, time, video_frame_url)
    
    return jsonify({'frame_url': video_frame_url})

def save_frame(video_path, time_in_seconds, output_path):
    time_in_seconds = float(time_in_seconds)
    cap = cv2.VideoCapture(video_path)
    
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
    app.run(host='0.0.0.0', port=5000)
    app.run(debug=True)
