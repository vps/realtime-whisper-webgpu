import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-blue-800 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 flex flex-col lg:flex-row items-center">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Real-time speech recognition, in your browser
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Powered by Whisper AI technology, SpeechSync brings you fast and accurate speech-to-text conversions with no server uploads. Your data stays private on your device.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get started for free
              </Link>
              <Link to="/pricing" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                View pricing <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-1 lg:ml-10">
            <div className="aspect-[6/5] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-xl">
              <img
                src="/banner.png"
                alt="App interface"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-200 to-blue-800 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need for speech recognition
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Advanced features designed for individuals and teams who need reliable transcription
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            <div className="relative pl-16">
              <div className="absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900 dark:text-white">Real-time Processing</h3>
              <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                Get instant transcriptions as you speak with our powerful WebGPU-accelerated model.
              </p>
            </div>
            
            <div className="relative pl-16">
              <div className="absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900 dark:text-white">Privacy-First Design</h3>
              <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                All processing happens on your device - your audio never leaves your computer.
              </p>
            </div>
            
            <div className="relative pl-16">
              <div className="absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900 dark:text-white">Save & Organize</h3>
              <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                Store your transcriptions and organize them for easy reference and sharing.
              </p>
            </div>
            
            <div className="relative pl-16">
              <div className="absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900 dark:text-white">Multiple Languages</h3>
              <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                Support for dozens of languages with reliable accuracy across various accents.
              </p>
            </div>
            
            <div className="relative pl-16">
              <div className="absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900 dark:text-white">Export Options</h3>
              <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                Export your transcriptions in various formats including TXT, DOCX, PDF, and SRT.
              </p>
            </div>
            
            <div className="relative pl-16">
              <div className="absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900 dark:text-white">Custom Vocabulary</h3>
              <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                Add industry-specific terms and jargon to improve accuracy for your specific needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial section */}
      <div className="relative isolate mt-32 sm:mt-40 sm:pt-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Trusted by professionals worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                See what our users are saying about SpeechSync
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:grid-cols-3">
              <figure className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/5">
                <blockquote className="text-gray-700 dark:text-gray-300">
                  <p>"SpeechSync has revolutionized how I take notes during client meetings. The real-time transcription is incredibly accurate, and I love that everything stays on my device."</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <div className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</div>
                  <div className="text-gray-600 dark:text-gray-400">Product Manager</div>
                </figcaption>
              </figure>
              <figure className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/5">
                <blockquote className="text-gray-700 dark:text-gray-300">
                  <p>"As a journalist, I need reliable transcription tools. SpeechSync provides the accuracy I need with the privacy my sources expect. The export options make my workflow seamless."</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <div className="font-semibold text-gray-900 dark:text-white">Michael Chen</div>
                  <div className="text-gray-600 dark:text-gray-400">Investigative Reporter</div>
                </figcaption>
              </figure>
              <figure className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/5">
                <blockquote className="text-gray-700 dark:text-gray-300">
                  <p>"Our research team uses SpeechSync for transcribing interviews in multiple languages. The custom vocabulary feature has been game-changing for our technical discussions."</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <div className="font-semibold text-gray-900 dark:text-white">Elena Rodriguez</div>
                  <div className="text-gray-600 dark:text-gray-400">Research Director</div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="mx-auto mt-32 max-w-7xl sm:mt-40 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-blue-600 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start transcribing today
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-blue-100">
            Join thousands of professionals who trust SpeechSync for their speech-to-text needs.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              to="/register"
              className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started for free
            </Link>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.3" />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#fff" />
                <stop offset="1" stopColor="#38bdf8" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
