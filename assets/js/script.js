// Tab switching functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and forms
        tabBtns.forEach(b => b.classList.remove('active'));
        authForms.forEach(f => f.classList.add('hidden'));

        // Add active class to clicked button and corresponding form
        btn.classList.add('active');
        const formId = `${btn.dataset.tab}-form`;
        document.getElementById(formId).classList.remove('hidden');
    });
});

// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.style.display = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu after clicking a link
            navLinks.style.display = 'none';
        }
    });
});

// Course filtering functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const courseCards = document.querySelectorAll('.course-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const category = btn.dataset.category;

        // Filter courses
        courseCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                // Add animation
                card.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// File Upload Handling
// const fileInput = document.getElementById('id-upload'); // Old single input
// const fileLabel = document.querySelector('.file-label'); // Old single label
// const filePreview = document.getElementById('file-preview'); // Old single preview

// --- Generic File Upload Functions ---
function initializeFileUpload(inputId, previewId) {
    const fileInput = document.getElementById(inputId);
    const fileLabel = fileInput ? fileInput.closest('.upload-container').querySelector('.file-label') : null;
    const filePreview = document.getElementById(previewId);

    if (fileInput && fileLabel && filePreview) {
        fileInput.addEventListener('change', () => handleFileSelect(fileInput, filePreview));

        fileLabel.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileLabel.classList.add('drag-over');
        });

        fileLabel.addEventListener('dragleave', () => {
            fileLabel.classList.remove('drag-over');
        });

        fileLabel.addEventListener('drop', (e) => {
            e.preventDefault();
            fileLabel.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect(fileInput, filePreview);
            }
        });
    }
}

function handleFileSelect(fileInputElement, previewElement) {
    const file = fileInputElement.files[0];
    if (!file) {
        // If no file is selected (e.g., user cancels dialog), clear preview and input
        removeFile(fileInputElement, previewElement);
        return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        removeFile(fileInputElement, previewElement); // Clear if invalid
        return;
    }

    // Determine accepted types from input's accept attribute
    const acceptedTypesString = fileInputElement.getAttribute('accept');
    const acceptedTypes = acceptedTypesString ? acceptedTypesString.split(',').map(t => t.trim()) : [];
    
    let isValidType = false;
    if (acceptedTypes.length > 0) {
        for (const type of acceptedTypes) {
            if (type.startsWith('.')) { // e.g. .jpg
                if (file.name.toLowerCase().endsWith(type)) {
                    isValidType = true;
                    break;
                }
            } else { // e.g. image/jpeg
                if (file.type === type) {
                    isValidType = true;
                    break;
                }
            }
        }
    } else {
        isValidType = true; // No accept attribute, so allow all (though usually there is one)
    }


    if (!isValidType) {
        alert(`Invalid file type. Please upload one of the following: ${acceptedTypesString || 'any file'}`);
        removeFile(fileInputElement, previewElement); // Clear if invalid
        return;
    }

    // Create preview
    previewElement.innerHTML = ''; // Clear previous preview
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewElement.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <div class="file-info">
                    <span class="file-name">${file.name}</span>
                    <i class="fas fa-times remove-file" onclick="removeFile(document.getElementById('${fileInputElement.id}'), document.getElementById('${previewElement.id}'))"></i>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else { // For PDFs or other non-image files
        previewElement.innerHTML = `
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <i class="fas fa-times remove-file" onclick="removeFile(document.getElementById('${fileInputElement.id}'), document.getElementById('${previewElement.id}'))"></i>
            </div>
        `;
    }
    previewElement.classList.add('active');
}

function removeFile(fileInputElement, previewElement) {
    if (fileInputElement) {
        fileInputElement.value = ''; // Clear the file input
    }
    if (previewElement) {
        previewElement.classList.remove('active');
        previewElement.innerHTML = '';
    }
}

// Initialize file uploads for existing and new fields
// Old initialization (commented out or removed if it was targeting old IDs directly)
/*
if (fileInput && fileLabel && filePreview) {
    // ... old event listeners ...
}
*/
initializeFileUpload('id-upload', 'id-file-preview');
initializeFileUpload('transfer-letter-upload', 'transfer-letter-preview');


// --- Registration Form Conditional Logic ---
const roleSelect = document.getElementById('register-role');
const studentIdSection = document.getElementById('student-id-section');
const studentTransferSection = document.getElementById('student-transfer-section');
const isTransferStudentSelect = document.getElementById('is-transfer-student');
const transferLetterUploadSection = document.getElementById('transfer-letter-upload-section');

const idUploadInput = document.getElementById('id-upload');
const transferLetterInput = document.getElementById('transfer-letter-upload');

// Ensure student-specific sections are hidden initially when script loads
if (studentIdSection) studentIdSection.style.display = 'none';
if (studentTransferSection) studentTransferSection.style.display = 'none';
if (transferLetterUploadSection) transferLetterUploadSection.style.display = 'none';

if (roleSelect) {
    roleSelect.addEventListener('change', function() {
        const selectedRole = this.value;
        // const idLabel = studentIdSection ? studentIdSection.querySelector('label[for="id-upload"]') : null; // Label is static now

        if (selectedRole === 'student') {
            // if (idLabel) idLabel.textContent = 'ID Document (Photo)'; // Label is static
            if (studentIdSection) studentIdSection.style.display = 'block';
            if (studentTransferSection) studentTransferSection.style.display = 'block';
            if (isTransferStudentSelect) isTransferStudentSelect.value = ""; 
            if (transferLetterUploadSection) transferLetterUploadSection.style.display = 'none';
            if (transferLetterInput) removeFile(transferLetterInput, document.getElementById('transfer-letter-preview'));
        } else {
            if (studentIdSection) studentIdSection.style.display = 'none';
            if (studentTransferSection) studentTransferSection.style.display = 'none';
            if (transferLetterUploadSection) transferLetterUploadSection.style.display = 'none';
            if (idUploadInput) removeFile(idUploadInput, document.getElementById('id-file-preview'));
            if (isTransferStudentSelect) isTransferStudentSelect.value = "";
            if (transferLetterInput) removeFile(transferLetterInput, document.getElementById('transfer-letter-preview'));
        }
    });
}

