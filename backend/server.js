const express = require('express');
const cors = require('cors');
const app = express();
const port = 5500;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data
const users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', full_name: 'Henry Sinkala' },
    { id: 2, username: 'worker1', password: 'worker123', role: 'healthcare_worker', full_name: 'Sarah Mwansa' },
    { id: 3, username: 'patient1', password: 'patient123', role: 'patient', full_name: 'John Banda', bed_number: 'B101', camp: 'Meheba' }
];

const patients = [
    { id: 1, full_name: 'John Banda', bed_number: 'B101', camp: 'Meheba', status: 'stable', heart_rate: 72, temperature: 36.7 },
    { id: 2, full_name: 'Mary Phiri', bed_number: 'B102', camp: 'Mantapala', status: 'monitor', heart_rate: 92, temperature: 38.4 },
    { id: 3, full_name: 'Peter Mwale', bed_number: 'B103', camp: 'Mayukwayukwa', status: 'critical', heart_rate: 120, temperature: 39.1 }
];

const devices = [
    { device_id: 'D001', device_type: 'Heart Sensor', camp: 'Meheba', status: 'online' },
    { device_id: 'D002', device_type: 'Temperature Sensor', camp: 'Mantapala', status: 'online' },
    { device_id: 'D003', device_type: 'Oxygen Sensor', camp: 'Mayukwayukwa', status: 'offline' }
];

// API Routes
app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;
    console.log('📝 Login attempt:', username, role);
    
    const user = users.find(u => u.username === username);
    
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (role && user.role !== role) {
        return res.status(401).json({ error: `Invalid role. User is ${user.role}` });
    }
    
    res.json({
        token: 'jwt-token-' + Date.now(),
        user: {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            role: user.role,
            bed_number: user.bed_number || null,
            camp: user.camp || null
        }
    });
});

app.get('/api/dashboard/:role', (req, res) => {
    const stats = {
        admin: { total_patients: 150, total_workers: 25, total_devices: 45, total_camps: 3 },
        healthcare_worker: { total_patients: 150, critical_alerts: 3, online_devices: 42 },
        patient: { heart_rate: 72, temperature: 36.7, oxygen_level: 98, blood_pressure_systolic: 120, blood_pressure_diastolic: 80, status: 'stable' }
    };
    res.json(stats[req.params.role] || {});
});

app.get('/api/patients', (req, res) => res.json(patients));
app.get('/api/devices', (req, res) => res.json(devices));

app.get('/', (req, res) => {
    res.json({ 
        message: 'RefugeeCare IoT API Server',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            '/api/login': 'POST - Login',
            '/api/dashboard/:role': 'GET - Dashboard stats',
            '/api/patients': 'GET - All patients',
            '/api/devices': 'GET - All devices'
        }
    });
});

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log('🔑 Test Credentials:');
    console.log('   Admin: admin / admin123');
    console.log('   Worker: worker1 / worker123');
    console.log('   Patient: patient1 / patient123');
});