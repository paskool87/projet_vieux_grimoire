const http = require('http');
require('dotenv').config();
const app = require('./app');

// Convertit la valeur du port en nombre valide
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;   // pipe nommé (ex: /tmp/sock)
  if (port >= 0) return port;    // port numérique valide
  return false;
};

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Gestion des erreurs du serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') throw error;

  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;

  switch (error.code) {
    case 'EACCES':
      // Port réservé (ex: port 80 sans droits admin)
      console.error(bind + ' nécessite des privilèges élevés.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // Port déjà utilisé par un autre processus
      console.error(bind + ' est déjà utilisé.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Serveur démarré sur ' + bind);
});

server.listen(port);