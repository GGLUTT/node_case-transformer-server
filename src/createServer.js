// Write code here
// Also, you can create additional files in the src folder
// and import (require) them here

const http = require('http');

const createServer = () => {
  const server = http.createServer((req, res) => {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const query = Object.fromEntries(searchParams.entries());

    const pathname = req.url.split('?')[0];

    if (pathname !== '/createServer' || !query.toCase) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid request format' }));

      return;
    }

    const textToConvert = pathname.slice(1);
    const caseType = query.toCase.toUpperCase();
    let transformedText;

    switch (caseType) {
      case 'SNAKE':
        transformedText = textToConvert.replace(/ /g, '_').toLowerCase();
        break;
      case 'KEBAB':
        transformedText = textToConvert.replace(/ /g, '-').toLowerCase();
        break;
      case 'CAMEL':
        transformedText = textToConvert
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) => {
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
          })
          .replace(/\s+/g, '');
        break;
      case 'PASCAL':
        transformedText = textToConvert
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (match) => match.toUpperCase())
          .replace(/\s+/g, '');
        break;
      case 'UPPER':
        transformedText = textToConvert.toUpperCase();
        break;
      default:
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unknown case type' }));

        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result: transformedText }));
  });

  return server;
};

module.exports = {
  createServer,
};
