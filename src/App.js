import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('Customer');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, type })
    });
    const data = await res.json();
    setResponse(data.reply);
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#f8f8f8', minHeight: '100vh', padding: '2rem' }}>
      <img src="/quirk-logo.png" alt="Quirk Logo" style={{ width: '100px', marginBottom: '1rem' }} />
      <h1 style={{ color: '#25644A' }}>Hi Mr. Quirk, paste the email below.</h1>
      <select value={type} onChange={e => setType(e.target.value)} style={{ fontSize: '1.2rem', padding: '0.6rem', width: '100%', marginBottom: '1rem' }}>
        <option>Customer</option>
        <option>Employee</option>
        <option>Vendor/Rep</option>
        <option>Other</option>
      </select>
      <textarea
        rows={12}
        placeholder="Paste email here..."
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: '100%', fontSize: '1.1rem', padding: '1rem', marginBottom: '1rem' }}
      />
      <button onClick={generate} disabled={loading} style={{ padding: '1rem 2rem', backgroundColor: '#25644A', color: '#fff', border: 'none', fontSize: '1.1rem' }}>
        {loading ? 'Generating...' : 'Generate Response'}
      </button>
      {response && (
        <div style={{ background: '#fff', padding: '1rem', marginTop: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}>
          <div>{response}</div>
          <br />
          <strong>Dan Quirk</strong>
        </div>
      )}
      <p style={{ marginTop: '3rem', fontSize: '1.2rem', color: '#25644A', fontWeight: 'bold' }}>Powered by Quirk AI</p>
    </div>
  );
}

export default App;
