const video = document.getElementById('video');
const play = document.getElementById('play');
const stop = document.getElementById('stop');
const progress = document.getElementById('progress');
const timestamp = document.getElementById('timestamp');
const searchBtn = document.getElementById('searchBtn');
const searchBar = document.getElementById('searchBar');
const controls = document.getElementsByClassName('controls');


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


// 마우스가 비디오 화면에 들어왔을 때 이벤트 처리
video.addEventListener('mouseenter', function() {
  fadeIn(progress);
  fadeIn(play);
  fadeIn(stop);
  fadeIn(timestamp);
  fadeIn(searchBtn);
  fadeIn(searchBar);
});

// 마우스가 비디오 화면에서 나갔을 때 이벤트 처리
video.addEventListener('mouseleave', function() {
  fadeOut(progress);
  fadeOut(play);
  fadeOut(stop);
  fadeOut(timestamp);
  fadeOut(searchBtn);
  fadeIn(searchBar);
});

for (let i = 0; i < controls.length; i++) {
  controls[i].addEventListener('mouseenter', function() {
    fadeIn(progress);
    fadeIn(play);
    fadeIn(stop);
    fadeIn(timestamp);
    fadeIn(searchBtn);
  });

  // 마우스가 비디오 화면에서 나갔을 때 이벤트 처리
  controls[i].addEventListener('mouseleave', function() {
    fadeOut(progress);
    fadeOut(play);
    fadeOut(stop);
    fadeOut(timestamp);
    fadeOut(searchBtn);
  });
}


// 부드러운 나타나기 효과 함수
function fadeIn(element) {
  element.style.opacity = '1';
  element.style.transition = 'opacity 0.3s ease-in-out';
}

// 부드러운 사라지기 효과 함수
function fadeOut(element) {
  element.style.opacity = '0';
  element.style.transition = 'opacity 0.3s ease-in-out';
}





// Event listeners
video.addEventListener('click', toggleVideoStatus);
video.addEventListener('pause', updatePlayIcon);
video.addEventListener('play', updatePlayIcon);
video.addEventListener('timeupdate', updateProgress);
play.addEventListener('click', toggleVideoStatus)
stop.addEventListener('click', stopVideo);
progress.addEventListener('change', setVideoProgress);

// custom
searchBtn.addEventListener('click', toggleSearchBar);

document.getElementById('searchBar').addEventListener('keyup', function(event) {
  if (event.key === 'Enter') { // Enter 키가 눌렸을 때
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
      console.log(data.result);
      // 서버에서 전달된 결과를 처리하는 로직을 추가
      document.getElementById('searchBar').querySelector('input').value = '';
    })
    
    .catch(error => {
      console.error('Error:', error);
    });
  }
});