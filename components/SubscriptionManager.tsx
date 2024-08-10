"use client"; // Add this directive at the top

import React, { useState } from 'react';

const SubscriptionManager = () => {
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState('');

  const handleViewSubscription = async () => {
    const response = await fetch('/api/manage-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'view', userId: 'your-user-id' }),
    });

    const data = await response.json();
    if (data.subscription) {
      setSubscription(data.subscription);
    } else {
      setError(data.error || 'Failed to fetch subscription');
    }
  };

  const handleCancelSubscription = async () => {
    const response = await fetch('/api/manage-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'cancel', userId: 'your-user-id' }),
    });

    const data = await response.json();
    if (data.success) {
      setSubscription(null);
    } else {
      setError(data.error || 'Failed to cancel subscription');
    }
  };

  return (
    <div>
      <button onClick={handleViewSubscription}>View Subscription</button>
      {subscription && (
        <div>
          <h3>Your Subscription</h3>
          <p>Status: {subscription.status}</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default SubscriptionManager;

