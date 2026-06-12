// Firebase Realtime Database Module
import { database } from './firebase-config.js';
import { ref, set, get, remove, onValue } from "firebase/database";
import { showNotification } from './firebase-auth.js';

// ====== USER DATA ======

// Save user data
export function saveUserData(userId, userData) {
  set(ref(database, 'users/' + userId), userData)
    .then(() => {
      console.log('User data saved');
    })
    .catch((error) => {
      console.error('Error saving user data:', error);
      showNotification('Error saving data', 'error');
    });
}

// Get user data
export function getUserData(userId) {
  return new Promise((resolve, reject) => {
    get(ref(database, 'users/' + userId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject('User not found');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Get all users
export function getAllUsers() {
  return new Promise((resolve, reject) => {
    get(ref(database, 'users'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = [];
          snapshot.forEach((childSnapshot) => {
            users.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          resolve(users);
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// ====== STUDENT DATA ======

// Save student profile
export function saveStudentProfile(studentId, profileData) {
  set(ref(database, 'students/' + studentId), profileData)
    .then(() => {
      console.log('Student profile saved');
      showNotification('Profile updated successfully!', 'success');
    })
    .catch((error) => {
      console.error('Error saving student profile:', error);
      showNotification('Error updating profile', 'error');
    });
}

// Get student profile
export function getStudentProfile(studentId) {
  return new Promise((resolve, reject) => {
    get(ref(database, 'students/' + studentId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject('Student not found');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Get all students
export function getAllStudents() {
  return new Promise((resolve, reject) => {
    get(ref(database, 'students'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const students = [];
          snapshot.forEach((childSnapshot) => {
            students.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          resolve(students);
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// ====== STAFF DATA ======

// Save staff profile
export function saveStaffProfile(staffId, profileData) {
  set(ref(database, 'staff/' + staffId), profileData)
    .then(() => {
      console.log('Staff profile saved');
      showNotification('Profile updated successfully!', 'success');
    })
    .catch((error) => {
      console.error('Error saving staff profile:', error);
      showNotification('Error updating profile', 'error');
    });
}

// Get staff profile
export function getStaffProfile(staffId) {
  return new Promise((resolve, reject) => {
    get(ref(database, 'staff/' + staffId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject('Staff not found');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Get all staff
export function getAllStaff() {
  return new Promise((resolve, reject) => {
    get(ref(database, 'staff'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const staffList = [];
          snapshot.forEach((childSnapshot) => {
            staffList.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          resolve(staffList);
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// ====== GALLERY DATA ======

// Save gallery image metadata
export function saveGalleryImage(imageId, imageData) {
  set(ref(database, 'gallery/' + imageId), imageData)
    .then(() => {
      console.log('Gallery image saved');
      showNotification('Image added to gallery!', 'success');
    })
    .catch((error) => {
      console.error('Error saving gallery image:', error);
      showNotification('Error adding image', 'error');
    });
}

// Get all gallery images
export function getGalleryImages() {
  return new Promise((resolve, reject) => {
    get(ref(database, 'gallery'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const images = [];
          snapshot.forEach((childSnapshot) => {
            images.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          resolve(images);
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Delete gallery image
export function deleteGalleryImage(imageId) {
  remove(ref(database, 'gallery/' + imageId))
    .then(() => {
      console.log('Gallery image deleted');
      showNotification('Image deleted successfully!', 'success');
    })
    .catch((error) => {
      console.error('Error deleting image:', error);
      showNotification('Error deleting image', 'error');
    });
}

// ====== COURSES DATA ======

// Save course
export function saveCourse(courseId, courseData) {
  set(ref(database, 'courses/' + courseId), courseData)
    .then(() => {
      console.log('Course saved');
      showNotification('Course added successfully!', 'success');
    })
    .catch((error) => {
      console.error('Error saving course:', error);
      showNotification('Error adding course', 'error');
    });
}

// Get all courses
export function getCourses() {
  return new Promise((resolve, reject) => {
    get(ref(database, 'courses'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const courses = [];
          snapshot.forEach((childSnapshot) => {
            courses.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          resolve(courses);
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// ====== ANNOUNCEMENTS DATA ======

// Save announcement
export function saveAnnouncement(announcementId, announcementData) {
  set(ref(database, 'announcements/' + announcementId), {
    ...announcementData,
    createdAt: new Date().toISOString()
  })
    .then(() => {
      console.log('Announcement saved');
      showNotification('Announcement posted!', 'success');
    })
    .catch((error) => {
      console.error('Error saving announcement:', error);
      showNotification('Error posting announcement', 'error');
    });
}

// Get all announcements
export function getAnnouncements() {
  return new Promise((resolve, reject) => {
    get(ref(database, 'announcements'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const announcements = [];
          snapshot.forEach((childSnapshot) => {
            announcements.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          // Sort by date (newest first)
          announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          resolve(announcements);
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Delete announcement
export function deleteAnnouncement(announcementId) {
  remove(ref(database, 'announcements/' + announcementId))
    .then(() => {
      console.log('Announcement deleted');
      showNotification('Announcement deleted!', 'success');
    })
    .catch((error) => {
      console.error('Error deleting announcement:', error);
      showNotification('Error deleting announcement', 'error');
    });
}

// ====== REAL-TIME LISTENERS ======

// Listen for real-time gallery updates
export function listenForGalleryUpdates(callback) {
  onValue(ref(database, 'gallery'), (snapshot) => {
    if (snapshot.exists()) {
      const images = [];
      snapshot.forEach((childSnapshot) => {
        images.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      callback(images);
    } else {
      callback([]);
    }
  });
}

// Listen for real-time announcements
export function listenForAnnouncements(callback) {
  onValue(ref(database, 'announcements'), (snapshot) => {
    if (snapshot.exists()) {
      const announcements = [];
      snapshot.forEach((childSnapshot) => {
        announcements.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      // Sort by date (newest first)
      announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(announcements);
    } else {
      callback([]);
    }
  });
}