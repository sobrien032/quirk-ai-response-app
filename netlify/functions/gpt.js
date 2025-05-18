const https = require('https');

exports.handler = async function(event, context) {
  try {
    const { input, type } = JSON.parse(event.body);
    const prompt = `You are Dan Quirk replying to a ${type}. Here's the email:\n\n${input}\n\nWrite a helpful and professional response.`;

    const data = JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    };

    const responseData = await new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            resolve(json);
          } catch (err) {
            reject(new Error('Failed to parse response: ' + body));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: responseData.choices?.[0]?.message?.content || 'No reply from AI.' })
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'Error: ' + err.message })
    };
  }
};
