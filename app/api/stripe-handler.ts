import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, action } = req.body;

  try {
    if (action === 'view') {
      // Fetch subscription data
      const customer = await stripe.customers.retrieve(userId);
      res.status(200).json({ subscription: customer });
    } else if (action === 'cancel') {
      // Cancel subscription logic
      const deleted = await stripe.subscriptions.del(userId);
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Stripe operation failed' });
  }
}
