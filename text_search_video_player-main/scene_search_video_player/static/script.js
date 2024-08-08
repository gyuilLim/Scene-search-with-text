const video = document.getElementById('video');
const play = document.getElementById('play');
const stop = document.getElementById('stop');
const progress = document.getElementById('progress');
const timestamp = document.getElementById('timestamp');
const inferenceBtn = document.getElementById('inferenceBtn')
const inferenceStatus = document.getElementById('inferenceStatus')
const searchBtn = document.getElementById('searchBtn');
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

video.addEventListener('mouseenter', function() {
  fadeIn(progress);
  fadeIn(play);
  fadeIn(stop);
  fadeIn(timestamp);
  fadeIn(inferenceBtn);
  fadeIn(searchBtn);
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
  fadeIn(searchBar);
  fadeOut(inferenceStatus);
});

for (let i = 0; i < controls.length; i++) {
  controls[i].addEventListener('mouseenter', function() {
    fadeIn(progress);
    fadeIn(play);
    fadeIn(stop);
    fadeIn(timestamp);
    fadeIn(inferenceBtn);
    fadeIn(searchBtn);
    fadeIn(inferenceStatus)
  });

  controls[i].addEventListener('mouseleave', function() {
    fadeOut(progress);
    fadeOut(play);
    fadeOut(stop);
    fadeOut(timestamp);
    fadeOut(inferenceBtn);
    fadeOut(searchBtn);
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
inferenceStatus.style.display = "none";

function inference(element) {
  // inference
  InferenceCondition = 1
  // inferenceBtn을 숨김
  inferenceBtn.style.display = "none";
  // searchBtn을 표시
  searchBtn.style.display = "none";
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
          if (data.status === "100%") {
              searchBtn.style.display = "block";
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
        console.log('추론 결과:', data.result);
    })
    .catch(error => {
        console.error('에러:', error);
    });
  inference(this)
});

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