import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  HomeIcon,
  DocumentTextIcon,
  CogIcon,
  CreditCardIcon,
  ArrowLeftOnRectangleIcon,
  MoonIcon, 
  SunIcon
} from '@heroicons/react/24/outline';
import { toggleDarkMode } from '../store/slices/uiSlice';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);
  const { tier } = useSelector((state) => state.subscription);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated, if not redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Transcripts', href: '/transcripts', icon: DocumentTextIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
    { name: 'Subscription', href: '/subscription', icon: CreditCardIcon },
  ];

  // Function to check if a nav item is current/active
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path === '/transcripts' && location.pathname.startsWith('/transcripts')) return true;
    if (path === '/settings' && location.pathname === '/settings') return true;
    if (path === '/subscription' && location.pathname === '/subscription') return true;
    return false;
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-neutral-900">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-neutral-900/60 backdrop-blur-sm transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile sidebar panel */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-full max-w-xs bg-white dark:bg-neutral-800 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Close button */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="ml-1 flex items-center justify-center w-10 h-10 rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center px-6 py-8">
            <img src="/logo.png" className="h-10 w-auto" alt="SpeechSync" />
            <h1 className="ml-3 text-2xl font-semibold text-primary-600 dark:text-primary-400">
              SpeechSync
            </h1>
          </div>

          {/* User info */}
          <div className="border-t border-neutral-100 dark:border-neutral-700 pt-6 mt-1 mb-6 px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white">
                  <UserCircleIcon className="h-8 w-8" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-neutral-900 dark:text-neutral-100">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`nav-link flex items-center py-3 px-4 ${active ? 'nav-link-active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSidebarOpen(false);
                    navigate(item.href);
                  }}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 ${
                      active
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-neutral-400 dark:text-neutral-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Footer actions */}
          <div className="border-t border-neutral-100 dark:border-neutral-700 p-4 space-y-2">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="w-full nav-link flex items-center py-3 px-4"
            >
              {darkMode ? (
                <SunIcon className="mr-4 h-6 w-6 text-neutral-400 dark:text-neutral-500" />
              ) : (
                <MoonIcon className="mr-4 h-6 w-6 text-neutral-400 dark:text-neutral-500" />
              )}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full nav-link flex items-center py-3 px-4 text-red-600 dark:text-red-400"
            >
              <ArrowLeftOnRectangleIcon className="mr-4 h-6 w-6" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-neutral-800 border-r border-neutral-100 dark:border-neutral-700">
          {/* Logo */}
          <div className="flex items-center h-24 flex-shrink-0 px-6">
            <img src="/logo.png" className="h-10 w-auto" alt="SpeechSync" />
            <h1 className="ml-3 text-2xl font-semibold text-primary-600 dark:text-primary-400">
              SpeechSync
            </h1>
          </div>

          {/* User info */}
          <div className="border-t border-neutral-100 dark:border-neutral-700 pt-6 mt-1 mb-6 px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white">
                  <UserCircleIcon className="h-8 w-8" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-neutral-900 dark:text-neutral-100">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 flex flex-col justify-between">
            <nav className="px-4 pb-4 space-y-1.5 overflow-y-auto">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`nav-link flex items-center py-3 px-4 ${active ? 'nav-link-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.href);
                    }}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 ${
                        active
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-neutral-400 dark:text-neutral-500'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </nav>
            
            {/* Footer actions */}
            <div className="border-t border-neutral-100 dark:border-neutral-700 p-4 space-y-2">
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="w-full nav-link flex items-center py-3 px-4"
              >
                {darkMode ? (
                  <SunIcon className="mr-4 h-6 w-6 text-neutral-400 dark:text-neutral-500" />
                ) : (
                  <MoonIcon className="mr-4 h-6 w-6 text-neutral-400 dark:text-neutral-500" />
                )}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full nav-link flex items-center py-3 px-4 text-red-600 dark:text-red-400"
              >
                <ArrowLeftOnRectangleIcon className="mr-4 h-6 w-6" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-72">
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-10 md:hidden bg-white dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <img src="/logo.png" className="h-8 w-auto ml-3" alt="SpeechSync" />
            </div>
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-8 px-4 max-w-7xl mx-auto sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
