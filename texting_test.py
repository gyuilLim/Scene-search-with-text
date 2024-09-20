import json
import cv2
import sys

from status_manager import processing_status  # 상태 관리 모듈 가져오기
from utils.frameMethod import key_frame_detection
from utils.dataset import custom_dataset
from torch.utils.data import DataLoader
from utils.model import load_model
from utils.inference import inference

model_name = 'blip'
device = 'cuda'

video_path = '/home/vision/gyuil/project/gradwork/text_search_video_player/static/video.mp4'
cap = cv2.VideoCapture(video_path)
frame_list, time_line = key_frame_detection(cap, kfe = True)

dataset = custom_dataset(frame_list, model_name)
dataloader = DataLoader(dataset, batch_size=64)

model = load_model(model_name, device)

model.eval()
text = None
max_index, flat_msg_list = inference(model_name, text, model, dataloader, device)

output_dict = {}
output_dict['text_list'] = flat_msg_list
output_dict['time_line'] = time_line


with open("static/text_set.json", "w") as json_file :
    json.dump(output_dict, json_file, indent=4)