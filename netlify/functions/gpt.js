const https = require('https');

exports.handler = async function(event, context) {
  try {
    const { input, type } = JSON.parse(event.body);
    const prompt = `You are Daniel J Quirk replying professionally to a ${type}.\n\nEmail:\n${input}\n\nWrite a helpful and professional response.`;

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
          console.log('Raw OpenAI response:', body);
          try {
            const json = JSON.parse(body);
            resolve(json);
          } catch (err) {
            reject(new Error('Failed to parse OpenAI response: ' + body));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });

    const aiReply = responseData.choices?.[0]?.message?.content;
    const finalReply = aiReply ? `${aiReply}\n\nDaniel J Quirk` : 'No reply from AI.';

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: finalReply })
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'Error: ' + err.message })
    };
  }
};
