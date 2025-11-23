(function() {
    const heroHeadline = document.getElementById('heroHeadline');
    if (!heroHeadline) {
        console.error('Hero headline element not found. Ensure hero.html is loaded correctly.');
        return;
    }

    const headlines = [
        'Discover Your Dream Vacation',
        'Explore the World with Wow Travel',
        'Adventure Awaits – Book Today!',
        'Unforgettable Journeys Start Here'
    ];

    let index = 0;

    function rotateHeadline() {
        heroHeadline.classList.remove('fade-in');
        heroHeadline.classList.add('fade-out');

        setTimeout(() => {
            heroHeadline.textContent = headlines[index];
            heroHeadline.classList.remove('fade-out');
            heroHeadline.classList.add('fade-in');
            index = (index + 1) % headlines.length;
        }, 500); 
    }

    heroHeadline.textContent = headlines[index];
    heroHeadline.classList.add('fade-in');
    index++;

    setInterval(rotateHeadline, 4000);

    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        heroVideo.addEventListener('loadeddata', () => {
            heroVideo.play().catch(() => {
                console.warn('Video autoplay failed—likely due to browser policy.');
            });
        });
        heroVideo.addEventListener('error', () => {
            console.warn('Hero video failed to load. Check the file path.');
        });
    }
})();
