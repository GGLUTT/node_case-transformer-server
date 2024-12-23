
const http = require('http');

function createServer() {
  // Створення сервера
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const textToConvert = url.pathname.slice(1);
    const toCase = url.searchParams.get('toCase');

    const supportedCases = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

    const errors = [];

    if (!textToConvert) {
      errors.push({
        message:
          'Text to convert is required. Correct request is: ' +
          '"/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      });
    }

    if (!toCase) {
      errors.push({
        message:
          '"toCase" query param is required. Correct request is: ' +
          '"/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      });
    } else if (!supportedCases.includes(toCase)) {
      errors.push({
        message:
          'This case is not supported. Available cases: ' +
          'SNAKE, KEBAB, CAMEL, PASCAL, UPPER.',
      });
    }

    if (errors.length > 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ errors }));

      return;
    }

    let convertedText;
    let originalCase;

    if (/^[A-Z0-9_]+$/.test(textToConvert)) {
      originalCase = 'UPPER';
    } else if (/^[a-z0-9_]+$/.test(textToConvert)) {
      originalCase = 'SNAKE';
    } else if (/^[a-z0-9-]+$/.test(textToConvert)) {
      originalCase = 'KEBAB';
    } else if (/^[a-z][a-zA-Z0-9]+$/.test(textToConvert)) {
      originalCase = 'CAMEL';
    } else if (/^[A-Z][a-zA-Z0-9]+$/.test(textToConvert)) {
      originalCase = 'PASCAL';
    } else {
      originalCase = 'UNKNOWN';
    }

    switch (toCase) {
      case 'SNAKE':
        convertedText = textToConvert
          .replace(/([a-z])([A-Z])/g, '$1_$2')
          .replace(/[-]/g, '_')
          .toLowerCase();
        break;
      case 'KEBAB':
        convertedText = textToConvert
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .replace(/[_]/g, '-')
          .toLowerCase();
        break;
      case 'CAMEL':
        convertedText = textToConvert
          .replace(/[_-](\w)/g, (_, letter) => letter.toUpperCase())
          .replace(/^[A-Z]/, (letter) => letter.toLowerCase());
        break;
      case 'PASCAL':
        convertedText = textToConvert
          .replace(/[_-](\w)/g, (_, letter) => letter.toUpperCase())
          .replace(/^[a-z]/, (letter) => letter.toUpperCase());
        break;
      case 'UPPER':
        convertedText = textToConvert.replace(/[_-]/g, '_').toUpperCase();
        break;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });

    res.end(
      JSON.stringify({
        originalCase,
        targetCase: toCase,
        convertedText,
        originalText: textToConvert,
      }),
    );
  });


  return server;
}

// Експортуємо функцію createServer
module.exports = { createServer };
