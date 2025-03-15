import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';
import { TIER_FEATURES, TIER_PRICING, SUBSCRIPTION_TIERS } from '../store/slices/subscriptionSlice';

const PricingPage = () => {
  const [annually, setAnnually] = useState(true);
  
  const tiers = [
    {
      name: 'Free',
      id: SUBSCRIPTION_TIERS.FREE,
      price: { monthly: 0, annually: 0 },
      description: 'Basic speech recognition for personal use',
      mostPopular: false,
      features: [
        `${TIER_FEATURES[SUBSCRIPTION_TIERS.FREE].transcriptionMinutes} minutes daily transcription limit`,
        'Real-time transcription with WebGPU acceleration',
        'Export to TXT',
        `${TIER_FEATURES[SUBSCRIPTION_TIERS.FREE].historyDays}-day transcript history`,
        `${TIER_FEATURES[SUBSCRIPTION_TIERS.FREE].maxAudioLength} seconds max audio length`,
        'Basic language support',
      ],
    },
    {
      name: 'Pro',
      id: SUBSCRIPTION_TIERS.PRO,
      price: { monthly: TIER_PRICING[SUBSCRIPTION_TIERS.PRO], annually: TIER_PRICING[SUBSCRIPTION_TIERS.PRO] * 10 },
      description: 'Perfect for professionals and small teams',
      mostPopular: true,
      features: [
        'Unlimited daily transcription',
        'Real-time transcription with WebGPU acceleration',
        'Export to TXT, DOCX, PDF, SRT',
        `${TIER_FEATURES[SUBSCRIPTION_TIERS.PRO].historyDays}-day transcript history`,
        `${TIER_FEATURES[SUBSCRIPTION_TIERS.PRO].maxAudioLength} seconds max audio length`,
        'Advanced language support',
        'Custom vocabulary',
        'AI summary and insights',
      ],
    },
    {
      name: 'Enterprise',
      id: SUBSCRIPTION_TIERS.ENTERPRISE,
      price: { monthly: TIER_PRICING[SUBSCRIPTION_TIERS.ENTERPRISE], annually: TIER_PRICING[SUBSCRIPTION_TIERS.ENTERPRISE] * 10 },
      description: 'For organizations with advanced needs',
      mostPopular: false,
      features: [
        'Unlimited daily transcription',
        'Real-time transcription with WebGPU acceleration',
        'Export to TXT, DOCX, PDF, SRT, VTT, CSV',
        `${TIER_FEATURES[SUBSCRIPTION_TIERS.ENTERPRISE].historyDays}-day transcript history`,
        `${TIER_FEATURES[SUBSCRIPTION_TIERS.ENTERPRISE].maxAudioLength} seconds max audio length`,
        'Complete language support',
        'Advanced custom vocabulary',
        'AI summary and insights',
        'Speaker diarization',
        'Priority support',
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Pricing</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Plans for every transcription need
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-300">
          Choose the perfect plan for your needs. All plans include our core speech recognition technology.
        </p>
        
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 bg-gray-100 dark:bg-gray-800">
            <button
              className={`cursor-pointer rounded-full px-2.5 py-1 ${annually ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
              onClick={() => setAnnually(true)}
            >
              <span className={annually ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>Annual</span>
              <span className={`${annually ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'} ml-1`}>
                (Save 16%)
              </span>
            </button>
            <button
              className={`cursor-pointer rounded-full px-2.5 py-1 ${!annually ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
              onClick={() => setAnnually(false)}
            >
              <span className={!annually ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>Monthly</span>
            </button>
          </div>
        </div>
        
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`ring-1 ${
                tier.mostPopular ? 'ring-blue-600 dark:ring-blue-500' : 'ring-gray-200 dark:ring-gray-700'
              } rounded-3xl p-8 xl:p-10 ${
                tier.mostPopular ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h2
                  id={tier.id}
                  className={`text-lg font-semibold leading-8 ${
                    tier.mostPopular ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {tier.name}
                </h2>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600 dark:text-blue-400">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">${annually ? tier.price.annually : tier.price.monthly}</span>
                {tier.price.monthly > 0 && (
                  <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">
                    {annually ? '/year' : '/month'}
                  </span>
                )}
              </p>
              <Link
                to={tier.id === SUBSCRIPTION_TIERS.FREE ? '/register' : '/register?plan=' + tier.id}
                aria-describedby={tier.id}
                className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.mostPopular
                    ? 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500'
                    : 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-200 dark:ring-blue-700 hover:ring-blue-300 dark:hover:ring-blue-600'
                }`}
              >
                {tier.price.monthly === 0 ? 'Get started for free' : 'Get started'}
              </Link>
              
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mx-auto max-w-7xl px-6 mt-24 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10 dark:divide-gray-100/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10 dark:divide-gray-100/10">
            <div className="pt-6">
              <dt className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                How does SpeechSync protect my privacy?
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                SpeechSync processes all audio transcription directly in your browser using WebGPU technology. 
                Your audio data never leaves your device, ensuring complete privacy. We only store 
                the text transcriptions which are encrypted in our database.
              </dd>
            </div>
            <div className="pt-6">
              <dt className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                Can I cancel my subscription at any time?
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                Yes, you can cancel your subscription at any time. If you cancel, your subscription will 
                remain active until the end of your current billing period, after which it will revert to 
                the Free plan.
              </dd>
            </div>
            <div className="pt-6">
              <dt className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                What browsers support SpeechSync?
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                SpeechSync requires WebGPU which is currently supported in Chrome 113+, Edge 113+, and other 
                Chromium-based browsers. Support for Firefox and Safari is coming soon. For the best experience, 
                we recommend using the latest version of Chrome.
              </dd>
            </div>
            <div className="pt-6">
              <dt className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                How accurate is the transcription?
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                SpeechSync uses state-of-the-art Whisper AI technology, which offers industry-leading accuracy. 
                However, accuracy can vary depending on audio quality, background noise, accents, and specialized 
                terminology. Pro and Enterprise plans include custom vocabulary features to improve accuracy for 
                specific use cases.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
