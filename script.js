const updatesContainer = document.getElementById('updates');
const liveDot = document.querySelector('#liveIndicator .dot');
const API_KEY = 'kwjrOFwlj2CO0DqFapKcrlO31vg43KqgOPGfcOKr'; // Replace with your NASA API key
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

let latestDate = null;

// Get current loaded timestamp
function getLoadedDate() {
  return new Date().toLocaleString();
}

// Fetch NASA APOD update
async function fetchUpdate() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (data.date === latestDate) return; // skip duplicates  
    latestDate = data.date;

    const updateDiv = document.createElement('div');  
    updateDiv.className = 'update';  
    updateDiv.innerHTML = `
      <h2>${data.title}</h2>  
      <p>${data.date}</p>  
      <img src="${data.url}" alt="${data.title}">  
      <p>${data.explanation}</p>  
      <p class="loaded-date">Loaded on: ${getLoadedDate()}</p>
    `;

    updatesContainer.prepend(updateDiv);

    // Blink the live dot green for 3 seconds when a new update is fetched
    liveDot.style.backgroundColor = '#00ff00';
    setTimeout(() => {
      liveDot.style.backgroundColor = '#ff1a1a';
    }, 3000);

  } catch (err) {
    console.error('Error fetching NASA data:', err);
  }
}

// Auto fetch every 5 minutes
setInterval(fetchUpdate, 300000); // 5 minutes

// Initial fetch
fetchUpdate();

/* ---------------------------
STARFIELD BACKGROUND ANIMATION
--------------------------- */
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
const STAR_COUNT = 200;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Create stars
for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.5 + 0.1
  });
}

// Animate stars
function animateStars() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ff1a1a';
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.speed;
    if (star.y > canvas.height) star.y = 0;
  });

  requestAnimationFrame(animateStars);
}
animateStars();
