var http = require('http');

console.log('Server started');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('My first server!');
}).listen(8080);