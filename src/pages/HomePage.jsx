import { Link } from 'react-router-dom';

const features = [
  {
    name: 'Real-time Processing',
    description: 'Get instant transcriptions as you speak with our powerful WebGPU-accelerated model.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    )
  },
  {
    name: 'Privacy-First Design',
    description: 'All processing happens on your device - your audio never leaves your computer.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    )
  },
  {
    name: 'Multiple Languages',
    description: 'Support for dozens of languages with reliable accuracy across various accents.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    )
  }
];

const testimonials = [
  {
    quote: "SpeechSync has revolutionized how I take notes during client meetings. The real-time transcription is incredibly accurate, and I love that everything stays on my device.",
    author: "Sarah Johnson",
    role: "Product Manager"
  },
  {
    quote: "As a journalist, I need reliable transcription tools. SpeechSync provides the accuracy I need with the privacy my sources expect. The export options make my workflow seamless.",
    author: "Michael Chen",
    role: "Investigative Reporter"
  },
  {
    quote: "Our research team uses SpeechSync for transcribing interviews in multiple languages. The custom vocabulary feature has been game-changing for our technical discussions.",
    author: "Elena Rodriguez",
    role: "Research Director"
  }
];

const HomePage = () => {
  return (
    <div className="bg-white dark:bg-neutral-900">
      {/* Hero section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-primary-800 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
            <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-200 to-primary-800 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 sm:pt-32 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-5xl lg:text-6xl">
                <span className="block mb-2 text-primary-600 dark:text-primary-400">Real-time</span>
                <span className="block">Speech Recognition,</span>
                <span className="block">In Your Browser</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300 text-balance">
                Powered by Whisper AI, SpeechSync brings you fast and accurate speech-to-text right in your browser — with no server uploads. Your data stays private on your device.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Get started for free
                </Link>
                <Link 
                  to="/pricing" 
                  className="btn-secondary"
                >
                  View pricing
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full max-w-xl">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-800 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <img
                  src="/banner.png"
                  alt="SpeechSync interface"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature section */}
      <section className="py-24 sm:py-32 bg-neutral-50 dark:bg-neutral-800/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-2xl font-bold leading-tight text-primary-600 dark:text-primary-400">
              Powerful Features
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Everything you need for speech recognition
            </p>
            <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300 text-balance">
              Advanced capabilities designed for professionals who need reliable transcription
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="card card-hover p-8 flex flex-col items-start">
                  <div className="mb-5 h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Trusted by professionals worldwide
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
              See what our users are saying about SpeechSync
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <blockquote className="mb-6 text-neutral-700 dark:text-neutral-300">
                  <p className="text-balance">{testimonial.quote}</p>
                </blockquote>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-neutral-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gradient-primary px-6 py-24 shadow-2xl rounded-3xl sm:px-16 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Start transcribing today
              </h2>
              <p className="mt-6 text-lg leading-8 text-primary-100">
                Join thousands of professionals who trust SpeechSync for their speech-to-text needs.
              </p>
              <div className="mt-10">
                <Link
                  to="/register"
                  className="btn-lg rounded-xl bg-white px-6 py-3 text-primary-600 shadow-sm hover:bg-primary-50 hover:shadow-lg"
                >
                  Get started for free
                </Link>
              </div>
            </div>
            
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.25" />
              <defs>
                <radialGradient id="gradient">
                  <stop stopColor="#fff" />
                  <stop offset="1" stopColor="#38bdf8" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
