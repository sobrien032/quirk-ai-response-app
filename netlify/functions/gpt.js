const https = require('https');

exports.handler = async function(event, context) {
  try {
    const { input, type } = JSON.parse(event.body);

    const toneModifiers = {
      Customer: "Respond as Daniel J Quirk. Acknowledge the customer's concern in an empathetic tone. Let them know the appropriate person will follow up soon. Make it clear that you (Daniel J Quirk) are replying personally, but not the one who will handle the issue. Format clearly: start with the customer's name if given, paragraph body, end with a line break followed by 'Daniel J Quirk' alone.",
      Employee: "Respond as Daniel J Quirk with a short, clear, direct tone. Answer affirmatively when possible. Keep it brief, no fluff. Format: start with name if present, short response body, and 'Daniel J Quirk' at the bottom, on its own line.",
      "Vendor/Rep": "Reply as Daniel J Quirk in a professional, concise tone. Confirm next steps, acknowledge receipt. Format clearly with line breaks and end with 'Daniel J Quirk'.",
      Other: "Reply as Daniel J Quirk in a minimal, professional tone. If it's not your domain, indicate the correct person will follow up. Start with recipient's name if known, clean paragraph structure, and end with 'Daniel J Quirk' on its own line."
    };

    const instructions = toneModifiers[type] || toneModifiers["Other"];
    const prompt = `${instructions}\n\nEmail received:\n${input}\n\nWrite a well-structured response as Daniel J Quirk.`;

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
