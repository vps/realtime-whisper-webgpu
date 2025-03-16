import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { MoonIcon, SunIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { toggleDarkMode } from '../store/slices/uiSlice';

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Check if user is authenticated, if yes redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900">
      {/* Header */}
      <header className="relative z-10">
        {/* Desktop navigation */}
        <div className="bg-white dark:bg-neutral-800 shadow-sm backdrop-blur-sm bg-white/80 dark:bg-neutral-800/80 sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <img
                    className="h-10 w-auto"
                    src="/logo.png"
                    alt="SpeechSync"
                  />
                  <span className="ml-3 text-2xl font-semibold text-primary-600 dark:text-primary-400">
                    SpeechSync
                  </span>
                </Link>
              </div>

              {/* Desktop navigation links */}
              <nav className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link px-3 py-2 ${isActive(item.href) ? 'nav-link-active' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Right side actions */}
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => dispatch(toggleDarkMode())}
                  className="p-2 rounded-full text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <SunIcon className="h-6 w-6" />
                  ) : (
                    <MoonIcon className="h-6 w-6" />
                  )}
                </button>
                
                <Link
                  to="/login"
                  className="btn-secondary btn-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => dispatch(toggleDarkMode())}
                  className="p-2 mr-2 rounded-full text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <SunIcon className="h-6 w-6" />
                  ) : (
                    <MoonIcon className="h-6 w-6" />
                  )}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white focus:outline-none"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 z-40 bg-neutral-900/60 backdrop-blur-sm transition-opacity md:hidden ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          className={`fixed inset-y-0 right-0 z-40 w-full max-w-xs bg-white dark:bg-neutral-800 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between h-20 px-6">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="SpeechSync"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-2 px-4 pt-2 pb-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link block px-3 py-4 text-base ${isActive(item.href) ? 'nav-link-active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-700 space-y-4">
              <Link
                to="/login"
                className="nav-link block px-3 py-4 text-base"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary w-full justify-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-800 mt-auto border-t border-neutral-100 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/logo.png"
                  alt="SpeechSync"
                />
                <span className="ml-2 text-lg font-semibold text-primary-600 dark:text-primary-400">
                  SpeechSync
                </span>
              </Link>
              <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
                Accurate, real-time speech recognition powered by AI, right in your browser.
                Privacy-focused with no server uploads.
              </p>
            </div>
            
            {/* Links */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Product
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    to="/pricing"
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              &copy; {new Date().getFullYear()} SpeechSync. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="Twitter"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="GitHub"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
