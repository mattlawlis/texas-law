const { Configuration, OpenAIApi } = require('openai');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}));

async function hasActiveSubscription(userId) {
    // Fetch the customer ID linked to the user
    const customerId = await getCustomerId(userId);
    if (!customerId) return false;

    // Check if the user has an active subscription
    const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
    });

    return subscriptions.data.length > 0;
}

export default async function handler(req, res) {
    const { userId, message } = req.body;

    try {
        // Check if the user has an active subscription
        const isSubscribed = await hasActiveSubscription(userId);
        if (!isSubscribed) {
            return res.status(403).json({ error: 'Subscription required' });
        }

        const response = await openai.createChatCompletion({
            model: process.env.OPENAI_ASSISTANT_ID,
            messages: [{ role: "user", content: message }],
        });

        res.status(200).send({ response: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getCustomerId(userId) {
    // Implement your logic to fetch the Stripe customer ID based on the user ID
    // This might involve fetching data from your database
    return 'customer-id-from-db';
}
