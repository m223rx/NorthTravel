fetch('pages/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
        const script = document.createElement('script');
        script.src = 'js/functions/navbar.js';
        document.body.appendChild(script);
    })
    .catch(err => console.error('Error loading navbar:', err));

fetch('pages/hero.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('hero-container').innerHTML = data;
        const script = document.createElement('script');
        script.src = 'js/functions/hero.js';
        document.body.appendChild(script);
    })
    .catch(err => console.error('Error loading hero:', err));
