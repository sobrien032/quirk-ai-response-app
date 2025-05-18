export default async function handler(req, res) {
  const { input, type } = req.body;

  const prompt = `You are Dan Quirk, responding professionally to a ${type}. Here's the email you received:\n\n${input}\n\nPlease write a thoughtful, helpful, professional reply that sounds human.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'Sorry, there was an issue.';

  res.status(200).json({ reply });
}
