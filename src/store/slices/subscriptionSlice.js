import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Define subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
};

// Define usage limits per tier (in minutes per day)
export const USAGE_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: 10,
  [SUBSCRIPTION_TIERS.PRO]: Infinity,
  [SUBSCRIPTION_TIERS.ENTERPRISE]: Infinity
};

// Define features per tier
export const TIER_FEATURES = {
  [SUBSCRIPTION_TIERS.FREE]: {
    transcriptionMinutes: 10,
    exportFormats: ['txt'],
    historyDays: 7,
    maxAudioLength: 30, // seconds
    aiFeatures: false,
    customVocabulary: false,
    priority: false
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    transcriptionMinutes: Infinity,
    exportFormats: ['txt', 'docx', 'pdf', 'srt'],
    historyDays: 30,
    maxAudioLength: 120, // seconds
    aiFeatures: true,
    customVocabulary: true,
    priority: false
  },
  [SUBSCRIPTION_TIERS.ENTERPRISE]: {
    transcriptionMinutes: Infinity,
    exportFormats: ['txt', 'docx', 'pdf', 'srt', 'vtt', 'csv'],
    historyDays: 365,
    maxAudioLength: 300, // seconds
    aiFeatures: true,
    customVocabulary: true,
    priority: true
  }
};

// Pricing in USD
export const TIER_PRICING = {
  [SUBSCRIPTION_TIERS.FREE]: 0,
  [SUBSCRIPTION_TIERS.PRO]: 9.99,
  [SUBSCRIPTION_TIERS.ENTERPRISE]: 29.99
};

// Async thunks
export const getUserSubscription = createAsyncThunk(
  'subscription/getUserSubscription',
  async (userId, { rejectWithValue }) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      return {
        tier: userData.subscription || SUBSCRIPTION_TIERS.FREE,
        usageMinutes: userData.usageMinutes || 0,
        subscriptionStartDate: userData.subscriptionStartDate || null,
        subscriptionEndDate: userData.subscriptionEndDate || null
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSubscription = createAsyncThunk(
  'subscription/updateSubscription',
  async ({ userId, tier }, { rejectWithValue }) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      
      // Calculate subscription period (one month from now)
      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);
      
      await updateDoc(userDocRef, {
        subscription: tier,
        subscriptionStartDate: now.toISOString(),
        subscriptionEndDate: endDate.toISOString()
      });
      
      return {
        tier,
        subscriptionStartDate: now.toISOString(),
        subscriptionEndDate: endDate.toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUsageMinutes = createAsyncThunk(
  'subscription/updateUsageMinutes',
  async ({ userId, minutes }, { rejectWithValue }) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      const currentUsage = userData.usageMinutes || 0;
      const newUsage = currentUsage + minutes;
      
      await updateDoc(userDocRef, {
        usageMinutes: newUsage
      });
      
      return newUsage;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetDailyUsage = createAsyncThunk(
  'subscription/resetDailyUsage',
  async (userId, { rejectWithValue }) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      
      await updateDoc(userDocRef, {
        usageMinutes: 0,
        lastResetDate: new Date().toISOString()
      });
      
      return 0; // New usage amount
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  tier: SUBSCRIPTION_TIERS.FREE,
  usageMinutes: 0,
  subscriptionStartDate: null,
  subscriptionEndDate: null,
  isLoading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get user subscription
      .addCase(getUserSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tier = action.payload.tier;
        state.usageMinutes = action.payload.usageMinutes;
        state.subscriptionStartDate = action.payload.subscriptionStartDate;
        state.subscriptionEndDate = action.payload.subscriptionEndDate;
      })
      .addCase(getUserSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update subscription
      .addCase(updateSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tier = action.payload.tier;
        state.subscriptionStartDate = action.payload.subscriptionStartDate;
        state.subscriptionEndDate = action.payload.subscriptionEndDate;
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update usage minutes
      .addCase(updateUsageMinutes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUsageMinutes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.usageMinutes = action.payload;
      })
      .addCase(updateUsageMinutes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Reset daily usage
      .addCase(resetDailyUsage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetDailyUsage.fulfilled, (state) => {
        state.isLoading = false;
        state.usageMinutes = 0;
      })
      .addCase(resetDailyUsage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSubscriptionError } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
