// Firebase Authentication Module
import { auth, database } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { ref, set, get } from "firebase/database";

// Enable persistence
setPersistence(auth, browserLocalPersistence).catch(error => {
  console.error("Error setting persistence:", error);
});

// User Registration
export function registerUser(email, password, displayName, role) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Update user profile
      updateProfile(user, {
        displayName: displayName
      }).then(() => {
        // Save user data to database
        saveUserData(user.uid, {
          email: email,
          displayName: displayName,
          role: role, // 'student', 'staff', 'admin'
          createdAt: new Date().toISOString()
        });
        console.log('User registered successfully');
        showNotification('Registration successful!', 'success');
        // Redirect based on role
        setTimeout(() => redirectToDashboard(role), 1500);
      });
    })
    .catch((error) => {
      console.error('Registration error:', error.message);
      showNotification(error.message, 'error');
    });
}

// User Login
export function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User logged in:', user.email);
      showNotification('Login successful!', 'success');
      
      // Get user role from database
      getUserRole(user.uid).then(role => {
        setTimeout(() => redirectToDashboard(role), 1500);
      });
    })
    .catch((error) => {
      console.error('Login error:', error.message);
      showNotification(error.message, 'error');
    });
}

// User Logout
export function logoutUser() {
  signOut(auth)
    .then(() => {
      console.log('User logged out');
      showNotification('Logged out successfully', 'success');
      setTimeout(() => window.location.href = 'index.html', 1500);
    })
    .catch((error) => {
      console.error('Logout error:', error.message);
    });
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}

// Listen for auth state changes
export function onAuthChange(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User logged in:', user.email);
      updateNavbarForLoggedInUser(user);
      callback(user);
    } else {
      console.log('No user logged in');
      updateNavbarForLoggedOutUser();
      callback(null);
    }
  });
}

// Password reset
export function resetPassword(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log('Password reset email sent');
      showNotification('Password reset email sent. Check your inbox.', 'success');
    })
    .catch((error) => {
      console.error('Password reset error:', error.message);
      showNotification(error.message, 'error');
    });
}

// ===== Helper Functions =====

// Save user data to database
export function saveUserData(userId, userData) {
  set(ref(database, 'users/' + userId), userData)
    .then(() => {
      console.log('User data saved');
    })
    .catch((error) => {
      console.error('Error saving user data:', error);
    });
}

// Get user role
export function getUserRole(userId) {
  return new Promise((resolve, reject) => {
    get(ref(database, 'users/' + userId + '/role'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject('User role not found');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Update navbar for logged-in user
function updateNavbarForLoggedInUser(user) {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userNameDisplay = document.getElementById('userNameDisplay');
  
  if (loginBtn) loginBtn.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'block';
  if (userNameDisplay) userNameDisplay.textContent = 'Welcome, ' + (user.displayName || user.email);
}

// Update navbar for logged-out user
function updateNavbarForLoggedOutUser() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userNameDisplay = document.getElementById('userNameDisplay');
  
  if (loginBtn) loginBtn.style.display = 'block';
  if (logoutBtn) logoutBtn.style.display = 'none';
  if (userNameDisplay) userNameDisplay.textContent = '';
}

// Show notification
export function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 4px;
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
    font-weight: 500;
  `;
  
  if (type === 'success') {
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#f44336';
    notification.style.color = 'white';
  } else if (type === 'warning') {
    notification.style.backgroundColor = '#ff9800';
    notification.style.color = 'white';
  } else {
    notification.style.backgroundColor = '#2196F3';
    notification.style.color = 'white';
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Redirect to dashboard based on role
export function redirectToDashboard(role) {
  switch(role) {
    case 'admin':
      window.location.href = 'admin.html';
      break;
    case 'staff':
      window.location.href = 'staff-dashboard.html';
      break;
    case 'student':
      window.location.href = 'student-dashboard.html';
      break;
    default:
      window.location.href = 'index.html';
  }
}