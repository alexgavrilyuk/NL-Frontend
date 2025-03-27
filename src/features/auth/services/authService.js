// src/features/auth/services/authService.js

import firebase from 'firebase/app';
import 'firebase/auth';
import apiClient from '../../shared/api/apiClient';

// Firebase configuration - you'll need to add your own Firebase config
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

class AuthService {
  // Register a new user with Firebase
  async register(email, password, displayName) {
    try {
      // Create user in Firebase
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

      // Update display name
      await userCredential.user.updateProfile({
        displayName: displayName
      });

      // Get ID token
      const idToken = await userCredential.user.getIdToken();

      // Register with backend
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        displayName
      }, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Login with email and password
  async login(email, password) {
    try {
      // Sign in with Firebase
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);

      // Get ID token
      const idToken = await userCredential.user.getIdToken();

      // Login with backend
      const response = await apiClient.post('/auth/login', {}, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      // Store token in localStorage
      localStorage.setItem('authToken', idToken);

      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Logout user
  async logout() {
    try {
      // Logout from backend
      await apiClient.post('/auth/logout');

      // Sign out from Firebase
      await firebase.auth().signOut();

      // Remove token from localStorage
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user from Firebase
  getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        unsubscribe();

        if (user) {
          try {
            // Get user data from backend
            const idToken = await user.getIdToken();
            const response = await apiClient.get('/auth/me', {
              headers: {
                Authorization: `Bearer ${idToken}`
              }
            });

            resolve(response.data.data.user);
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(null);
        }
      }, reject);
    });
  }

  // Request password reset
  async forgotPassword(email) {
    try {
      await firebase.auth().sendPasswordResetEmail(email);

      // Also inform backend
      const response = await apiClient.post('/auth/forgot-password', { email });

      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Handle Firebase and backend errors
  _handleError(error) {
    let message = 'An unexpected error occurred';

    if (error.response) {
      // Backend error
      const errorData = error.response.data.error;
      message = errorData.message || message;

      return {
        code: errorData.code || 'UNKNOWN_ERROR',
        message: message
      };
    } else if (error.code) {
      // Firebase error
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email format';
          break;
        case 'auth/weak-password':
          message = 'Password is too weak';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Invalid email or password';
          break;
        default:
          message = error.message || message;
      }

      return {
        code: error.code,
        message: message
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: message
    };
  }
}

export default new AuthService();