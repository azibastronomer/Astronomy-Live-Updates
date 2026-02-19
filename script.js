const updatesContainer = document.getElementById('updates');
const refreshBtn = document.getElementById('refreshBtn');
const API_KEY = 'kwjrOFwlj2CO0DqFapKcrlO31vg43KqgOPGfcOKr'; // 🔑 Replace with your real key
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

let latestDate = null;

// Get current loaded timestamp
function getLoadedDate() {
  return new Date().toLocaleString();
}

// Create update HTML safelykwjrOFwlj2CO0DqFapKcrlO31vg43KqgOPGfcOKr
function createUpdate(data) {
  let mediaHtml = '';

  // Handle image or video
  if (data.media_type === 'image' && data.url) {
    mediaHtml = `<img src="${data.url}" alt="${data.title || 'NASA APOD'}">`;
  } else if (data.media_type === 'video' && data.url) {
    mediaHtml = `<iframe src="${data.url}" frameborder="0" allowfullscreen style="width:100%;height:400px;"></iframe>`;
  } else {
    mediaHtml = `<p>Media unavailable</p>`;
  }

  const updateDiv = document.createElement('div');
  updateDiv.className = 'update';
  updateDiv.innerHTML = `
    <h2>${data.title || 'Untitled'}</h2>
    <p>${data.date || 'Unknown date'}</p>
    ${mediaHtml}
    <p>${data.explanation || 'No description available.'}</p>
    <p class="loaded-date">Loaded on: ${getLoadedDate()}</p>
  `;

  return updateDiv;
}

// Fetch NASA APOD update
async function fetchUpdate() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // API error handling
    if (!data || data.code) {
      console.error('NASA API error:', data.msg || data);
      return;
    }

    // Skip duplicates
    if (data.date === latestDate) return;
    latestDate = data.date;

    // Add new update
    const newUpdate = createUpdate(data);
    updatesContainer.prepend(newUpdate);

  } catch (err) {
    console.error('Error fetching NASA data:', err);
  }
}

// Auto fetch every 5 minutes (300,000 ms)
setInterval(fetchUpdate, 5 * 60 * 1000);


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


