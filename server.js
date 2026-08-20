import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'locations_db.json');
const DIST_DIR = path.join(__dirname, 'dist');

// Default seed locations if DB file doesn't exist
const initialLocations = [
  { id: '1', name: "Amaravati", state: "Andhra Pradesh", lat: 16.5062, lon: 80.6480, category: "Capital", notes: "Andhra Pradesh Capital" },
  { id: '2', name: "Itanagar", state: "Arunachal Pradesh", lat: 27.0844, lon: 93.6053, category: "Capital", notes: "Arunachal Pradesh Capital" },
  { id: '3', name: "Dispur", state: "Assam", lat: 26.1445, lon: 91.7362, category: "Capital", notes: "Assam Capital" },
  { id: '4', name: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376, category: "Capital", notes: "Bihar Capital" },
  { id: '5', name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lon: 81.6296, category: "Capital", notes: "Chhattisgarh Capital" },
  { id: '6', name: "New Delhi", state: "Delhi", lat: 28.6139, lon: 77.2090, category: "Capital", notes: "National Capital Territory" },
  { id: '7', name: "Panaji", state: "Goa", lat: 15.4989, lon: 73.8278, category: "Coastal", notes: "Goa Capital & Beach Resort" },
  { id: '8', name: "Gandhinagar", state: "Gujarat", lat: 23.2156, lon: 72.6369, category: "Capital", notes: "Gujarat Capital" },
  { id: '9', name: "Chandigarh", state: "Punjab / Haryana", lat: 30.7333, lon: 76.7794, category: "Capital", notes: "Joint Capital Territory" },
  { id: '10', name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lon: 77.1734, category: "Hill Station", notes: "Popular Hill Station & Capital" },
  { id: '11', name: "Srinagar", state: "Jammu & Kashmir", lat: 34.0837, lon: 74.7973, category: "Hill Station", notes: "Summer Capital of J&K" },
  { id: '12', name: "Ranchi", state: "Jharkhand", lat: 23.3441, lon: 85.3096, category: "Capital", notes: "Jharkhand Capital" },
  { id: '13', name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, category: "IT Hub", notes: "Silicon Valley of India" },
  { id: '14', name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lon: 76.9366, category: "Coastal", notes: "Kerala Capital" },
  { id: '15', name: "Leh", state: "Ladakh", lat: 34.1526, lon: 77.5771, category: "High Altitude", notes: "Ladakh Capital" },
  { id: '16', name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126, category: "Capital", notes: "City of Lakes" },
  { id: '17', name: "Mumbai", state: "Maharashtra", lat: 19.0760, lon: 72.8777, category: "Financial Hub", notes: "Maharashtra Capital" },
  { id: '18', name: "Imphal", state: "Manipur", lat: 24.8170, lon: 93.9368, category: "Capital", notes: "Manipur Capital" },
  { id: '19', name: "Shillong", state: "Meghalaya", lat: 25.5788, lon: 91.8933, category: "Hill Station", notes: "Scotland of the East" },
  { id: '20', name: "Aizawl", state: "Mizoram", lat: 23.7271, lon: 92.7176, category: "Capital", notes: "Mizoram Capital" },
  { id: '21', name: "Kohima", state: "Nagaland", lat: 25.6751, lon: 94.1086, category: "Capital", notes: "Nagaland Capital" },
  { id: '22', name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lon: 85.8245, category: "Temple City", notes: "Odisha Capital" },
  { id: '23', name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873, category: "Heritage", notes: "Pink City of India" },
  { id: '24', name: "Gangtok", state: "Sikkim", lat: 27.3389, lon: 88.6065, category: "Hill Station", notes: "Sikkim Capital" },
  { id: '25', name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, category: "Coastal", notes: "Tamil Nadu Capital" },
  { id: '26', name: "Hyderabad", state: "Telangana", lat: 17.3850, lon: 78.4867, category: "IT Hub", notes: "Telangana Capital" },
  { id: '27', name: "Agartala", state: "Tripura", lat: 23.8315, lon: 91.2868, category: "Capital", notes: "Tripura Capital" },
  { id: '28', name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, category: "Heritage", notes: "City of Nawabs" },
  { id: '29', name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lon: 78.0322, category: "Hill Station", notes: "Uttarakhand Capital" },
  { id: '30', name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639, category: "Cultural Hub", notes: "City of Joy" }
];

function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    saveDb(initialLocations);
    return initialLocations;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB, re-initializing:', err);
    saveDb(initialLocations);
    return initialLocations;
  }
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);

  // GET /api/locations
  if (parsedUrl.pathname === '/api/locations' && req.method === 'GET') {
    const locations = loadDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(locations));
    return;
  }

  // POST /api/locations
  if (parsedUrl.pathname === '/api/locations' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newLoc = JSON.parse(body);
        if (!newLoc.name || newLoc.lat === undefined || newLoc.lon === undefined) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Name, lat, and lon are required' }));
          return;
        }
        const locations = loadDb();
        newLoc.id = Date.now().toString();
        newLoc.lat = parseFloat(newLoc.lat);
        newLoc.lon = parseFloat(newLoc.lon);
        locations.unshift(newLoc);
        saveDb(locations);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newLoc));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // PUT /api/locations/:id
  if (parsedUrl.pathname.startsWith('/api/locations/') && req.method === 'PUT') {
    const id = parsedUrl.pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const updateData = JSON.parse(body);
        let locations = loadDb();
        const index = locations.findIndex(l => l.id === id);

        if (index === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Location not found' }));
          return;
        }

        if (updateData.lat !== undefined) updateData.lat = parseFloat(updateData.lat);
        if (updateData.lon !== undefined) updateData.lon = parseFloat(updateData.lon);

        locations[index] = { ...locations[index], ...updateData, id };
        saveDb(locations);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(locations[index]));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // DELETE /api/locations/:id
  if (parsedUrl.pathname.startsWith('/api/locations/') && req.method === 'DELETE') {
    const id = parsedUrl.pathname.split('/')[3];
    let locations = loadDb();
    const initialLen = locations.length;
    locations = locations.filter(l => l.id !== id);

    if (locations.length === initialLen) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Location not found' }));
      return;
    }

    saveDb(locations);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, deletedId: id }));
    return;
  }

  // Serve static files from Vite build (dist directory)
  let reqPath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
  let filePath = path.join(DIST_DIR, reqPath);

  // Fallback to index.html for SPA routing if file does not exist
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Codeverse Weather DBMS Server running at http://localhost:${PORT}`);
  console.log(`📁 Persistent Storage: ${DB_FILE}\n`);
});
