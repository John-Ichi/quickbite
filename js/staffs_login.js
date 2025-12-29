document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const form = document.querySelector('form');
    
    // Get error from cookie
    function getCookie(name) {
        const cookieString = document.cookie
            .split("; ")
            .find(row => row.startsWith(name + "="));
        return cookieString ? decodeURIComponent(cookieString.split("=")[1]) : "";
    }
    
    const loginError = getCookie("staff_login_err");
    
    // If there was a login error, keep the email and show single error
    if (loginError) {
        emailInput.classList.add('error');
        
        // Create one consolidated error message element
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.style.marginTop = '10px';
        errorMsg.style.color = '#ff4757';
        errorMsg.style.textAlign = 'center';
        errorMsg.textContent = loginError;
        form.insertBefore(errorMsg, form.querySelector('button'));
    }
    
    // Clear error on input
    emailInput.addEventListener('input', function() {
        emailInput.classList.remove('error');
        const errorMsg = document.querySelector('.error-message');
        if (errorMsg) errorMsg.style.display = 'none';
    });
    
    passwordInput.addEventListener('input', function() {
        const errorMsg = document.querySelector('.error-message');
        if (errorMsg) errorMsg.style.display = 'none';
    });
    
    // Clear cookies on load
    window.addEventListener("load", () => {
        document.cookie = "staff_login_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        document.cookie = "staff_login_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    });
});
