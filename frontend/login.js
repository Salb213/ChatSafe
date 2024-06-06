document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const age = document.getElementById('age').value;

  try {
    const position = await getPosition();
    const payload = {
      email,
      username,
      age,
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };

    const response = await fetch('https://chatsafebackend-5bkcg4gmb-salb213s-projects.vercel.app/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
