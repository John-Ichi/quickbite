document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const nameInput = document.getElementById('staffNameInp');
    const emailInput = document.getElementById('staffEmailInp');
    const passwordInput = document.querySelector('input[name="password"]');
    const confirmPasswordInput = document.querySelector('input[name="confirm_password"]');
    
    // Modal function
    function showModal(title, message) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">${title}</div>
                <div class="modal-body">${message}</div>
                <div class="modal-footer">
                    <button class="modal-btn">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        const button = modal.querySelector('.modal-btn');
        button.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    // Get error from cookie
    function getCookie(name) {
        const cookieString = document.cookie
            .split("; ")
            .find(row => row.startsWith(name + "="));
        return cookieString ? decodeURIComponent(cookieString.split("=")[1]) : "";
    }
    
    const registrationError = getCookie("staff_reg_res");
    
    // If there was an error, show it with error styling (ONE error message only)
    if (registrationError && registrationError.toLowerCase().includes('error')) {
        nameInput.classList.add('error');
        emailInput.classList.add('error');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.style.textAlign = 'center';
        errorMsg.style.color = '#ff4757';
        errorMsg.style.marginBottom = '10px';
        errorMsg.textContent = registrationError;
        const messageEl = document.querySelector('p.message');
        messageEl.replaceWith(errorMsg);
    }
    
    // Create ONE consolidated error message element for validation
    const errorDisplay = document.createElement('div');
    errorDisplay.className = 'error-message';
    errorDisplay.style.textAlign = 'center';
    errorDisplay.style.color = '#ff4757';
    errorDisplay.style.display = 'none';
    errorDisplay.style.marginBottom = '10px';
    form.insertBefore(errorDisplay, form.querySelector('button'));
    
    // Email validation
    emailInput.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.classList.add('error');
            errorDisplay.textContent = 'Please enter a valid email address';
            errorDisplay.style.display = 'block';
        } else {
            this.classList.remove('error');
            if (passwordInput.value === confirmPasswordInput.value) {
                errorDisplay.style.display = 'none';
            }
        }
    });
    
    // Password validation
    confirmPasswordInput.addEventListener('input', function() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordInput.classList.add('error');
            confirmPasswordInput.classList.add('error');
            errorDisplay.textContent = 'Passwords do not match';
            errorDisplay.style.display = 'block';
        } else {
            passwordInput.classList.remove('error');
            confirmPasswordInput.classList.remove('error');
            if (emailInput.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                errorDisplay.style.display = 'none';
            }
        }
    });
    
    // Form validation
    form.addEventListener('submit', function(e) {
        // Check if passwords match
        if (passwordInput.value !== confirmPasswordInput.value) {
            e.preventDefault();
            showModal('Validation Error', 'Passwords do not match!');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            e.preventDefault();
            showModal('Validation Error', 'Please enter a valid email address');
            return;
        }
        
        // Validate password strength
        if (passwordInput.value.length < 6) {
            e.preventDefault();
            showModal('Validation Error', 'Password should be at least 6 characters long');
            return;
        }
    });
    
    // Clear cookies on load
    window.addEventListener("load", () => {
        document.cookie = "staff_reg_res=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    });
});