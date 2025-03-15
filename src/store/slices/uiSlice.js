import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  sidebarOpen: false,
  currentView: 'dashboard',
  alerts: [],
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    addAlert: (state, action) => {
      // action.payload = { id, type, message, timeout }
      state.alerts.push(action.payload);
    },
    removeAlert: (state, action) => {
      // action.payload = alert id
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

// Helper action to create and automatically remove alerts after a timeout
export const createAlert = ({ type, message, timeout = 5000 }) => (dispatch) => {
  const id = Date.now().toString();
  
  dispatch(addAlert({ id, type, message, timeout }));
  
  setTimeout(() => {
    dispatch(removeAlert(id));
  }, timeout);
  
  return id;
};

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarOpen,
  setCurrentView,
  addAlert,
  removeAlert,
  clearAlerts,
  setLoading
} = uiSlice.actions;

export default uiSlice.reducer;
