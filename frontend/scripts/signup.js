// Signup page functionality

document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signupForm');
  
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  // Real-time validation listeners
  const passwordField = document.getElementById('signup-password');
  const confirmPasswordField = document.getElementById('confirmPassword');
  
  if (confirmPasswordField && passwordField) {
    confirmPasswordField.addEventListener('input', validatePasswordMatch);
    passwordField.addEventListener('input', validatePasswordMatch);
  }
  
  // Change: Enabled password strength indicator
  addPasswordStrengthIndicator();
});

function validatePasswordMatch() {
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const confirmField = document.getElementById('confirmPassword');
  
  if (confirmPassword && password !== confirmPassword) {
    confirmField.style.borderColor = 'var(--destructive)';
    showValidationMessage(confirmField, 'Passwords do not match');
    return false;
  } else {
    confirmField.style.borderColor = '';
    clearValidationMessage(confirmField);
    return true;
  }
}

function showValidationMessage(field, message) {
  clearValidationMessage(field);
  const messageDiv = document.createElement('div');
  messageDiv.className = 'validation-message';
  messageDiv.textContent = message;
  field.parentNode.appendChild(messageDiv);
}

function clearValidationMessage(field) {
  const existingMessage = field.parentNode.querySelector('.validation-message');
  if (existingMessage) {
    existingMessage.remove();
  }
}

async function handleSignup(e) {
  e.preventDefault();
  
  const userData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('signup-email').value,
    age: document.getElementById('age').value,
    password: document.getElementById('signup-password').value,
    confirmPassword: document.getElementById('confirmPassword').value,
    role: document.querySelector('input[name="role"]:checked').value,
    terms: document.getElementById('terms').checked
  };
  
  // Final validation before submit
  if (!validatePasswordMatch()) {
    showToast('Passwords do not match.', 'error');
    return;
  }
  
  // Other validations...

  const submitButton = e.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Creating Account...';
  lucide.createIcons();
  
  try {
    await simulateApiCall({ success: true }, 2000);
    
    const user = {
      name: `${userData.firstName} ${userData.lastName}`,
      firstName: userData.firstName,
      email: userData.email,
      role: userData.role,
      loginTime: new Date().toISOString()
    };
    
    setCurrentUser(user);
    
    showToast(`Account created successfully! Welcome, ${userData.firstName}!`, 'success');
    
    setTimeout(() => {
      const redirectUrl = userData.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
      navigateTo(redirectUrl);
    }, 1500);
    
  } catch (error) {
    handleError(error, 'Account creation failed. Please try again.');
    submitButton.disabled = false;
    submitButton.innerHTML = 'Create Account';
  }
}

function addPasswordStrengthIndicator() {
  const passwordField = document.getElementById('signup-password');
  const container = document.getElementById('password-strength-container');
  if (!passwordField || !container) return;
  
  container.innerHTML = `
    <div class="password-strength-bar">
      <div class="password-strength-fill"></div>
    </div>
    <div class="password-strength-text"></div>
  `;

  const fill = container.querySelector('.password-strength-fill');
  const text = container.querySelector('.password-strength-text');
  
  passwordField.addEventListener('input', function() {
    const strength = calculatePasswordStrength(this.value);
    fill.style.width = `${strength.percentage}%`;
    fill.style.backgroundColor = strength.color;
    text.textContent = strength.text;
    text.style.color = strength.color;
  });
}

function calculatePasswordStrength(password) {
  let score = 0;
  if (!password) return { percentage: 0, color: 'transparent', text: '' };
  
  if (password.length >= 8) score += 25;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
  if (/[0-9]/.test(password)) score += 25;
  if (/[^A-Za-z0-9]/.test(password)) score += 25;

  let color, text;
  if (score < 50) {
    color = 'var(--destructive)'; text = 'Weak';
  } else if (score < 75) {
    color = 'var(--warning)'; text = 'Fair';
  } else if (score < 100) {
    color = 'var(--primary)'; text = 'Good';
  } else {
    color = 'var(--wellness)'; text = 'Strong';
  }
  
  return { percentage: score, color, text };
}