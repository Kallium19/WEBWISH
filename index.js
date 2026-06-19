import { imagesNormal, imagesBhondu } from './images_data.js';

let activeImages = [];
let currentMode = 'normal'; // 'normal' or 'bhondu'

// Fisher-Yates array shuffling
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

activeImages = [...imagesNormal];
shuffleArray(activeImages);

// ==========================================================================
// 1. LIGHTWEIGHT CANVAS CONFETTI SYSTEM (Offline/Local)
// ==========================================================================
class ConfettiSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#c5a059', '#e6cd9a', '#b76e79', '#d69fa8', '#ffffff', '#e0b0ff', '#fcfbf7'];
        this.isActive = false;
        
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y, isBurst = false) {
        const angle = isBurst ? (Math.random() * Math.PI * 2) : (Math.random() * Math.PI - Math.PI / 2);
        const speed = isBurst ? (Math.random() * 8 + 3) : (Math.random() * 5 + 2);
        
        return {
            x: x,
            y: y,
            size: Math.random() * 8 + 4,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            vx: Math.cos(angle) * speed,
            vy: isBurst ? Math.sin(angle) * speed : -Math.random() * 5 - 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 3 - 1.5,
            opacity: 1,
            decay: Math.random() * 0.012 + 0.005,
            gravity: 0.12
        };
    }

    burst(x, y, count = 80) {
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(x, y, true));
        }
        this.start();
    }

    rain(count = 3) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.canvas.width;
            this.particles.push(this.createParticle(x, -20, false));
        }
        this.start();
    }

    start() {
        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }

    animate() {
        if (this.particles.length === 0) {
            this.isActive = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.vx;
            p.vy += p.gravity;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.opacity -= p.decay;

            if (p.opacity <= 0 || p.x < 0 || p.x > this.canvas.width || p.y > this.canvas.height) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 1.5);
            this.ctx.restore();
        }

        requestAnimationFrame(() => this.animate());
    }
}

const confetti = new ConfettiSystem('confetti-canvas');


// ==========================================================================
// 2. COUNTER LOGIC
// ==========================================================================
const birthTime = new Date(2007, 5, 19, 10, 20, 0); // 19 June 2007, 10:20 AM

function updateClock() {
    const now = new Date();
    let years = now.getFullYear() - birthTime.getFullYear();
    let months = now.getMonth() - birthTime.getMonth();
    let days = now.getDate() - birthTime.getDate();
    let hours = now.getHours() - birthTime.getHours();
    let mins = now.getMinutes() - birthTime.getMinutes();
    let secs = now.getSeconds() - birthTime.getSeconds();

    if (secs < 0) { secs += 60; mins--; }
    if (mins < 0) { mins += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) { days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); months--; }
    if (months < 0) { months += 12; years--; }

    document.getElementById('y').innerText = years;
    document.getElementById('m').innerText = months;
    document.getElementById('d').innerText = days;
    document.getElementById('h').innerText = hours;
    document.getElementById('mi').innerText = mins;
    document.getElementById('s').innerText = secs;

    // Check if it is currently her birthday (months and days since birth are 0)
    const isBirthday = (months === 0 && days === 0);

    const mainTitle = document.querySelector('.main-title');
    const splashName = document.querySelector('.splash-name');

    if (mainTitle) {
        mainTitle.innerText = isBirthday ? "HAPPY BIRTHDAY, KATE!" : "HELLO, KATE!";
    }
    if (splashName) {
        splashName.innerText = isBirthday ? "HAPPY BIRTHDAY" : "WELCOME BACK";
    }

    // Update Days until next birthday countdown widget
    const countdownEl = document.getElementById('birthday-countdown');
    if (isBirthday) {
        if (countdownEl) {
            countdownEl.innerHTML = "Happy Birthday! 🎂";
        }
    } else {
        const nextBirthday = new Date(now.getFullYear(), 5, 19, 10, 20, 0);
        if (now > nextBirthday) {
            nextBirthday.setFullYear(now.getFullYear() + 1);
        }
        const diffTime = nextBirthday - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (countdownEl) {
            countdownEl.innerHTML = `<span id="days-to-birthday-val">${diffDays}</span> days to next birthday ✦`;
        }
    }
}


// ==========================================================================
// 3. BACKGROUND MUSIC LOGIC
// ==========================================================================
const bgMusic = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const muteBtn = document.getElementById('mute-btn');
const volumeUpIcon = document.getElementById('volume-up-icon');
const volumeOffIcon = document.getElementById('volume-off-icon');
const audioProgress = document.getElementById('audio-progress');
const timeCurrent = document.getElementById('audio-time-current');
const timeDuration = document.getElementById('audio-time-duration');

