fetch('http://localhost:3000/api/agentic-ai/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentId: 'lead-prospector',
    prompt: 'Carikan 2 pabrik otomotif di Karawang'
  })
})
  .then(r => r.json())
  .then(data => {
    console.log('Success:', data.success);
    console.log('Output preview:', data.output);
  })
  .catch(err => console.error('Fetch error:', err));
