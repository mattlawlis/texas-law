const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}));

export default async function handler(req, res) {
    const { userId, message } = req.body;

    try {
        const response = await openai.createChatCompletion({
            model: process.env.OPENAI_ASSISTANT_ID,  // Use the Assistant ID
            messages: [{ role: "user", content: message }],
        });

        res.status(200).send({ response: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
