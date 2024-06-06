const socket = io();

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = stream;
    
    // Handle peer connection and video streaming here...
    
  })
  .catch(error => {
    console.error('Error accessing media devices.', error);
  });
