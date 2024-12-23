
const http = require('http')
function createServer () {
  const server = http.createServer((req, res)=>{
    res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('End');

  });

  return server;


}

module.exports = {
  createServer
}