if (isTransferStudentSelect) {
    isTransferStudentSelect.addEventListener('change', function() {
        if (this.value === 'yes') {
            transferLetterUploadSection.style.display = 'block';
        } else {
            transferLetterUploadSection.style.display = 'none';
            if (transferLetterInput) removeFile(transferLetterInput, document.getElementById('transfer-letter-preview'));
        }
    });
}


// Student Number Generation and Registration Form Handling
const registerForm = document.getElementById('register-form');

let currentStudentIdCounter = 0; // Initialize counter for student IDs for this session

function generateStudentNumber() {
    currentStudentIdCounter++;
    return String(currentStudentIdCounter).padStart(6, '0'); // Format as 00000X
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => { // Made async for fetch
        e.preventDefault();

        const selectedRole = roleSelect ? roleSelect.value : '';
        const nameInput = document.getElementById('register-name');
        const emailInput = document.getElementById('register-email');
        const passwordInput = document.getElementById('register-password');
        const confirmPasswordInput = document.getElementById('register-confirm-password');

        const name = nameInput ? nameInput.value : '';
        const email = emailInput ? emailInput.value : '';
        const password = passwordInput ? passwordInput.value : '';
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

        // Basic validations
        if (!selectedRole) {
            alert('Please select your role.');
            return;
        }
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all required name, email, and password fields.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        let studentIdForForm = null;
        // Student-specific validations and ID generation
        if (selectedRole === 'student') {
            if (!idUploadInput || !idUploadInput.files[0]) {
                alert('Please upload your ID document (photo).');
                return;
            }
            const isTransfer = isTransferStudentSelect ? isTransferStudentSelect.value : '';
            if (isTransfer === '') {
                 alert('Please specify if you are transferring from another school.');
                 return;
            }
            if (isTransfer === 'yes' && (!transferLetterInput || !transferLetterInput.files[0])) {
                alert('Please upload your transfer letter.');
                return;
            }
            studentIdForForm = generateStudentNumber(); // Generate student ID here
        }

        console.log('Registration form valid, preparing to send to backend.');

        const formData = new FormData(); // Create a new FormData object
        formData.append('role', selectedRole);
        formData.append('fullName', name);
        formData.append('email', email);
        formData.append('password', password); // Note: Sending password, ensure HTTPS in production!

        if (selectedRole === 'student') {
            if (studentIdForForm) {
                formData.append('studentId', studentIdForForm);
            }
            if (idUploadInput && idUploadInput.files[0]) {
                formData.append('id_document', idUploadInput.files[0]);
            }
            const isTransferValue = isTransferStudentSelect ? isTransferStudentSelect.value : 'no';
            formData.append('is_transfer', isTransferValue);
            if (isTransferValue === 'yes' && transferLetterInput && transferLetterInput.files[0]) {
                formData.append('transfer_letter', transferLetterInput.files[0]);
            }
        }
        
        // Log FormData before sending (for debugging)
        // for (let [key, value] of formData.entries()) { 
        //     console.log(key, value);
        // }

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                body: formData // Send formData directly, browser sets Content-Type to multipart/form-data
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Backend response:', result);

                // Display success message on the frontend
                const successSection = document.getElementById('registration-success');
                const successTitle = successSection ? successSection.querySelector('h2#registration-success-title') : null;
                const studentIdDisplay = document.getElementById('student-id-display');
                const studentIdMessageLine = document.getElementById('student-id-message-line');
                const adminEmailDisplay = document.getElementById('admin-email-display');

                if (adminEmailDisplay) {
                    adminEmailDisplay.textContent = 'pagepage@gmail.com'; // Still display this for context
                }

                if (selectedRole === 'student' && result.studentId) {
                    if (studentIdDisplay) studentIdDisplay.textContent = result.studentId; // Use ID from backend if available, or the one generated
                    if (studentIdMessageLine) studentIdMessageLine.style.display = 'block';
                    if (successTitle) successTitle.textContent = 'Student Registration Successful!';
                } else {
                    if (studentIdMessageLine) studentIdMessageLine.style.display = 'none';
                    if (successTitle) successTitle.textContent = 'Registration Successful!';
                }
                
                const authContainer = registerForm.closest('.auth-container');
                if (authContainer) {
                    registerForm.style.display = 'none';
                    if (studentIdSection) studentIdSection.style.display = 'none';
                    if (studentTransferSection) studentTransferSection.style.display = 'none';
                    if (transferLetterUploadSection) transferLetterUploadSection.style.display = 'none';
                    if (successSection) successSection.style.display = 'block';
                } else {
                    console.error('Auth container not found for success message.');
                }

            } else {
                console.error('Backend error:', result);
                alert(`Registration failed: ${result.message || 'Unknown error from server'}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Could not connect to the server or an error occurred. Please try again later.');
        }
    });
}

// ... (rest of the script, e.g., commented out old generic form handler)
/*
forms.forEach(form => {
// ...
});
*/ 