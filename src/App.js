import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('Customer');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    const res = await fetch('/.netlify/functions/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, type })
    });
    const data = await res.json();
    setResponse(data.reply);
    setLoading(false);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <img src='/quirk-logo.png' alt='Quirk Logo' style={{ width: '100px', marginBottom: '1rem' }} />
      <h1 style={{ color: '#25644A' }}>Hi Mr. Quirk, paste the email below.</h1>
      <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '0.75rem', fontSize: '1.1rem', width: '100%' }}>
        <option>Customer</option>
        <option>Employee</option>
        <option>Vendor/Rep</option>
        <option>Other</option>
      </select>
      <textarea
        rows={10}
        placeholder='Paste email here...'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}
      />
      <button onClick={generate} disabled={loading}
        style={{ marginTop: '1rem', padding: '1rem 2rem', backgroundColor: '#25644A', color: '#fff', fontSize: '1.1rem', border: 'none' }}>
        {loading ? 'Generating...' : 'Generate Response'}
      </button>
      {response && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', backgroundColor: '#f4f4f4' }}>
          <p>{response}</p>
          <button onClick={copyToClipboard} style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}>
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      )}
      <footer style={{ marginTop: '4rem', textAlign: 'center', color: '#25644A', fontWeight: 'bold', fontSize: '1.2rem' }}>
        Powered by Quirk AI
      </footer>
    </div>
  );
}

export default App;
