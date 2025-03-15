import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSubscription } from '../store/slices/subscriptionSlice';
import { CheckIcon } from '@heroicons/react/24/outline';
import { TIER_FEATURES, TIER_PRICING, SUBSCRIPTION_TIERS } from '../store/slices/subscriptionSlice';

const SubscriptionPage = () => {
  const [annually, setAnnually] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const { user } = useSelector((state) => state.auth);
  const { tier, subscriptionStartDate, subscriptionEndDate, usageMinutes } = useSelector((state) => state.subscription);
  const dispatch = useDispatch();

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleSelectPlan = (planId) => {
    // If selecting current plan, do nothing
    if (planId === tier) return;
    
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handleConfirmSubscription = () => {
    // In a real app, this would integrate with a payment processor like Stripe
    // For this demo, we'll just update the subscription in the database
    if (selectedPlan && user) {
      dispatch(updateSubscription({ userId: user.uid, tier: selectedPlan }));
    }
    setShowPaymentModal(false);
  };

  const tiers = [
    {
      name: 'Free',
      id: SUBSCRIPTION_TIERS.FREE,
      price: { monthly: 0, annually: 0 },
      description: 'Basic speech recognition for personal use',
      current: tier === SUBSCRIPTION_TIERS.FREE,
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
      current: tier === SUBSCRIPTION_TIERS.PRO,
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
      current: tier === SUBSCRIPTION_TIERS.ENTERPRISE,
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

  // Calculate usage percentage for free tier
  const usageLimit = TIER_FEATURES[SUBSCRIPTION_TIERS.FREE]?.transcriptionMinutes || 10; // minutes
  const usagePercentage = Math.min((usageMinutes / usageLimit) * 100, 100);

  return (
    <div className="flex flex-col h-full mx-auto text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscription</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your subscription and billing details
        </p>
      </div>
      
      {/* Current plan summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{tiers.find(t => t.id === tier)?.name || 'Free'}</span>
              {tier !== SUBSCRIPTION_TIERS.FREE && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
              )}
            </div>
            {tier !== SUBSCRIPTION_TIERS.FREE && (
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                <p>Started: {formatDate(subscriptionStartDate)}</p>
                <p>Renews: {formatDate(subscriptionEndDate)}</p>
              </div>
            )}
          </div>
          
          {tier === SUBSCRIPTION_TIERS.FREE && (
            <div className="mt-4 md:mt-0 w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Usage</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(usageMinutes * 10) / 10} / {usageLimit} minutes
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${usagePercentage === 100 ? 'bg-red-600' : 'bg-blue-600'}`} 
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Plan selector */}
      <div className="flex-1 overflow-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
          
          <div className="mb-6 flex justify-center">
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tierOption) => (
              <div
                key={tierOption.id}
                className={`border rounded-lg overflow-hidden ${
                  tierOption.current ? 'border-blue-600 dark:border-blue-500 ring-1 ring-blue-600 dark:ring-blue-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{tierOption.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tierOption.description}</p>
                  
                  <p className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${annually ? tierOption.price.annually : tierOption.price.monthly}
                    </span>
                    {tierOption.price.monthly > 0 && (
                      <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {annually ? '/year' : '/month'}
                      </span>
                    )}
                  </p>
                  
                  <button
                    onClick={() => handleSelectPlan(tierOption.id)}
                    disabled={tierOption.current}
                    className={`mt-6 w-full flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      tierOption.current
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-600 dark:border-blue-500 cursor-not-allowed'
                        : 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 border-transparent'
                    }`}
                  >
                    {tierOption.current ? 'Current Plan' : 'Select Plan'}
                  </button>
                  
                  <ul className="mt-6 space-y-4">
                    {tierOption.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500 dark:text-green-400" aria-hidden="true" />
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Payment modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Upgrade to {tiers.find(t => t.id === selectedPlan)?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {annually ? 'Annual' : 'Monthly'} subscription: 
              <span className="ml-1 font-medium text-gray-900 dark:text-white">
                ${annually 
                  ? tiers.find(t => t.id === selectedPlan)?.price.annually 
                  : tiers.find(t => t.id === selectedPlan)?.price.monthly
                }/{annually ? 'year' : 'month'}
              </span>
            </p>
            
            {/* Payment form - in a real app this would have actual payment fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Card Number
                </label>
                <input 
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expiration Date
                  </label>
                  <input 
                    type="text"
                    placeholder="MM/YY"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CVC
                  </label>
                  <input 
                    type="text"
                    placeholder="123"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubscription}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Confirm Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
