document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.classList.add(`${currentTheme}-theme`);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', function() {
        const isLight = body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(`${newTheme}-theme`);
        
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        icon.className = theme === 'light' ? 'bi bi-moon' : 'bi bi-sun';
    }
    
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.addEventListener('click', function() {
        alert('Login functionality not implemented yet. Redirecting to login page...');
    });
    
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');
    
    navbarToggler.addEventListener('click', function() {
        navbarCollapse.classList.toggle('show');
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
    
    const searchForm = document.querySelector('form[role="search"]');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchForm.querySelector('input').value.trim();
        if (query) {
            alert(`Searching for: ${query}`);
        }
    });
    
    const wishlistBtn = document.querySelector('button .bi-heart').parentElement;
    const notificationBtn = document.querySelector('button .bi-bell').parentElement;
    
    wishlistBtn.addEventListener('click', function() {
        alert('Wishlist: 3 items');
    });
    
    notificationBtn.addEventListener('click', function() {
        alert('Notifications: 3 unread'); 
    });
});