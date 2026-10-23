import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Standalone dev-server middleware for persistent DBMS API
function devDbmsApiPlugin() {
  const dbFile = path.resolve(__dirname, 'locations_db.json');

  const readDb = () => {
    try {
      if (fs.existsSync(dbFile)) {
        return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
      }
    } catch (e) {
      console.error('Error reading locations_db.json:', e);
    }
    return [];
  };

  const writeDb = (data) => {
    try {
      fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error writing locations_db.json:', e);
    }
  };

  return {
    name: 'dev-dbms-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        if (!url.startsWith('/api/locations')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');

        // GET /api/locations
        if (req.method === 'GET' && url === '/api/locations') {
          res.end(JSON.stringify(readDb()));
          return;
        }

        // POST /api/locations
        if (req.method === 'POST' && url === '/api/locations') {
          let body = '';
          req.on('data', chunk => (body += chunk));
          req.on('end', () => {
            try {
              const newLoc = JSON.parse(body);
              newLoc.id = Date.now().toString();
              newLoc.lat = parseFloat(newLoc.lat);
              newLoc.lon = parseFloat(newLoc.lon);
              const list = readDb();
              list.unshift(newLoc);
              writeDb(list);
              res.statusCode = 201;
              res.end(JSON.stringify(newLoc));
            } catch (e) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        // PUT /api/locations/:id
        if (req.method === 'PUT' && url.startsWith('/api/locations/')) {
          const id = url.split('/')[3];
          let body = '';
          req.on('data', chunk => (body += chunk));
          req.on('end', () => {
            try {
              const updateData = JSON.parse(body);
              const list = readDb();
              const idx = list.findIndex(l => String(l.id) === String(id));
              if (idx !== -1) {
                if (updateData.lat !== undefined) updateData.lat = parseFloat(updateData.lat);
                if (updateData.lon !== undefined) updateData.lon = parseFloat(updateData.lon);
                list[idx] = { ...list[idx], ...updateData, id };
                writeDb(list);
                res.end(JSON.stringify(list[idx]));
              } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Location not found' }));
              }
            } catch (e) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        // DELETE /api/locations/:id
        if (req.method === 'DELETE' && url.startsWith('/api/locations/')) {
          const id = url.split('/')[3];
          let list = readDb();
          list = list.filter(l => String(l.id) !== String(id));
          writeDb(list);
          res.end(JSON.stringify({ success: true, deletedId: id }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), devDbmsApiPlugin()],
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux']
        }
      }
    }
  }
});
