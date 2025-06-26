const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

function getBotReply(message) {
  const text = message.toLowerCase();
  if (text.includes('time')) {
    return `Current server time is ${new Date().toLocaleTimeString()}.`;
  }
  if (text.includes('date')) {
    return `Today's date is ${new Date().toLocaleDateString()}.`;
  }
  if (text.includes('hello')) {
    return 'Hello! How can I assist you?';
  }
  if (text.includes('help')) {
    return 'You can ask me about the time or date.';
  }
  return `You said: ${message}`;
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    // Serve index.html
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.method === 'POST' && req.url === '/chat') {
    // handle chat message
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { message } = JSON.parse(body);
        const reply = getBotReply(message);
        const json = JSON.stringify({ reply });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(json);
      } catch (e) {
        res.writeHead(400);
        res.end('Invalid request');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
