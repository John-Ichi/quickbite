// Enhanced registration.js
document.addEventListener('DOMContentLoaded', function() {
    const importZone = document.getElementById('importZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const uploadBtn = document.getElementById('uploadBtn');
    const usersTable = document.getElementById('usersTable');
    const emptyState = document.getElementById('emptyState');
    
    // File upload functionality
    importZone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileInfo.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            fileInfo.style.color = '#06b6d4';
            
            // Show upload button
            uploadBtn.style.display = 'inline-block';
            uploadBtn.addEventListener('click', uploadFile);
        }
    });
    
    importZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        importZone.style.borderColor = '#06b6d4';
        importZone.style.background = 'rgba(6, 182, 212, 0.05)';
    });
    
    importZone.addEventListener('dragleave', () => {
        importZone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        importZone.style.background = 'transparent';
    });
    
    importZone.addEventListener('drop', (e) => {
        e.preventDefault();
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
        importZone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        importZone.style.background = 'transparent';
    });
    
    // Upload file function
    async function uploadFile() {
        const file = fileInput.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            uploadBtn.innerHTML = '<span class="spinner"></span> Uploading...';
            uploadBtn.disabled = true;
            
            const response = await fetch('upload.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                fileInfo.innerHTML = `<span style="color:#38ef7d">✓ ${result.message}</span>`;
                loadUsers();
            } else {
                fileInfo.innerHTML = `<span style="color:#ff6b6b">✗ ${result.message}</span>`;
            }
        } catch (error) {
            fileInfo.innerHTML = `<span style="color:#ff6b6b">✗ Upload failed</span>`;
        } finally {
            uploadBtn.innerHTML = 'Upload File';
            uploadBtn.disabled = false;
        }
    }
    
    // Load users from API
    async function loadUsers() {
        try {
            const response = await fetch('api/users.php');
            const users = await response.json();
            
            if (users.length === 0) {
                usersTable.style.display = 'none';
                emptyState.style.display = 'block';
                return;
            }
            
            usersTable.style.display = 'table';
            emptyState.style.display = 'none';
            
            const tbody = usersTable.querySelector('tbody');
            tbody.innerHTML = '';
            
            users.forEach((user, index) => {
                const row = document.createElement('tr');
                row.style.animationDelay = `${index * 0.1}s`;
                
                row.innerHTML = `
                    <td class="user-id">
                        <span class="user-badge">${user.student_number}</span>
                    </td>
                    <td class="user-name">
                        <div class="user-avatar">${getInitials(user.name)}</div>
                        <div>
                            <div>${user.name}</div>
                            <small>${user.email || 'No email provided'}</small>
                        </div>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }
    
    function getInitials(name) {
        return name.split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
    
    // Initial load
    loadUsers();
    
    // Auto-refresh every 30 seconds
    setInterval(loadUsers, 30000);
    
    // Add spinner CSS
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .user-badge {
            background: rgba(139, 92, 246, 0.1);
            color: #8b5cf6;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
        }
        
        .user-avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            margin-right: 12px;
        }
        
        .user-name {
            display: flex;
            align-items: center;
        }
        
        .user-name small {
            display: block;
            color: var(--text-muted);
            font-size: 12px;
            margin-top: 2px;
        }
    `;
    document.head.appendChild(style);
});