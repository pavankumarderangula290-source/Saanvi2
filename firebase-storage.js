// Firebase Cloud Storage Module - For Image Uploads
import { storage } from './firebase-config.js';
import { ref, uploadBytes, getBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { showNotification } from './firebase-auth.js';

// Upload image to Firebase Storage
export function uploadImage(file, folder = 'gallery') {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file selected');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject('File size must be less than 5MB');
      return;
    }

    // Generate unique filename
    const timestamp = new Date().getTime();
    const filename = timestamp + '_' + file.name;
    const storageRef = ref(storage, folder + '/' + filename);

    // Show upload progress
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log('Image uploaded successfully');
        
        // Get download URL
        getDownloadURL(storageRef).then((downloadURL) => {
          resolve({
            url: downloadURL,
            filename: filename,
            uploadedAt: new Date().toISOString(),
            path: snapshot.metadata.fullPath
          });
        });
      })
      .catch((error) => {
        console.error('Upload error:', error);
        reject(error);
      });
  });
}

// Delete image from Firebase Storage
export function deleteImage(filePath) {
  return new Promise((resolve, reject) => {
    const fileRef = ref(storage, filePath);
    deleteObject(fileRef)
      .then(() => {
        console.log('Image deleted from storage');
        resolve();
      })
      .catch((error) => {
        console.error('Error deleting image:', error);
        reject(error);
      });
  });
}

// Get image download URL
export function getImageURL(filePath) {
  return new Promise((resolve, reject) => {
    const fileRef = ref(storage, filePath);
    getDownloadURL(fileRef)
      .then((url) => {
        resolve(url);
      })
      .catch((error) => {
        console.error('Error getting image URL:', error);
        reject(error);
      });
  });
}

// Upload multiple images
export function uploadMultipleImages(files, folder = 'gallery') {
  return Promise.all(
    Array.from(files).map(file => uploadImage(file, folder))
  );
}

// Update upload progress UI
export function updateUploadProgress(progress) {
  const progressBar = document.getElementById('uploadProgress');
  if (progressBar) {
    progressBar.style.width = progress + '%';
    progressBar.textContent = Math.round(progress) + '%';
  }
}