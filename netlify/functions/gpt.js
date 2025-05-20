const https = require('https');

exports.handler = async function(event, context) {
  try {
    const { input, type } = JSON.parse(event.body);

    const toneModifiers = {
      Customer: "Respond as Daniel J Quirk using first-person ('I', 'me'). Acknowledge the concern in a personal and respectful tone. Let them know the appropriate person will follow up. Make it clear you're replying personally, but won't be the one handling it. No signature — handled automatically.",
      Employee: "Respond as Daniel J Quirk in a short, clear tone. Affirm when possible. Keep it minimal. No signature.",
      'Vendor/Rep': "Reply as Daniel J Quirk professionally. Confirm receipt and next steps. Concise. No signature.",
      Other: "Reply as Daniel J Quirk. Be brief and professional. Acknowledge the message. Clarify if someone else will follow up. No signature."
    };

    const instructions = toneModifiers[type] || toneModifiers["Other"];
    const prompt = `${instructions}\n\nEmail received:\n${input}\n\nWrite a structured, clear reply as described.`;

    const data = JSON.stringify({
      model: 'gpt-3.5-turbo',
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
    const finalReply = aiReply || 'No reply from AI.';

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
