import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('Customer');
  const [response, setResponse] = useState('');

  const generate = () => {
    setResponse(`Hi, this is Dan Quirk responding to a ${type}. Here's your AI response...`);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Hi Mr. Quirk, paste the email below.</h1>
      <select value={type} onChange={e => setType(e.target.value)}>
        <option>Customer</option>
        <option>Employee</option>
        <option>Vendor/Rep</option>
        <option>Bank</option>
        <option>Complaint</option>
        <option>Vehicle Info</option>
        <option>Other</option>
      </select>
      <br /><br />
      <textarea
        rows={6}
        cols={60}
        placeholder="Paste email here..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <br /><br />
      <button onClick={generate}>Generate Response</button>
      <br /><br />
      {response && <div style={{ border: '1px solid #ccc', padding: '1rem' }}>{response}<br /><br />Dan Quirk</div>}
      <p style={{ fontSize: '0.8rem', marginTop: '2rem' }}>Powered by Quirk AI</p>
    </div>
  );
}

export default App;