let isPlaying = false;
let isMuted = false;

// Set default volume
bgMusic.volume = 0.7;

function togglePlay() {
    if (isPlaying) {
        bgMusic.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        isPlaying = false;
    } else {
        bgMusic.play().then(() => {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            isPlaying = true;
        }).catch(err => {
            console.log("Audio play blocked:", err);
        });
    }
}

function toggleMute() {
    if (isMuted) {
        bgMusic.muted = false;
        isMuted = false;
        volumeUpIcon.classList.remove('hidden');
        volumeOffIcon.classList.add('hidden');
    } else {
        bgMusic.muted = true;
        isMuted = true;
        volumeUpIcon.classList.add('hidden');
        volumeOffIcon.classList.remove('hidden');
    }
}

function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

playPauseBtn.addEventListener('click', togglePlay);
muteBtn.addEventListener('click', toggleMute);

// Update seekbar progress as audio plays
bgMusic.addEventListener('timeupdate', () => {
    if (!bgMusic.duration) return;
    const pct = (bgMusic.currentTime / bgMusic.duration) * 100;
    audioProgress.value = pct;
    timeCurrent.innerText = formatTime(bgMusic.currentTime);
    timeDuration.innerText = formatTime(bgMusic.duration);
});

// Listen for progress slider updates
audioProgress.addEventListener('input', () => {
    if (!bgMusic.duration) return;
    const targetTime = (audioProgress.value / 100) * bgMusic.duration;
    bgMusic.currentTime = targetTime;
});


// ==========================================================================
// 4. SCATTERED CAROUSEL SYSTEM
// ==========================================================================
const totalDecks = 10;
const photoDecks = [];
const activeIndices = Array(totalDecks).fill(0); // track current active index of each deck
let hoveredDeckIdx = null;

// Rotation tilts from original layout
const tilts = [-8, 6, -10, 4, -3, 8, -6, 4, -5, 9];

// Pastel tape colors from original design
const tapeColors = [
    '#ffb3ba', '#bae1ff', '#baffc9', '#ffffba', '#ffdfba',
    '#e1bfff', '#ffb3e6', '#b3fff5', '#d1ffb3', '#f2f2f2'
];

function partitionImages() {
    photoDecks.length = 0; // Clear previous decks
    const deckSize = Math.ceil(activeImages.length / totalDecks);
    
    for (let i = 0; i < totalDecks; i++) {
        const start = i * deckSize;
        const end = Math.min(start + deckSize, activeImages.length);
        photoDecks.push(activeImages.slice(start, end));
    }
}

function renderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    photoDecks.forEach((deck, deckIdx) => {
        if (deck.length === 0) return;

        const polaroid = document.createElement('div');
        polaroid.className = 'polaroid';
        polaroid.id = `p${deckIdx + 1}`;
        
        // Random slight rotation for mobile stacked layout override
        const randomRotMob = (Math.random() * 5 - 2.5).toFixed(1);
        polaroid.style.setProperty('--rot-mob', `${randomRotMob}deg`);

        // Generate images HTML
        const imagesHtml = deck.map((img, imgIdx) => {
            return `<img src="${img.path}" class="${imgIdx === 0 ? 'active' : ''}" data-index="${imgIdx}" alt="Kate memories">`;
        }).join('');

        polaroid.innerHTML = `
            <div class="tape" style="background:${tapeColors[deckIdx]}"></div>
            <div class="polaroid-img-container">
                ${imagesHtml}
            </div>
            <div class="polaroid-label">
                <span class="polaroid-date">${deck[0].formattedDate.split(',')[0]}</span>
                <span class="polaroid-caption">Memories #${deckIdx + 1}</span>
            </div>
        `;

        // Mouse hover listeners for orbit scaling/focus
        polaroid.addEventListener('mouseenter', () => {
            hoveredDeckIdx = deckIdx;
        });
        polaroid.addEventListener('mouseleave', () => {
            if (hoveredDeckIdx === deckIdx) hoveredDeckIdx = null;
        });

        // Click on polaroid opens lightbox starting at the current active image of this deck
        polaroid.addEventListener('click', () => {
            const currentActiveInDeck = activeIndices[deckIdx];
            const activeImageObject = deck[currentActiveInDeck];
            const globalIndex = activeImages.findIndex(img => img.filename === activeImageObject.filename);
            openLightbox(globalIndex);
        });

        gallery.appendChild(polaroid);
    });
}

