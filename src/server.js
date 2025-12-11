import http from 'http';
import app from './app.js';
import config from './config/env.js';

const server = http.createServer(app);

const PORT = config.port;

server.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});
