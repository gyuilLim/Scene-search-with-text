// 드래그 앤 드롭 영역 선택
var dropArea = document.getElementById('dropArea');

// 비디오 플레이어 선택
var videoPlayer = document.getElementById('videoPlayer');

// 드래그 앤 드롭 이벤트 리스너 추가
dropArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropArea.style.backgroundColor = '#f0f0f0';
});

dropArea.addEventListener('dragleave', function() {
    dropArea.style.backgroundColor = 'transparent';
});

dropArea.addEventListener('drop', function(e) {
    e.preventDefault();
    dropArea.style.backgroundColor = 'transparent';
    
    // 드래그한 파일 가져오기
    var file = e.dataTransfer.files[0];

    // 비디오 파일인지 확인
    if (file.type.startsWith('video/')) {
        // 비디오 파일인 경우 비디오 플레이어에 추가
        var fileURL = URL.createObjectURL(file);
        videoPlayer.src = fileURL;
        videoPlayer.play();
    } else {
        alert('비디오 파일을 선택해주세요.');
    }
});