function startCarouselRotations() {
    // Stagger the rotation startup so all cards don't flip at the exact same millisecond
    photoDecks.forEach((deck, deckIdx) => {
        if (deck.length <= 1) return;
        
        // Space out the switch transitions evenly over the 15-second cycle (every 1.5 seconds)
        const rotationDelay = deckIdx * 1500; 
        
        setTimeout(() => {
            rotateDeck(deckIdx); // Rotate immediately once the staggered delay completes
            setInterval(() => {
                rotateDeck(deckIdx);
            }, 15000); // Rotate every 15 seconds (15000ms)
        }, rotationDelay);
    });
}

function rotateDeck(deckIdx) {
    const polaroid = document.getElementById(`p${deckIdx + 1}`);
    if (!polaroid) return;

    const deck = photoDecks[deckIdx];
    const imgs = polaroid.querySelectorAll('.polaroid-img-container img');
    const labelDate = polaroid.querySelector('.polaroid-date');

    // 1. Remove active class from old image
    const oldIdx = activeIndices[deckIdx];
    imgs[oldIdx].classList.remove('active');

    // 2. Increment index
    const newIdx = (oldIdx + 1) % deck.length;
    activeIndices[deckIdx] = newIdx;

    // 3. Add active class to new image
    imgs[newIdx].classList.add('active');

    // 4. Update caption date with new image's date
    const newImgData = deck[newIdx];
    labelDate.style.opacity = '0';
    setTimeout(() => {
        labelDate.innerText = newImgData.formattedDate.split(',')[0];
        labelDate.style.opacity = '1';
    }, 400);
}


// ==========================================================================
// 5. LIGHTBOX MODAL LOGIC (Global Album Navigation)
// ==========================================================================
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxDate = document.getElementById('lightbox-date');
const lightboxDetails = document.getElementById('lightbox-details');
const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
const lightboxNextBtn = document.getElementById('lightbox-next-btn');

let currentActiveIndex = 0;

function openLightbox(globalIndex) {
    currentActiveIndex = globalIndex;
    updateLightboxContent();
    
    lightboxModal.classList.remove('hidden');
    setTimeout(() => {
        lightboxModal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightboxModal.classList.remove('active');
    setTimeout(() => {
        lightboxModal.classList.add('hidden');
    }, 400);
    if (albumModal.classList.contains('hidden')) {
        document.body.style.overflow = '';
    }
}

function updateLightboxContent() {
    const data = activeImages[currentActiveIndex];
    if (!data) return;
    
    lightboxImg.src = data.path;
    lightboxDate.innerText = data.formattedDate;
    lightboxDetails.innerText = `Moment ${currentActiveIndex + 1} of ${activeImages.length}`;
}

function navigateLightbox(direction) {
    if (direction === 'next') {
        currentActiveIndex = (currentActiveIndex + 1) % activeImages.length;
    } else {
        currentActiveIndex = (currentActiveIndex - 1 + activeImages.length) % activeImages.length;
    }
    updateLightboxContent();
}

lightboxCloseBtn.addEventListener('click', closeLightbox);
lightboxPrevBtn.addEventListener('click', () => navigateLightbox('prev'));
lightboxNextBtn.addEventListener('click', () => navigateLightbox('next'));
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
});


// Wishboard elements removed since this is a static site.


// ==========================================================================
// 7. GLOBAL INITIALIZATION
// ==========================================================================
const startBtn = document.getElementById('start-experience-btn');
const splashScreen = document.getElementById('splash-screen');
const mainApp = document.getElementById('main-app');

startBtn.addEventListener('click', () => {
    // 1. Play Background Music
    bgMusic.play().then(() => {
        isPlaying = true;
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    }).catch(err => {
        console.log("Audio autoplay blocked:", err);
    });

    // 2. Show App & Hide Splash
    splashScreen.classList.add('opacity-0');
    mainApp.classList.remove('hidden');
    
    setTimeout(() => {
        splashScreen.classList.add('hidden');
    }, 1000);

    // 3. Start Live Clock
    setInterval(updateClock, 1000);
    updateClock();

    // 4. Initial Confetti explosion
    setTimeout(() => {
        confetti.burst(window.innerWidth / 4, window.innerHeight * 0.7, 70);
        confetti.burst(window.innerWidth * 3 / 4, window.innerHeight * 0.7, 70);
    }, 450);

    // 5. Confetti rain reminder (every 7 seconds)
    setInterval(() => {
        if (isPlaying) {
            confetti.rain(3);
        }
    }, 7000);
});

