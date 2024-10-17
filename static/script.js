const video = document.getElementById('video');
const play = document.getElementById('play');
const stop = document.getElementById('stop');
const progress = document.getElementById('progress');
const timestamp = document.getElementById('timestamp');
const inferenceBtn = document.getElementById('inferenceBtn')
const inferenceStatus = document.getElementById('inferenceStatus')
const searchBtn = document.getElementById('searchBtn');
const videoInfoBtn = document.getElementById('videoInfoBtn');
const videoInfo = document.getElementById('videoInfo')
const searchBar = document.getElementById('searchBar');
const controls = document.getElementsByClassName('controls');
const timeOutputDiv = document.getElementById('timeOutput');
const videoFramesDiv = document.getElementById('videoFrames');


// Play & pause video
function toggleVideoStatus() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

// update play/pause icon
function updatePlayIcon() {
  if (video.paused) {
    play.innerHTML = '<i class="fa fa-play fa-2x"></i>';
  } else {
    play.innerHTML = '<i class="fa fa-pause fa-2x"></i>';
  }
}

// Update progress & timestamp
function updateProgress() {
  progress.value = (video.currentTime / video.duration) * 100;

  // Get the minutes
  let mins = Math.floor(video.currentTime / 60);
  if(mins < video.duration){
    mins = '0' + String(mins);
  }

  // Get Seconds
  let secs = Math.floor(video.currentTime % 60);
  if(secs < video.duration){
    secs = '0' + String(secs);
  }

  timestamp.innerHTML = `${mins}:${secs}`;
}

// Set video time to progress
function setVideoProgress() {
  video.currentTime = (+progress.value * video.duration) / 100;
}

// Stop video
function stopVideo() {
  video.currentTime = 0;
  video.pause();
}

function toggleSearchBar() {
  if (searchBar.style.display === 'none') {
    searchBar.style.display = 'block';
  } else {
    searchBar.style.display = 'none';
  }
}

function toggleVideoInfo() {
  if (videoInfo.style.display === 'none') {
    videoInfo.style.display = 'block';
  } else {
    videoInfo.style.display = 'none';
  }
  const videoDetails = `
    <h3>Video Info</h3>
    <p>This video is not provocative.</p>
    <p>This video is not violent.</p>
    <h3>Video Description</h3>
    <p>The video showcases various everyday activities, such as a man and a little boy having a meal, people reading in a library, and a group watching a soccer game. It also features a chef, musicians, business interactions among men in suits, and includes advertisements for printer products.</p>
  `;
  
  // div 안에 내용 추가
  videoInfo.innerHTML = videoDetails;
}


// video안에 마우스가 들어오면 fade in / out 해주기
video.addEventListener('mouseenter', function() {
  fadeIn(progress);
  fadeIn(play);
  fadeIn(stop);
  fadeIn(timestamp);
  fadeIn(inferenceBtn);
  fadeIn(searchBtn);
  fadeIn(videoInfoBtn);
  fadeIn(searchBar);
  fadeIn(inferenceStatus);
});

video.addEventListener('mouseleave', function() {
  fadeOut(progress);
  fadeOut(play);
  fadeOut(stop);
  fadeOut(timestamp);
  fadeOut(inferenceBtn);
  fadeOut(searchBtn);
  fadeOut(videoInfoBtn);
  fadeIn(searchBar);
  fadeOut(inferenceStatus);
});

// progress bar안에 마우스가 들어오면 객체 fade in / out 해주기
for (let i = 0; i < controls.length; i++) {
  controls[i].addEventListener('mouseenter', function() {
    fadeIn(progress);
    fadeIn(play);
    fadeIn(stop);
    fadeIn(timestamp);
    fadeIn(inferenceBtn);
    fadeIn(searchBtn);
    fadeIn(videoInfoBtn);
    fadeIn(inferenceStatus)
  });

  controls[i].addEventListener('mouseleave', function() {
    fadeOut(progress);
    fadeOut(play);
    fadeOut(stop);
    fadeOut(timestamp);
    fadeOut(inferenceBtn);
    fadeOut(searchBtn);
    fadeOut(videoInfoBtn);
    fadeOut(inferenceStatus)
  });
}

function fadeIn(element) {
  element.style.opacity = '1';
  element.style.transition = 'opacity 0.3s ease-in-out';
}

function fadeOut(element) {
  element.style.opacity = '0';
  element.style.transition = 'opacity 0.3s ease-in-out';
}

// infrence start 
inferenceBtn.style.display = "block";
searchBtn.style.display = "none";
videoInfoBtn.style.display = "none";
inferenceStatus.style.display = "none";

