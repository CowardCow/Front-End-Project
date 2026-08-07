document.addEventListener('DOMContentLoaded', () => {

    // Initialize default users if not present
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify({ 'admin': 'password' }));
    }

    const welcomeTitle = document.getElementById('welcomeTitle');
    const logoutBtn = document.getElementById('logoutBtn');
    const enterAppBtn = document.getElementById('enterAppBtn');

    // Page logic for welcome.html or protected app pages
    if (welcomeTitle || logoutBtn) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }

        const currentUser = localStorage.getItem('currentUser') || 'User';
        if (welcomeTitle) {
            welcomeTitle.textContent = `Welcome Back, ${currentUser}`;
        }

        if (enterAppBtn) {
            enterAppBtn.addEventListener('click', () => {
                window.location.href = 'india_weather.html';
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                alert('You have logged out successfully.');
                window.location.href = 'login.html';
            });
        }
        return; // Exit here; don't execute login page logic
    }

    // Login page elements
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const showIcon = document.querySelector('.showicon');
    const actionButton = document.querySelector('button');
    const forgotLink = document.querySelector('.forgot');
    const signupText = document.querySelector('.signup');

    if (!usernameInput || !passwordInput || !showIcon || !actionButton || !forgotLink || !signupText) {
        console.warn('Login script: expected DOM elements not found on this page.');
        return;
    }

    // If user is already logged in, redirect straight to welcome page
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'welcome.html';
        return;
    }

    let isSignUpMode = false;

    // Toggle password visibility
    showIcon.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        showIcon.classList.toggle('password-visible', isPassword);
    });

    // Login / Sign Up Action
    actionButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '{}');

        if (isSignUpMode) {
            if (users[username]) {
                alert('Username already exists. Please choose a different one.');
                return;
            }

            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful! You can now log in.');
            switchToLoginMode();
        } else {
            if (users[username] && users[username] === password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', username);
                alert(`Welcome back, ${username}!`);
                window.location.href = 'welcome.html';
            } else {
                alert('Invalid username or password.\nHint: default user is admin / password');
            }
        }
    });

    forgotLink.addEventListener('click', () => {
        alert('Forgot Password?\nDefault credentials are:\nUsername: admin\nPassword: password');
    });

    function switchToSignUpMode() {
        isSignUpMode = true;
        const title = document.querySelector('.title');
        const subtitle = document.querySelector('.subtitle');
        if (title) title.textContent = 'Create Account';
        if (subtitle) subtitle.textContent = 'Sign up to get started';
        actionButton.textContent = 'Sign Up';
        forgotLink.style.display = 'none';
        signupText.innerHTML = 'Already have an account? <a href="#" id="toggleModeLink">Login</a>';

        const toggleLink = document.getElementById('toggleModeLink');
        if (toggleLink) {
            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                switchToLoginMode();
            });
        }

        resetInputs();
    }

    function switchToLoginMode() {
        isSignUpMode = false;
        const title = document.querySelector('.title');
        const subtitle = document.querySelector('.subtitle');
        if (title) title.textContent = 'Welcome Back';
        if (subtitle) subtitle.textContent = 'login to continue';
        actionButton.textContent = 'Login';
        forgotLink.style.display = 'block';
        signupText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleModeLink">Sign Up</a>';

        const toggleLink = document.getElementById('toggleModeLink');
        if (toggleLink) {
            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                switchToSignUpMode();
            });
        }

        resetInputs();
    }

    function resetInputs() {
        usernameInput.value = '';
        passwordInput.value = '';
        passwordInput.type = 'password';
        showIcon.classList.remove('password-visible');
    }

    const signupLink = signupText.querySelector('a');
    if (signupLink) {
        signupLink.id = 'toggleModeLink';
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchToSignUpMode();
        });
    }
});
