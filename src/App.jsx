import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { setUser } from './store/slices/authSlice';
import { getUserSubscription } from './store/slices/subscriptionSlice';
import { setDarkMode } from './store/slices/uiSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';

// Public Pages
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import TranscriptsPage from './pages/TranscriptsPage';
import TranscriptDetailPage from './pages/TranscriptDetailPage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';

function App() {
  const { darkMode } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          dispatch(
            setUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              subscription: userData.subscription || 'free',
              usageMinutes: userData.usageMinutes || 0,
            })
          );
          
          // Fetch user subscription details
          dispatch(getUserSubscription(user.uid));
        }
      } else {
        // User is signed out
        dispatch(setUser(null));
        
        // If on a protected route, redirect to login
        if (location.pathname.startsWith('/dashboard') || 
            location.pathname.startsWith('/transcripts') ||
            location.pathname.startsWith('/settings') ||
            location.pathname.startsWith('/subscription')) {
          navigate('/login');
        }
      }
    });
    
    return () => unsubscribe();
  }, [dispatch, navigate, location]);

  // Sync darkMode with localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initialize darkMode from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    dispatch(setDarkMode(savedDarkMode || (!localStorage.getItem('darkMode') && systemDarkMode)));
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transcripts" element={<TranscriptsPage />} />
        <Route path="/transcripts/:id" element={<TranscriptDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