// Window-wide keyboard listener
window.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('active')) {
        if (e.key === 'ArrowRight') navigateLightbox('next');
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
        if (e.key === 'Escape') closeLightbox();
    }
    if (e.key === 'Escape' && !albumModal.classList.contains('hidden') && !lightboxModal.classList.contains('active')) {
        albumModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

let orbitAngle = 0;

function updateOrbit() {
    orbitAngle += 0.0004; // Very slow and gentle floating speed
    const isDesktop = window.innerWidth > 900;
    
    for (let i = 0; i < totalDecks; i++) {
        const polaroid = document.getElementById(`p${i + 1}`);
        if (!polaroid) continue;
        
        if (isDesktop) {
            // Outer/inner radius orbits to prevent overlaps and add depth
            const rx = (i % 2 === 0) ? 41 : 21; // in vw
            const ry = (i % 2 === 0) ? 32 : 15; // in vh
            
            // Angle offset for each card
            const theta = orbitAngle + (i * 2 * Math.PI / totalDecks);
            
            const x = rx * Math.cos(theta);
            const y = ry * Math.sin(theta);
            
            const isHovered = (hoveredDeckIdx === i);
            const scale = isHovered ? 1.08 : 1.0;
            const tilt = isHovered ? 0 : tilts[i];
            const zIndex = isHovered ? 150 : 10;
            
            polaroid.style.transform = `translate(-50%, -50%) translate(${x}vw, ${y}vh) rotate(${tilt}deg) scale(${scale})`;
            polaroid.style.zIndex = zIndex;
        } else {
            // Reset transform styles for mobile stack
            polaroid.style.transform = '';
            polaroid.style.zIndex = '';
        }
    }
    
    requestAnimationFrame(updateOrbit);
}

// ==========================================================================
// 8. ALBUM GRID MODAL LOGIC
// ==========================================================================
const albumTrigger = document.getElementById('album-trigger-btn');
const albumModal = document.getElementById('album-modal');
const albumCloseBtn = document.getElementById('album-close-btn');
const albumGrid = document.getElementById('album-thumbnails-grid');

function renderAlbum() {
    albumGrid.innerHTML = '';
    activeImages.forEach((img, globalIndex) => {
        const card = document.createElement('div');
        card.className = 'album-thumb-card';
        card.innerHTML = `
            <div class="album-thumb-img-wrapper">
                <img src="${img.path}" alt="memory thumbnail" loading="lazy">
            </div>
            <span class="album-thumb-num">#${globalIndex + 1}</span>
        `;
        card.addEventListener('click', () => {
            albumModal.classList.add('hidden'); // Close album modal
            openLightbox(globalIndex); // Open clicked image in Lightbox
        });
        albumGrid.appendChild(card);
    });
}

albumTrigger.addEventListener('click', () => {
    albumModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

albumCloseBtn.addEventListener('click', () => {
    albumModal.classList.add('hidden');
    if (!lightboxModal.classList.contains('active')) {
        document.body.style.overflow = '';
    }
});

albumModal.addEventListener('click', (e) => {
    if (e.target === albumModal) {
        albumModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// ==========================================================================
// 9. MODE TOGGLE LOGIC (Normal vs. Bhondu Mode)
// ==========================================================================
const modeNormalBtn = document.getElementById('mode-normal-btn');
const modeBhonduBtn = document.getElementById('mode-bhondu-btn');

function switchMode(newMode) {
    if (currentMode === newMode) return;
    currentMode = newMode;
    
    // Update active set
    if (currentMode === 'bhondu') {
        activeImages = [...imagesBhondu];
    } else {
        activeImages = [...imagesNormal];
    }
    
    // Shuffle the new active set
    shuffleArray(activeImages);
    
    // Reset polaroid indices for the new set
    activeIndices.fill(0);
    
    // Re-partition and render
    partitionImages();
    renderGallery();
    renderAlbum();
    
    // Close lightbox to prevent out of bounds slide reference
    closeLightbox();
    
    // Visual celebratory burst
    confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 45);
}

modeNormalBtn.addEventListener('click', () => {
    modeNormalBtn.classList.add('active');
    modeBhonduBtn.classList.remove('active');
    switchMode('normal');
});

modeBhonduBtn.addEventListener('click', () => {
    modeBhonduBtn.classList.add('active');
    modeNormalBtn.classList.remove('active');
    switchMode('bhondu');
});

document.addEventListener('DOMContentLoaded', () => {
    partitionImages();
    renderGallery();
    startCarouselRotations();
    updateOrbit(); // Start the floating orbit animation loop
    renderAlbum(); // Populate album thumbnails grid
});
