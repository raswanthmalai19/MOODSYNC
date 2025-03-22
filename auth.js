// Authentication Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            const tabTarget = tab.dataset.tab;
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabTarget}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Login button functionality
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    // Register button functionality
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
    }
    
    // Form validation and submission handlers
    function handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // For demo purposes - normally this would be an API call
        // Simulate login success
        showNotification('Login successful!', 'success');
        
        // Redirect to main app after brief delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
    
    function handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const termsCheckbox = document.querySelector('.terms-checkbox input').checked;
        
        if (!name || !email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!termsCheckbox) {
            showNotification('Please accept the terms and conditions', 'error');
            return;
        }
        
        // For demo purposes - normally this would be an API call
        // Simulate registration success
        showNotification('Registration successful!', 'success');
        
        // Switch to login tab after brief delay
        setTimeout(() => {
            document.querySelector('[data-tab="login"]').click();
        }, 1500);
    }
    
    // Notification helper
    function showNotification(message, type = 'info') {
        // Check if notification container exists, create if not
        let notifContainer = document.querySelector('.notification-container');
        if (!notifContainer) {
            notifContainer = document.createElement('div');
            notifContainer.className = 'notification-container';
            document.body.appendChild(notifContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;
        
        // Add to container
        notifContainer.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Password visibility toggle for login and register
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const parent = input.parentElement;
        
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        parent.appendChild(toggleBtn);
        
        // Toggle functionality
        toggleBtn.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
});