function inference(element) {
  // inference
  InferenceCondition = 1
  // inferenceBtn을 숨김
  inferenceBtn.style.display = "none";
  // searchBtn을 표시
  searchBtn.style.display = "none";
  videoInfoBtn.style.display = "none";
  inferenceStatus.style.display = "block";
}

video.addEventListener('click', toggleVideoStatus);
video.addEventListener('pause', updatePlayIcon);
video.addEventListener('play', updatePlayIcon);
video.addEventListener('timeupdate', updateProgress);
play.addEventListener('click', toggleVideoStatus)
stop.addEventListener('click', stopVideo);
progress.addEventListener('change', setVideoProgress);
searchBtn.addEventListener('click', toggleSearchBar);
videoInfoBtn.addEventListener('click', toggleVideoInfo);
inferenceBtn.addEventListener('click', inference);

document.getElementById('inferenceBtn').addEventListener('click', function() {
  fetch('/inference', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ /* 보내고 싶은 데이터가 있다면 여기에 추가 */ })
  })
  .then(response => response.json())
  .then(data => {
      const taskId = data.task_id;
      console.log('작업 ID:', taskId);
      checkStatus(taskId);
  })
  .catch(error => {
      console.error('에러:', error);
  });
});

function checkStatus(taskId) {
  const statusDiv = document.getElementById('inferenceStatus');
  const interval = setInterval(() => {
      fetch(`/status/${taskId}`)
      .then(response => response.json())
      .then(data => {
          statusDiv.textContent = data.status;
          // if (data.status === "100%" || fs.accessSync('./text_set.json', fs.constants.F_OK)) {
          if (data.status === "100%") {
              searchBtn.style.display = "block";
              videoInfoBtn.style.display = "block";
              inferenceStatus.style.display = "none";
              clearInterval(interval);
          }
      })
      .catch(error => {
          console.error('에러:', error);
          clearInterval(interval);
      });
  }, 3000); // 3초마다 상태 확인
}


// 만들어진 text_set.json으로부터 사용자의 text를 검색하는 기능.
document.getElementById('searchBar').addEventListener('keyup', function(event) {
  if (event.key === 'Enter') { 
    var searchInput = document.getElementById('searchBar').querySelector('input').value;
    fetch('/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search_text: searchInput,
      }),
    })
    .then(response => response.json())
    .then(data => {
      videoFramesDiv.innerHTML = '';
      JSON.parse(data.result).forEach((time, index) => {
            fetch(`/get_frame?time=${time}&index=${index}`)
              .then(response => response.json())  
              .then(frameData => {

                const frame_url = frameData.frame_url;
                const frameImg = document.createElement('img');

                var tmpData = new Date();

                frameImg.src = frame_url + '?' + tmpData 
                console.log(frameImg)
                frameImg.style.width = '30%'
                frameImg.alt = `Frame at Time${index + 1}`;

                frameImg.addEventListener('click', () => {
                  video.currentTime = time;
                  searchBar.style.display = 'none';
                });

                videoFramesDiv.appendChild(frameImg);
              })
              .catch(error => {
                  console.error('Error fetching frame:', error);
              });
        });
      
      document.getElementById('searchBar').querySelector('input').value = '';
    })
  
    
    .catch(error => {
      console.error('Error:', error);
    });
  }
});


// Drag and drop video file
const dropArea = document.getElementById('drop-area');

dropArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropArea.style.backgroundColor = '#b2ebf2'; // Change background color on drag
});

dropArea.addEventListener('dragleave', () => {
  dropArea.style.backgroundColor = '#e0f7fa'; // Reset background color
});

dropArea.addEventListener('drop', (event) => {
  event.preventDefault();
  dropArea.style.backgroundColor = '#e0f7fa'; // Reset background color
  dropArea.style.display = "none"
  const files = event.dataTransfer.files;
  
  if (files.length > 0) {
    const videoFile = files[0];
    if (videoFile.type.startsWith('video/')) {
      const videoURL = URL.createObjectURL(videoFile);
      video.src = videoURL;
      video.load(); // Load the new video
      video.play(); // Optionally, play the video immediately
      showControls(); // Show controls when video is loaded
    } else {
      alert('Please drop a valid video file.');
    }
  }
});

// Show controls when video is loaded
function showControls() {
  for (let control of controls) {
    control.style.display = 'flex';
  }
  video.style.display = 'block';
}

// dropArea.addEventListener('dragover', (event) => {
//   event.preventDefault();
//   dropArea.style.display = 'none'; // 드래그 중에 drop area 숨기기
// });

// dropArea.addEventListener('dragleave', () => {
//   dropArea.style.display = 'flex'; // 드래그가 끝나면 다시 보이기
// });

