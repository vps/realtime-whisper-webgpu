import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, usingLocalStorageMode } from '../../firebase/config';
import { initializeUserDocument, updateUserLastLogin } from '../../firebase/dbInit';

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      console.log('Starting user registration process...');
      
      // Step 1: Create user authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User authentication created successfully');
      
      // Step 2: Update profile
      await updateProfile(userCredential.user, {
        displayName
      });
      console.log('User profile updated successfully');
      
      // Step 3: Create user document in Firestore using our utility function
      try {
        const userData = await initializeUserDocument(
          userCredential.user.uid,
          email,
          displayName
        );
        console.log('User document created in Firestore successfully');
        
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          subscription: userData.subscription,
          usageMinutes: userData.usageMinutes,
        };
      } catch (firestoreError) {
        console.error('Firestore document creation error:', firestoreError);
        // Still return the user since authentication was successful
        // but log the error for debugging
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          subscription: 'free',
          usageMinutes: 0,
        };
      }
    } catch (error) {
      console.error('Registration error:', error.code, error.message);
      return rejectWithValue(
        error.code === 'auth/email-already-in-use' 
          ? 'This email is already in use. Please use a different email or try logging in.'
          : error.code === 'auth/network-request-failed'
          ? 'Network error. Please check your internet connection.'
          : error.message || 'Registration failed. Please try again.'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login timestamp
      await updateUserLastLogin(userCredential.user.uid);
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      let userData;
      if (userDoc.exists()) {
        userData = userDoc.data();
      } else {
        // Initialize user document if it doesn't exist
        userData = await initializeUserDocument(
          userCredential.user.uid,
          email,
          userCredential.user.displayName
        );
      }
      
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || userData.displayName,
        subscription: userData.subscription,
        usageMinutes: userData.usageMinutes,
      };
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      return rejectWithValue(
        error.code === 'auth/user-not-found' 
        ? 'User not found. Please check your email or register for a new account.'
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password. Please try again.'
        : error.code === 'auth/network-request-failed'
        ? 'Network error. Please check your internet connection.'
        : error.message || 'Login failed. Please try again.'
      );
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      // In local storage mode, we can't actually use Google login
      // Let's create a mock user instead
      if (usingLocalStorageMode) {
        console.log("Using mock Google login for local storage mode");
        const mockGoogleUser = {
          uid: 'google_user_' + Date.now(),
          email: 'google_user@example.com',
          displayName: 'Google User',
          subscription: 'free',
          usageMinutes: 0
        };
        
        // Initialize the user document
        await initializeUserDocument(
          mockGoogleUser.uid,
          mockGoogleUser.email,
          mockGoogleUser.displayName
        );
        
        return mockGoogleUser;
      }
      
      // Regular Firebase Google auth
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      try {
        // Update last login timestamp
        await updateUserLastLogin(userCredential.user.uid);
        
        // Get or create user document
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        let userData;
        
        if (userDoc.exists()) {
          userData = userDoc.data();
        } else {
          // Initialize user document if it doesn't exist
          userData = await initializeUserDocument(
            userCredential.user.uid,
            userCredential.user.email,
            userCredential.user.displayName
          );
        }
        
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || userData.displayName,
          subscription: userData.subscription,
          usageMinutes: userData.usageMinutes,
        };
      } catch (dbError) {
        console.error('Error with user document:', dbError);
        // Return basic user info if database operations fail
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          subscription: 'free',
          usageMinutes: 0,
        };
      }
    } catch (error) {
      console.error('Google login error:', error.code, error.message);
      return rejectWithValue(
        error.code === 'auth/popup-closed-by-user'
        ? 'Login was canceled. Please try again.'
        : error.code === 'auth/network-request-failed'
        ? 'Network error. Please check your internet connection.'
        : error.message || 'Google login failed. Please try again.'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Google Login
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;
