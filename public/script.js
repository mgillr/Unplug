function updateCountdown() {
  const now = new Date().getTime(); // Get current time in milliseconds

  // Check if countdown target is already set in localStorage
  if (!localStorage.getItem('countdownTarget')) {
    const initialTargetTime = new Date();
    initialTargetTime.setTime(now + 168 * 60 * 60 * 1000); // Add 168 hours (7 days) in milliseconds
    localStorage.setItem('countdownTarget', initialTargetTime.getTime());
  }

  const targetTime = Number(localStorage.getItem('countdownTarget')); // Ensure we retrieve a valid number
  const diff = targetTime - now; // Time remaining

  if (diff <= 0) {
    document.getElementById("hours").innerText = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";
    return;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("hours").innerText = hours.toString().padStart(2, "0");
  document.getElementById("minutes").innerText = minutes.toString().padStart(2, "0");
  document.getElementById("seconds").innerText = seconds.toString().padStart(2, "0");

  if (Math.random() < 0.01) {
    addGlitchEffect();
  }
}

function addGlitchEffect() {
  const countdown = document.getElementById("countdown");
  countdown.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
  countdown.style.filter = `hue-rotate(${Math.random() * 360}deg)`;

  setTimeout(() => {
    countdown.style.transform = "";
    countdown.style.filter = "";
  }, 100);
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);
});

function createMatrixRain() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-rain';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const fontSize = 16;
  
  function updateCanvasSize() {
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    canvas.height = docHeight;
    canvas.width = window.innerWidth;
    return Math.ceil(canvas.width / fontSize);
  }
  
  let columns = updateCanvasSize();
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%$#@!~".split("");
  const drops = Array(columns).fill(0);
  
  function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const container = document.querySelector('.countdown-container');
    const rect = container.getBoundingClientRect();
    
    const contentPadding = 50;
    const contentLeft = rect.left - contentPadding;
    const contentRight = rect.right + contentPadding;
    
    ctx.fillStyle = "rgba(0, 255, 0, 0.35)";
    ctx.font = fontSize + "px monospace";
    
    for (let i = 0; i < drops.length; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      
      const isInSideArea = x < contentLeft || x > contentRight;
      const isInVerticalArea = y < rect.top || y > rect.bottom;
      
      if (isInSideArea || isInVerticalArea) {
        const char = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(char, x, y);
      }
      
      drops[i] += 0.35;
      
      if (drops[i] * fontSize > canvas.height) {
        drops[i] = 0;
      }
    }
  }

  window.addEventListener('resize', () => {
    columns = updateCanvasSize();
    if (drops.length < columns) {
      drops.push(...Array(columns - drops.length).fill(0));
    } else if (drops.length > columns) {
      drops.length = columns;
    }
  });
  
  setInterval(draw, 50);
}

function initializeLinks() {
  const links = document.querySelectorAll('.matrix-link:not(.disabled)');
  
  links.forEach(link => {
    link.addEventListener('mouseover', () => {
      if (Math.random() < 0.3) {
        const text = link.querySelector('.link-text');
        const value = link.querySelector('.link-value');
        
        const glitchDuration = 500;
        const glitchInterval = setInterval(() => {
          text.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
          value.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        }, 50);
        
        setTimeout(() => {
          clearInterval(glitchInterval);
          text.style.transform = '';
          value.style.transform = '';
        }, glitchDuration);
      }
    });
  });

  const disabledLinks = document.querySelectorAll('.matrix-link.disabled');
  disabledLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const value = link.querySelector('.link-value');
      value.style.color = 'rgba(255, 0, 0, 0.8)';
      value.textContent = 'Access Denied';
      
      setTimeout(() => {
        value.style.color = '';
        value.textContent = 'Coming Soon...';
      }, 1000);
    });
  });
}

function initializeRecentJoins() {
  const names = [
    'Agent', 'Cipher', 'Ghost', 'Shadow', 'Phoenix', 'Echo', 'Vector', 
    'Nova', 'Pulse', 'Quantum', 'Binary', 'Nexus', 'Vertex', 'Zero'
  ];
  
  const recentJoins = document.getElementById('recentJoins');
  
  function addJoin() {
    const name = names[Math.floor(Math.random() * names.length)];
    const id = Math.floor(Math.random() * 9000 + 1000);
    
    const joinItem = document.createElement('div');
    joinItem.className = 'join-item';
    joinItem.textContent = `${name}_${id} has been unplugged...`;
    
    recentJoins.insertBefore(joinItem, recentJoins.firstChild);
    
    if (recentJoins.children.length > 3) {
      recentJoins.removeChild(recentJoins.lastChild);
    }
  }
  
  // Initial joins
  for (let i = 0; i < 3; i++) {
    addJoin();
  }
  
  // Random joins every 3-8 seconds
  setInterval(addJoin, Math.random() * 5000 + 3000);
}

// Sound System
function initializeSoundSystem() {
  let currentIndex = 0;
  const sounds = Array.from({ length: 12 }, (_, i) => document.getElementById(`sound${i + 1}`));
  
  function playNextSound() {
    // Stop all sounds
    sounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });

    // Play current sound
    const sound = sounds[currentIndex];
    
    // When this sound ends, play the next one
    sound.onended = () => {
      currentIndex = (currentIndex + 1) % sounds.length;
      setTimeout(() => playNextSound(), 100); // Small delay between sounds
    };

    // Play the current sound
    sound.play().catch(error => {
      console.log("Playback failed:", error);
      // Try again on user interaction
      document.addEventListener('click', function playOnClick() {
        sound.play().catch(console.error);
        document.removeEventListener('click', playOnClick);
      }, { once: true });
    });
  }

  // Start playing immediately
  playNextSound();
}

// Share functionality
function initializeShareButtons() {
    // Share on X (Twitter)
    const shareButton = document.querySelector('.twitter-share');
    if (shareButton) {
        shareButton.addEventListener('click', () => {
            const text = `🔴 A glitch in the Matrix has been detected...\n\nThe choice is yours:\nFollow the white rabbit, or remain in blissful ignorance.\n\nTime is ticking. Will you be ready when it hits zero?\n\nJoin the awakening: @thematrixcult\n\n#UNPLUG #MatrixCult #CryptoMatrix`;
            const url = 'https://t.me/thematrixcult';
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        });
    }

    // Copy invite link
    const copyButton = document.querySelector('.copy-link');
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText('https://t.me/thematrixcult')
                .then(() => {
                    const textSpan = copyButton.querySelector('.share-text');
                    const originalText = textSpan.textContent;
                    textSpan.textContent = 'Link Copied!';
                    copyButton.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
                    
                    setTimeout(() => {
                        textSpan.textContent = originalText;
                        copyButton.style.backgroundColor = '';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                });
        });
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  setTimeout(createMatrixRain, 6000);
  initializeShareButtons();
  initializeLinks();
  initializeRecentJoins();
  
  // Initialize sound system with a slight delay to ensure all audio elements are loaded
  setTimeout(initializeSoundSystem, 500);
});
