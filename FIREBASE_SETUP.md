# Firebase Integration Setup Guide - Saanvi

## ✅ Firebase Project Already Created!

Your Firebase project **saanvi-4f853** is ready! Here's what you have:

- **Project ID**: saanvi-4f853
- **Auth Domain**: saanvi-4f853.firebaseapp.com
- **Storage Bucket**: saanvi-4f853.firebasestorage.app

## 📁 Files Created

The following Firebase integration files have been created:

1. **firebase-config.js** - Firebase initialization & credentials
2. **firebase-auth.js** - Authentication functions (login, register, logout)
3. **firebase-database.js** - Database operations (CRUD for all data)
4. **firebase-storage.js** - Image upload/download functions
5. **firebase-utils.js** - Helper utilities

## 🚀 Quick Start

### Step 1: Enable Required Features in Firebase Console

Go to [Firebase Console](https://console.firebase.google.com/) → select **saanvi-4f853**

#### A. Enable Realtime Database
1. Click "Realtime Database" (left sidebar)
2. Click "Create Database"
3. Select region closest to you
4. Start in **Test Mode** (for development)
5. Click "Enable"

#### B. Enable Authentication
1. Click "Authentication" (left sidebar)
2. Click "Get started"
3. Click on "Email/Password"
4. Toggle it ON
5. Click "Save"

#### C. Enable Cloud Storage
1. Click "Storage" (left sidebar)
2. Click "Get started"
3. Accept default settings
4. Click "Next" then "Done"

### Step 2: Set Security Rules (Important!)

#### For Realtime Database - Go to "Rules" tab:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid"
      }
    },
    "students": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "staff": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "gallery": {
      ".read": true,
      ".write": "auth != null"
    },
    "announcements": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "courses": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin'"
    }
  }
}
```

#### For Cloud Storage - Go to "Rules" tab:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

### Step 3: Update Your HTML Files

#### Add Firebase SDK to your `<head>` section:

```html
<head>
  <!-- ... other meta tags ... -->
  
  <!-- Firebase SDK (v9+) -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
    import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
    import { getDatabase } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
    import { getStorage } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
  </script>

  <!-- Your Firebase Modules (in order) -->
  <script type="module" src="firebase-config.js"></script>
  <script type="module" src="firebase-auth.js"></script>
  <script type="module" src="firebase-database.js"></script>
  <script type="module" src="firebase-storage.js"></script>
  <script type="module" src="firebase-utils.js"></script>
</head>
```

### Step 4: Update Login Page

In **login.html**, add this to your login form:

```html
<form id="loginForm">
  <input type="email" id="email" placeholder="Email" required>
  <input type="password" id="password" placeholder="Password" required>
  <button type="submit">Login</button>
  <a href="register.html">Don't have an account? Register here</a>
</form>

<script type="module">
  import { loginUser } from './firebase-auth.js';
  
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginUser(email, password);
  });
</script>
```

### Step 5: Create Registration Page

Create **register.html**:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Register - Saanvi</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <style>
    .register-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="register-container">
    <h1>Register</h1>
    <form id="registerForm">
      <input type="email" id="email" placeholder="Email" required>
      <input type="password" id="password" placeholder="Password (min 6 chars)" required>
      <input type="text" id="displayName" placeholder="Full Name" required>
      <select id="role" required>
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="staff">Staff Member</option>
        <option value="admin">Administrator</option>
      </select>
      <button type="submit">Register</button>
      <p>Already have an account? <a href="login.html">Login here</a></p>
    </form>
  </div>

  <script type="module">
    import { registerUser, showNotification } from './firebase-auth.js';
    import { validateEmail, validatePassword } from './firebase-utils.js';
    
    document.getElementById('registerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const displayName = document.getElementById('displayName').value;
      const role = document.getElementById('role').value;
      
      if (!validateEmail(email)) {
        showNotification('Invalid email format', 'error');
        return;
      }
      if (!validatePassword(password)) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
      }
      
      registerUser(email, password, displayName, role);
    });
  </script>
</body>
</html>
```

### Step 6: Add Logout Button

Add to your navbar/header:

```html
<button id="logoutBtn" onclick="logoutUser()">Logout</button>

<script type="module">
  import { logoutUser, onAuthChange } from './firebase-auth.js';
  window.logoutUser = logoutUser; // Make available globally
  
  onAuthChange((user) => {
    console.log('Auth state changed:', user);
  });
</script>
```

### Step 7: Load Gallery Images (gallery.js)

