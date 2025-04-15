// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Handle profile icon click
function handleProfileClick() {
    if (isLoggedIn()) {
        // Redirect to logout page
        window.location.href = 'logout.html';
    } else {
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Add event listener to profile icon
document.addEventListener('DOMContentLoaded', function() {
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
        profileIcon.addEventListener('click', handleProfileClick);
    }
}); 