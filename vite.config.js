import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

let lastHeartbeat = Date.now();
let activeConnections = 0;

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'auto-shutdown-on-close',
      configureServer(server) {
        // Register heartbeat endpoint
        server.middlewares.use((req, res, next) => {
          if (req.url === '/__heartbeat') {
            lastHeartbeat = Date.now();
            res.statusCode = 200;
            res.end('OK');
            return;
          }
          next();
        });

        // Monitor connection activity: shut down if tab is closed for > 5 seconds
        setInterval(() => {
          if (Date.now() - lastHeartbeat > 5000) {
            console.log('No active browser tab detected. Auto-shutting down server process...');
            process.exit(0);
          }
        }, 2000);
      }
    }
  ],
  server: {
    port: 5173,
    strictPort: true,
    host: '127.0.0.1'
  }
})
