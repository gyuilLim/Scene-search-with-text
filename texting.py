import json
import cv2
import sys


from status_manager import processing_status  # 상태 관리 모듈 가져오기
from utils.frameMethod import key_frame_detection
from utils.dataset import custom_dataset
from torch.utils.data import DataLoader
from utils.model import load_model
from utils.inference import inference
# from utils.similarityCompression import similarity_compression


def video_texting(video_path, task_id, text="none") :
    model_name = 'blip'
    device = 'cuda'
    cap = cv2.VideoCapture(video_path)

    frame_list, time_line = key_frame_detection(cap, kfe = True)
    processing_status[task_id] = "10%"

    dataset = custom_dataset(frame_list, model_name)
    dataloader = DataLoader(dataset, batch_size=64)
    processing_status[task_id] = "20%"

    print('load model')
    model = load_model(model_name, device)
    processing_status[task_id] = "30%"

    print('inference')
    model.eval()
    max_index, flat_msg_list = inference(model_name, text, model, dataloader, device)
    processing_status[task_id] = "80%"


    output_dict = {}
    output_dict['text_list'] = flat_msg_list
    output_dict['time_line'] = time_line

    # output_dict = similarity_compression(flat_msg_list, time_line)
    # processing_status[task_id] = "90%"


    with open("static/text_set.json", "w") as json_file :
        json.dump(output_dict, json_file, indent=4)
    
    processing_status[task_id] = "100%"