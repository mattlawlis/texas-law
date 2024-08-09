const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
    const { email, paymentMethodId } = req.body;

    try {
        const customer = await stripe.customers.create({
            email,
            payment_method: paymentMethodId,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: process.env.STRIPE_PRICE_ID }],
            expand: ['latest_invoice.payment_intent'],
        });

        res.status(200).send(subscription);
    } catch (error) {
        res.status(400).send({ error: { message: error.message } });
    }
};
