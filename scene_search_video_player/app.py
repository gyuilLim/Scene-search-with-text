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
    time = request.args.get('time', '')
    index = request.args.get('index', '')
    video_frame_url = f'./static/frames/{index}.jpg' 
    save_frame('./static/video.mp4', time, video_frame_url)
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
    app.run(debug=True)
