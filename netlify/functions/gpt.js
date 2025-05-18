const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { input, type } = JSON.parse(event.body);
  const prompt = `You are Dan Quirk responding professionally to a ${type}.\n\nEmail:\n${input}\n\nWrite a helpful and professional reply.`;

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
  return {
    statusCode: 200,
    body: JSON.stringify({ reply: data.choices?.[0]?.message?.content || 'Something went wrong.' })
  };
};
