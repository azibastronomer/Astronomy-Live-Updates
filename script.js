const updatesContainer = document.getElementById('updates');
const refreshBtn = document.getElementById('refreshBtn');
const API_KEY = 'YOUR_REAL_NASA_KEY'; // 🔑 Replace with your real key
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

let latestDate = null;

function getLoadedDate() {
  return new Date().toLocaleString();
}

function createUpdate(data) {
  let mediaHtml = '';
  if (data.media_type === 'image') {
    mediaHtml = `<img src="${data.url}" alt="${data.title}">`;
  } else if (data.media_type === 'video') {
    mediaHtml = `<iframe src="${data.url}" frameborder="0" allowfullscreen style="width:100%;height:400px;"></iframe>`;
  }

  const updateDiv = document.createElement('div');
  updateDiv.className = 'update';
  updateDiv.innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.date}</p>
    ${mediaHtml}
    <p>${data.explanation}</p>
    <p class="loaded-date">Loaded on: ${getLoadedDate()}</p>
  `;

  return updateDiv;
}

async function fetchUpdate() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!data || data.code) {
      console.error('API error:', data.msg || data);
      return;
    }

    if (data.date === latestDate) return; // skip duplicates
    latestDate = data.date;

    const newUpdate = createUpdate(data);
    updatesContainer.prepend(newUpdate);

  } catch (err) {
    console.error('Error fetching NASA data:', err);
  }
}

// Auto fetch every 5 minutes
setInterval(fetchUpdate, 5 * 60 * 1000);

refreshBtn.addEventListener('click', fetchUpdate);

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

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.5 + 0.1
  });
}

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
