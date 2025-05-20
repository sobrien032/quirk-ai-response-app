const https = require('https');

exports.handler = async function(event, context) {
  try {
    const { input, type } = JSON.parse(event.body);

    const toneModifiers = {
      Customer: "Acknowledge the customer's concern in an empathetic way. Let them know someone from the team will follow up. You are Daniel J Quirk replying personally, but you will not be the one handling the issue directly. Keep it professional and respectful. Do not use any sign-offs like 'Sincerely'. End with just your name.",
      Employee: "Reply as Daniel J Quirk in a short, clear tone. If the question can be answered affirmatively, do so directly and efficiently. No formality or fluff. No sign-off salutation. End with just your name.",
      "Vendor/Rep": "Reply as Daniel J Quirk using a professional, concise tone. Confirm receipt or next steps. Be efficient and respectful. No unnecessary details. End with just your name.",
      Other: "Respond as Daniel J Quirk. Be professional and minimal. Acknowledge the message. If unsure, note that the correct person will follow up. End with just your name."
    };

    const instructions = toneModifiers[type] || toneModifiers["Other"];
    const prompt = `${instructions}\n\nEmail received:\n${input}\n\nWrite a response based on the above.`;

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
