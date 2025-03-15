import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Async thunks
export const saveTranscript = createAsyncThunk(
  'transcript/save',
  async ({ userId, text, language, audioLength }, { rejectWithValue }) => {
    try {
      const timestamp = new Date().toISOString();
      
      const docRef = await addDoc(collection(db, 'transcripts'), {
        userId,
        text,
        language,
        audioLength,
        timestamp,
        isEdited: false
      });
      
      return {
        id: docRef.id,
        userId,
        text,
        language,
        audioLength,
        timestamp,
        isEdited: false
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserTranscripts = createAsyncThunk(
  'transcript/getUserTranscripts',
  async (userId, { rejectWithValue }) => {
    try {
      const q = query(collection(db, 'transcripts'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const transcripts = [];
      querySnapshot.forEach((doc) => {
        transcripts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by timestamp (newest first)
      transcripts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return transcripts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTranscript = createAsyncThunk(
  'transcript/update',
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const transcriptRef = doc(db, 'transcripts', id);
      
      await updateDoc(transcriptRef, {
        text,
        isEdited: true,
        lastEditedAt: new Date().toISOString()
      });
      
      return { id, text, isEdited: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTranscript = createAsyncThunk(
  'transcript/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'transcripts', id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  transcripts: [],
  currentTranscript: null,
  isLoading: false,
  error: null,
};

const transcriptSlice = createSlice({
  name: 'transcript',
  initialState,
  reducers: {
    setCurrentTranscript: (state, action) => {
      state.currentTranscript = action.payload;
    },
    clearCurrentTranscript: (state) => {
      state.currentTranscript = null;
    },
    clearTranscripts: (state) => {
      state.transcripts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Save transcript
      .addCase(saveTranscript.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveTranscript.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transcripts.unshift(action.payload); // Add to beginning of array
        state.currentTranscript = action.payload;
      })
      .addCase(saveTranscript.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get user transcripts
      .addCase(getUserTranscripts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserTranscripts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transcripts = action.payload;
      })
      .addCase(getUserTranscripts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update transcript
      .addCase(updateTranscript.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTranscript.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update the transcript in the array
        const index = state.transcripts.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transcripts[index] = {
            ...state.transcripts[index],
            text: action.payload.text,
            isEdited: true
          };
        }
        
        // Update current transcript if it's the one being edited
        if (state.currentTranscript && state.currentTranscript.id === action.payload.id) {
          state.currentTranscript = {
            ...state.currentTranscript,
            text: action.payload.text,
            isEdited: true
          };
        }
      })
      .addCase(updateTranscript.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete transcript
      .addCase(deleteTranscript.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTranscript.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transcripts = state.transcripts.filter(t => t.id !== action.payload);
        
        // Clear current transcript if it's the one being deleted
        if (state.currentTranscript && state.currentTranscript.id === action.payload) {
          state.currentTranscript = null;
        }
      })
      .addCase(deleteTranscript.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentTranscript, clearCurrentTranscript, clearTranscripts } = transcriptSlice.actions;

export default transcriptSlice.reducer;
