// script.js
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop_zone');
    const videoPlayer = document.getElementById('video_player');
  
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleFileSelect);
  
    function handleDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }
  
    function handleFileSelect(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
  
      if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
          videoPlayer.src = event.target.result;
          videoPlayer.style.display = 'block';
          dropZone.style.display = 'none';
          videoPlayer.play();
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please drop a valid video file.');
      }
    }
  });
  