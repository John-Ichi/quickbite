document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById("storeEmailInp");
    const nameInput = document.getElementById("storeNameInp");
    const passwordInput = document.querySelector('input[name="password"]');
    const confirmPasswordInput = document.querySelector('input[name="confirm_password"]');
    const signupBtn = document.getElementById("signupBtn");
    const form = document.querySelector('form');
    
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
    
    // Create ONE consolidated error message element
    const errorDisplay = document.createElement('div');
    errorDisplay.className = 'error-message';
    errorDisplay.style.color = '#ff4757';
    errorDisplay.style.display = 'none';
    errorDisplay.style.textAlign = 'center';
    errorDisplay.style.marginBottom = '10px';
    form.insertBefore(errorDisplay, form.querySelector('button'));
    
    // Check cookies for previous errors
    function getCookie(name) {
        return document.cookie
            .split("; ")
            .find(row => row.startsWith(name + "="))
            ?.split("=")[1];
    }
    
    const errEmail = decodeURIComponent(getCookie("store_reg_email_err") || "");
    const errName = decodeURIComponent(getCookie("store_reg_name_err") || "");
    const errPassword = decodeURIComponent(getCookie("store_reg_pass_err") || "");
    
    // Show ONE consolidated error if there was a previous error
    if (errEmail || errName || errPassword) {
        errorDisplay.style.display = 'block';
        if (errEmail) {
            emailInput.value = errEmail;
            emailInput.classList.add('error');
            errorDisplay.textContent = 'An account with this email already exists';
        }
        if (errName) {
            nameInput.value = errName;
            nameInput.classList.add('error');
            errorDisplay.textContent = 'An account with this store name already exists';
        }
        if (errPassword) {
            passwordInput.classList.add('error');
            confirmPasswordInput.classList.add('error');
            errorDisplay.textContent = errPassword;
        }
    }
    
    // Real-time validation for email
    emailInput.addEventListener('input', function() {
        if (this.value) {
            emailInput.classList.remove('error');
            errorDisplay.style.display = 'none';
        }
    });
    
    // Real-time validation for name
    nameInput.addEventListener('input', function() {
        if (this.value) {
            nameInput.classList.remove('error');
            errorDisplay.style.display = 'none';
        }
    });
    
    // Password match validation
    confirmPasswordInput.addEventListener('input', function() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordInput.classList.add('error');
            confirmPasswordInput.classList.add('error');
            errorDisplay.textContent = 'Passwords do not match';
            errorDisplay.style.display = 'block';
        } else {
            passwordInput.classList.remove('error');
            confirmPasswordInput.classList.remove('error');
            errorDisplay.style.display = 'none';
        }
    });
    
    // Form validation before submission
    form.addEventListener('submit', function(e) {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailInput.classList.add('error');
            errorDisplay.textContent = 'Please enter a valid email address';
            errorDisplay.style.display = 'block';
            e.preventDefault();
            return;
        }
        
        // Password match validation
        if (passwordInput.value !== confirmPasswordInput.value) {
            e.preventDefault();
            showModal('Validation Error', 'Passwords do not match!');
            return;
        }
        
        // Password length validation
        if (passwordInput.value.length < 6) {
            e.preventDefault();
            showModal('Validation Error', 'Password should be at least 6 characters long');
            return;
        }
    });
    
    // Clear cookies on load
    window.addEventListener("load", () => {
        document.cookie = "store_reg_pass_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        document.cookie = "store_reg_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        document.cookie = "store_reg_email_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        document.cookie = "store_reg_name_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    });
});