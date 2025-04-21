import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, usingLocalStorageMode, localDB, saveLocalDB } from './config';

/**
 * Initialize user document in Firestore after registration
 * @param {string} uid - User ID
 * @param {string} email - User email
 * @param {string} displayName - User display name
 */
export const initializeUserDocument = async (uid, email, displayName) => {
  try {
    // Check if using local storage mode
    if (usingLocalStorageMode) {
      console.log('Using local storage mode for user initialization');
      
      // Check if user already exists in local storage
      if (localDB.users[uid]) {
        console.log('User document already exists in local storage');
        return localDB.users[uid];
      }
      
      // Create new user in local storage
      const userData = {
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        createdAt: new Date().toISOString(),
        subscription: 'free',
        usageMinutes: 0,
        settings: {
          darkMode: true,
          notifications: true
        },
        lastLogin: new Date().toISOString()
      };
      
      localDB.users[uid] = userData;
      saveLocalDB();
      
      console.log('User document created in local storage');
      return userData;
    }
    
    // Regular Firestore path
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    // Only create the user document if it doesn't exist
    if (!userSnap.exists()) {
      const userData = {
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        createdAt: new Date().toISOString(),
        subscription: 'free', // Default subscription level
        usageMinutes: 0,
        settings: {
          darkMode: true,
          notifications: true
        },
        lastLogin: new Date().toISOString()
      };
      
      await setDoc(userRef, userData);
      console.log('User document created successfully');
      return userData;
    } else {
      console.log('User document already exists');
      return userSnap.data();
    }
  } catch (error) {
    console.error('Error initializing user document:', error);
    throw error;
  }
};

/**
 * Update user's last login timestamp
 * @param {string} uid - User ID
 */
export const updateUserLastLogin = async (uid) => {
  try {
    // Check if using local storage mode
    if (usingLocalStorageMode) {
      console.log('Using local storage mode for updating last login');
      
      if (localDB.users[uid]) {
        localDB.users[uid].lastLogin = new Date().toISOString();
        saveLocalDB();
        console.log('User last login updated in local storage');
      }
      return;
    }
    
    // Regular Firestore path
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      lastLogin: new Date().toISOString()
    }, { merge: true });
    console.log('User last login updated successfully');
  } catch (error) {
    console.error('Error updating user last login:', error);
  }
};

/**
 * Create a new transcript record
 * @param {string} uid - User ID
 * @param {Object} transcriptData - Transcript data
 */
export const createTranscript = async (uid, transcriptData) => {
  try {
    // Check if using local storage mode
    if (usingLocalStorageMode) {
      console.log('Using local storage mode for creating transcript');
      
      // Initialize transcripts collection for this user if it doesn't exist
      if (!localDB.transcripts[uid]) {
        localDB.transcripts[uid] = {};
      }
      
      // Generate a unique ID
      const transcriptId = 'local_transcript_' + Date.now();
      
      const transcript = {
        id: transcriptId,
        title: transcriptData.title || 'Untitled Transcript',
        content: transcriptData.content || '',
        audioUrl: transcriptData.audioUrl || null,
        duration: transcriptData.duration || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to local storage
      localDB.transcripts[uid][transcriptId] = transcript;
      saveLocalDB();
      
      console.log('Transcript created in local storage');
      return transcript;
    }
    
    // Regular Firestore path
    const transcriptsCollectionRef = collection(db, 'users', uid, 'transcripts');
    const newTranscriptRef = doc(transcriptsCollectionRef);
    
    const transcript = {
      id: newTranscriptRef.id,
      title: transcriptData.title || 'Untitled Transcript',
      content: transcriptData.content || '',
      audioUrl: transcriptData.audioUrl || null,
      duration: transcriptData.duration || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(newTranscriptRef, transcript);
    console.log('Transcript created successfully');
    return transcript;
  } catch (error) {
    console.error('Error creating transcript:', error);
    throw error;
  }
}; 