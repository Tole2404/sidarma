const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf-8');
console.log('ENV length:', envContent.length);

let apiKey = '';
for (const line of envContent.split(/\r?\n/)) {
  if (line.startsWith('NINEROUTER_API_KEY=')) {
    apiKey = line.replace('NINEROUTER_API_KEY=', '').replace(/['"]/g, '').trim();
  }
}
console.log('API KEY from file:', apiKey);

const payload = {
  model: 'ag/gemini-3.8-flash-high',
  stream: false,
  messages: [
    { role: 'system', content: 'Anda adalah B2B Lead Prospector di SIDARMA. Jawab singkat.' },
    { role: 'user', content: 'Carikan 2 pabrik otomotif di Karawang' }
  ],
  temperature: 0.3
};

fetch('http://localhost:20128/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify(payload)
})
  .then(async res => {
    console.log('HTTP Status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Response body:', text.substring(0, 500));
  })
  .catch(err => {
    console.error('Fetch error:', err);
  });