```javascript
import { listenForGalleryUpdates, getGalleryImages } from './firebase-database.js';
import { uploadImage } from './firebase-storage.js';
import { saveGalleryImage, deleteGalleryImage } from './firebase-database.js';
import { generateId } from './firebase-utils.js';

// Load gallery on page load
document.addEventListener('DOMContentLoaded', () => {
  listenForGalleryUpdates((images) => {
    displayGallery(images);
  });
});

function displayGallery(images) {
  const galleryContainer = document.getElementById('gallery-container');
  galleryContainer.innerHTML = '';
  
  images.forEach(image => {
    const col = document.createElement('div');
    col.className = 'gallery-item';
    col.innerHTML = `
      <img src="${image.url}" alt="${image.title || 'Gallery image'}">
      <p>${image.title || ''}</p>
    `;
    galleryContainer.appendChild(col);
  });
}

// Upload image
document.getElementById('imageUpload').addEventListener('change', async (event) => {
  const files = event.target.files;
  
  for (let file of files) {
    const imageData = await uploadImage(file, 'gallery');
    
    saveGalleryImage(generateId(), {
      title: file.name,
      url: imageData.url,
      storagePath: imageData.path,
      uploadedAt: imageData.uploadedAt
    });
  }
});
```

## 🗄️ Database Structure

Your Firebase database will look like:

```
saanvi-4f853/
├── users/
│   ├── userId1/
│   │   ├── email: "student@school.com"
│   │   ├── displayName: "John Doe"
│   │   ├── role: "student"
│   │   └── createdAt: "2024-01-15T10:30:00Z"
│   └── userId2/ ...
├── students/
│   ├── studentId/
│   │   ├── name: "John Doe"
│   │   ├── studentNumber: "S001"
│   │   ├── class: "10A"
│   │   └── gpa: "3.8"
│   └── ...
├── staff/
│   ├── staffId/
│   │   ├── name: "Mrs. Smith"
│   │   ├── department: "Mathematics"
│   │   ├── position: "Teacher"
│   │   └── email: "smith@school.com"
│   └── ...
├── gallery/
│   ├── imageId1/
│   │   ├── title: "School Event"
│   │   ├── url: "https://..."
│   │   ├── storagePath: "gallery/1234_photo.jpg"
│   │   └── uploadedAt: "2024-01-15T10:30:00Z"
│   └── ...
├── courses/
│   ├── courseId/
│   │   ├── name: "Mathematics 101"
│   │   ├── instructor: "Mrs. Smith"
│   │   └── schedule: "MWF 10:00 AM"
│   └── ...
└── announcements/
    ├── announcementId/
    │   ├── title: "School Closed Tomorrow"
    │   ├── content: "..."
    │   ├── postedBy: "admin"
    │   └── createdAt: "2024-01-15T10:30:00Z"
    └── ...
```

## 📱 Mobile Optimization

Your files are ready for mobile optimization. Next, we'll:

1. Add responsive CSS media queries
2. Implement mobile-first design
3. Add touch-friendly navigation
4. Optimize images for mobile

## 🔒 Important Security Notes

- **Never share your API key** in production
- Update security rules before going live
- Validate all user input on the server
- Use HTTPS only in production

## 📚 Common Functions Reference

### Authentication
```javascript
import { loginUser, registerUser, logoutUser, getCurrentUser } from './firebase-auth.js';

loginUser(email, password);
registerUser(email, password, displayName, role);
logoutUser();
const user = getCurrentUser();
```

### Database
```javascript
import { 
  saveGalleryImage, 
  getGalleryImages, 
  listenForGalleryUpdates,
  saveAnnouncement,
  getAnnouncements
} from './firebase-database.js';

saveGalleryImage(id, imageData);
listenForGalleryUpdates((images) => { /* ... */ });
```

### Storage
```javascript
import { uploadImage, deleteImage, getImageURL } from './firebase-storage.js';

const result = await uploadImage(file, 'gallery');
await deleteImage(filePath);
```

## ✅ Next Steps

1. ✅ Firebase account created
2. ✅ Firebase modules created
3. → Enable Firebase features (Database, Auth, Storage)
4. → Set security rules
5. → Update HTML files with Firebase code
6. → Test login/registration
7. → Optimize for mobile

## 🆘 Troubleshooting

**Error: "Firebase is not defined"**
- Make sure Firebase SDK scripts are loaded first

**Error: "Permission denied"**
- Check your Firebase security rules
- Ensure user is authenticated

**Images not uploading**
- Check Storage rules
- Verify file size < 5MB
- Check browser console for errors

**Real-time updates not working**
- Check database rules allow `.read`
- Verify user is authenticated

## 📖 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase GitHub](https://github.com/firebase/firebase-js-sdk)
