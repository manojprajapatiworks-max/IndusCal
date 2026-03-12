import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('database.sqlite');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    service_type TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed default settings if they don't exist
const seedSettings = () => {
  const defaultSettings = {
    hero: JSON.stringify({
      title: 'Precision Calibration & Industrial Repair',
      subtitle: 'We ensure your industrial instruments operate at peak performance. ISO-certified calibration, expert repairs, and reliable parts procurement.',
      imageUrl: 'https://picsum.photos/seed/industrial/1920/1080'
    }),
    contact: JSON.stringify({
      phone: '+1 (555) 123-4567',
      email: 'info@induscal.com',
      address: '123 Industrial Pkwy, Tech District, NY 10001'
    }),
    categories: JSON.stringify([
      { id: '1', name: 'Calibration', icon: 'ShieldCheck', description: 'NIST-traceable and ISO/IEC 17025 accredited calibration.' },
      { id: '2', name: 'Repair', icon: 'Wrench', description: 'Component-level repair for industrial electronics.' },
      { id: '3', name: 'Procurement', icon: 'PackageSearch', description: 'Sourcing hard-to-find industrial components.' }
    ]),
    services: JSON.stringify([
      { id: '1', categoryId: '1', title: 'Instrument Calibration', description: 'We provide NIST-traceable and ISO/IEC 17025 accredited calibration services for a wide range of industrial instruments. Our state-of-the-art laboratory ensures the highest level of accuracy and compliance.', features: ['Pressure & Vacuum', 'Temperature & Humidity', 'Electrical & Electronic', 'Dimensional & Mechanical', 'Flow & Level'], imageUrl: 'https://picsum.photos/seed/calibration/800/600' },
      { id: '2', categoryId: '2', title: 'Industrial Equipment Repair', description: 'Our expert technicians provide component-level repair for industrial electronics, PLCs, drives, and mechanical instruments. We diagnose, repair, and rigorously test every unit to ensure it meets OEM specifications.', features: ['PLC & HMI Repair', 'AC/DC Drives & Motors', 'Process Controllers', 'Power Supplies', 'Printed Circuit Boards (PCBs)'], imageUrl: 'https://picsum.photos/seed/repair/800/600' },
      { id: '3', categoryId: '3', title: 'Parts Procurement', description: 'Struggling to find obsolete or specialized industrial components? Our global network of trusted suppliers allows us to source hard-to-find parts quickly, minimizing your downtime.', features: ['Obsolete Component Sourcing', 'OEM Replacement Parts', 'Global Supplier Network', 'Quality Verification', 'Expedited Shipping Options'], imageUrl: 'https://picsum.photos/seed/procurement/800/600' }
    ])
  };

  const stmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const [key, value] of Object.entries(defaultSettings)) {
    stmt.run(key, value);
  }
};
seedSettings();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/requests', (req, res) => {
    try {
      const { name, email, phone, company, serviceType, message } = req.body;
      const stmt = db.prepare(
        'INSERT INTO requests (name, email, phone, company, service_type, message) VALUES (?, ?, ?, ?, ?, ?)'
      );
      const result = stmt.run(name, email, phone, company, serviceType, message);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error('Error saving request:', error);
      res.status(500).json({ error: 'Failed to save request' });
    }
  });

  app.get('/api/requests', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM requests ORDER BY created_at DESC');
      const requests = stmt.all();
      res.json(requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ error: 'Failed to fetch requests' });
    }
  });

  app.get('/api/settings', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM settings');
      const rows = stmt.all();
      const settings = rows.reduce((acc: any, row: any) => {
        acc[row.key] = JSON.parse(row.value);
        return acc;
      }, {});
      res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/settings', (req, res) => {
    try {
      const settings = req.body;
      const updateStmt = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
      const insertStmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
      
      const updateSettings = db.transaction((settingsObj) => {
        for (const [key, value] of Object.entries(settingsObj)) {
          const strValue = JSON.stringify(value);
          const result = updateStmt.run(strValue, key);
          if (result.changes === 0) {
            insertStmt.run(key, strValue);
          }
        }
      });
      
      updateSettings(settings);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  app.put('/api/requests/:id/status', (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const stmt = db.prepare('UPDATE requests SET status = ? WHERE id = ?');
      stmt.run(status, id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  });

  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    // Hardcoded for prototype purposes
    if (username === 'admin' && password === 'admin123') {
      res.json({ success: true, token: 'fake-jwt-token' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
