const http = require('http');
require('dotenv').config();
const app = require('./app');

app.set('port', process.env.PORT || 4000);
const server = http.createServer(app);

server.listen(process.env.PORT || 4000);