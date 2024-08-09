const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { userId, action } = req.body;

  try {
    // Get the customer's Stripe ID (this assumes you store it in your database)
    const customerId = await getCustomerId(userId);

    if (action === 'cancel') {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        await stripe.subscriptions.del(subscriptions.data[0].id);
        return res.status(200).send({ success: true, message: 'Subscription canceled' });
      }
    } else if (action === 'view') {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        return res.status(200).send({ subscription: subscriptions.data[0] });
      } else {
        return res.status(404).send({ error: 'No active subscription found' });
      }
    }

    res.status(400).send({ error: 'Invalid action' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getCustomerId(userId) {
  // Implement your logic to fetch the Stripe customer ID based on the user ID
  // For example, from your database
  return 'customer-id-from-db';
}
