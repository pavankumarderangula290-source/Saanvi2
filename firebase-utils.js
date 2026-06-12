// Utility Functions
import { getCurrentUser } from './firebase-auth.js';

// Check if user is authenticated
export function isUserAuthenticated() {
  return getCurrentUser() !== null;
}

// Require authentication (redirect if not logged in)
export function requireAuth() {
  if (!isUserAuthenticated()) {
    window.location.href = 'login.html';
  }
}

// Format date
export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Generate unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Validate email
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate password (min 6 characters)
export function validatePassword(password) {
  return password.length >= 6;
}

// Format time ago (e.g., "2 hours ago")
export function formatTimeAgo(dateString) {
  const now = new Date();
  const then = new Date(dateString);
  const diff = Math.floor((now - then) / 1000); // difference in seconds

  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago';
  if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
  if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
  
  return formatDate(dateString);
}