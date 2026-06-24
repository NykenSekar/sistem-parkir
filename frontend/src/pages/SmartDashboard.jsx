import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Bike, 
  Building, 
  IdCard, 
  Map, 
  Clock, 
  ShieldCheck
} from 'lucide-react';
import { getDashboardStats } from '../api/api';
import '../smart-dashboard.css';


// --- AVATAR COMPONENTS ---
const AvatarAdmin = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="50" fill="#e0e7ff" />
    <path d="M20 100 C20 75, 80 75, 80 100" fill="#6366f1" />
    <circle cx="50" cy="40" r="18" fill="#4f46e5" />
    <path d="M45 40 L55 40 L50 60 Z" fill="#fbbf24" />
  </svg>
);

// Daftar admin per area parkir
const ADMINS = [
  'Admin GKB',
  'Admin Gedung Software',
  'Admin Lab Analisis',
  'Admin Kantin Lama',
];

const IDENTITY_DATA = {
  'Admin GKB': {
    name: 'Rudi Hartono',
    numberLabel: 'ID Admin',
    number: 'ADM-GKB-001',
    deptLabel: 'Area',
    dept: 'Gedung Kuliah Bersama',
    plat: 'BE 1100 AA',
    type: 'Motor',
    className: 'id-card-dosen',
    icon: <ShieldCheck size={28} />,
    avatar: <AvatarAdmin />
  },
  'Admin Gedung Software': {
    name: 'Sari Wulandari',
    numberLabel: 'ID Admin',
    number: 'ADM-SFT-002',
    deptLabel: 'Area',
    dept: 'Gedung Software',
    plat: 'BE 2345 BC',
    type: 'Motor',
    className: 'id-card-dosen',
    icon: <ShieldCheck size={28} />,
    avatar: <AvatarAdmin />
  },
  'Admin Lab Analisis': {
    name: 'Doni Prasetyo',
    numberLabel: 'ID Admin',
    number: 'ADM-LAB-003',
    deptLabel: 'Area',
    dept: 'Gedung Laboratorium Analisis',
    plat: 'BE 3456 CD',
    type: 'Mobil',
    className: 'id-card-dosen',
    icon: <ShieldCheck size={28} />,
    avatar: <AvatarAdmin />
  },
  'Admin Kantin Lama': {
    name: 'Eka Fitriani',
    numberLabel: 'ID Admin',
    number: 'ADM-KNT-004',
    deptLabel: 'Area',
    dept: 'Area Kantin Lama',
    plat: 'BE 4567 DE',
    type: 'Motor',
    className: 'id-card-dosen',
    icon: <ShieldCheck size={28} />,
    avatar: <AvatarAdmin />
  },
};

const INITIAL_ZONES = [
  { id: 1, name: 'Gedung Kuliah Bersama (GKB)', capacity: 120, used: 0, color: '#0d3b66', totalSlots: 60 },
  { id: 2, name: 'Area Gedung Software', capacity: 50, used: 0, color: '#10b981', totalSlots: 30 },
  { id: 3, name: 'Gedung Laboratorium Analisis', capacity: 40, used: 0, color: '#f59e0b', totalSlots: 24 },
  { id: 4, name: 'Kantin Lama', capacity: 30, used: 0, color: '#8b5cf6', totalSlots: 20 },
];

// Generate deterministic random slots based on zone id
const generateMapSlots = (zoneId, totalSlots, used) => {
  const slots = [];
  // Use a simple seeded approach so the map looks the same for a zone
  let usedCount = 0;
  for (let i = 1; i <= totalSlots; i++) {
    // Determine if filled based on a pseudo-random pattern
    const isFilled = (i * zoneId * 17) % totalSlots < used && usedCount < used;
    if (isFilled) usedCount++;
    const isCar = (i * 3) % 2 === 0;
    
    slots.push({
      id: i,
      label: `P${i}`,
      type: isFilled ? 'filled' : 'empty',
      vehicle: isFilled ? (isCar ? 'car' : 'motor') : null,
      tooltip: isFilled ? 'Terisi' : 'Tersedia'
    });
  }
  return slots;
};

const USERNAME_MAP = {
  'admin_gkb': 'Admin GKB',
  'admin_software': 'Admin Gedung Software',
  'admin_lab': 'Admin Lab Analisis',
  'admin_kantin': 'Admin Kantin Lama'
};

export default function SmartDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const adminName = USERNAME_MAP[user.username] || ADMINS[0];
  const adminIndex = ADMINS.indexOf(adminName);
  
  const [selectedAdmin, setSelectedAdmin] = useState(adminName);
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState(INITIAL_ZONES[adminIndex !== -1 ? adminIndex : 0]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [mapSlots, setMapSlots] = useState([]);

  // Check-In Shift State
  const storedPetugas = sessionStorage.getItem('petugasName') || '';
  const [petugasName, setPetugasName] = useState(storedPetugas);
  const [inputPetugas, setInputPetugas] = useState('');
  const [showCheckIn, setShowCheckIn] = useState(!storedPetugas);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStats();
        
        // Update Zones
        const updatedZones = INITIAL_ZONES.map(zone => {
          const usageInfo = data.zoneUsage.find(u => u.area_parkir === zone.name);
          return {
            ...zone,
            used: usageInfo ? parseInt(usageInfo.used_slots) : 0
          };
        });
        setZones(updatedZones);

        // Update selected zone data context
        setSelectedZone(prev => {
          const currentData = updatedZones.find(z => z.id === prev.id);
          return currentData || prev;
        });

        // Update Recent Logs
        const formattedLogs = data.recentLogs.map(log => {
          let avatarObj = <AvatarAdmin />;
          let roleName = log.role_key ? log.role_key.charAt(0).toUpperCase() + log.role_key.slice(1) : 'Pengguna';

          return {
            id: log.id,
            type: 'Masuk',
            name: log.name,
            identifier: log.identifier,
            time: new Date(log.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            avatar: avatarObj,
            role: roleName
          };
        });
        setRecentLogs(formattedLogs);

      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000); // Poll every 3 seconds for real-time feel
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Regenerate map slots when zone changes
    setMapSlots(generateMapSlots(selectedZone.id, selectedZone.totalSlots, selectedZone.used));
  }, [selectedZone]);

  const identity = { ...IDENTITY_DATA[selectedAdmin] };
  if (petugasName) {
    identity.name = petugasName;
  }

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--bg-color)', minHeight: 'calc(100vh - 64px)' }}>
      
      {/* SHIFT CHECK-IN MODAL */}
      <AnimatePresence>
        {showCheckIn && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <div style={{ width: '48px', height: '48px', background: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#4f46e5' }}>
                <IdCard size={24} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Mulai Shift Jaga</h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                Selamat datang di {identity.dept}.<br/>Silakan masukkan nama Anda sebagai petugas yang berjaga saat ini.
              </p>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Nama Lengkap Petugas</label>
                <input 
                  type="text" 
                  placeholder="Misal: Budi Santoso" 
                  value={inputPetugas} 
                  onChange={e => setInputPetugas(e.target.value)} 
                  onKeyDown={e => {
                    if(e.key === 'Enter' && inputPetugas.trim()) {
                      setPetugasName(inputPetugas);
                      sessionStorage.setItem('petugasName', inputPetugas);
                      setShowCheckIn(false);
                    }
                  }}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} 
                  onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              <button 
                onClick={() => { 
                  if(inputPetugas.trim()){ 
                    setPetugasName(inputPetugas); 
                    sessionStorage.setItem('petugasName', inputPetugas); 
                    setShowCheckIn(false); 
                  } 
                }} 
                style={{ width: '100%', background: 'var(--navy-teal)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.1s, opacity 0.2s', opacity: inputPetugas.trim() ? 1 : 0.6 }}
                disabled={!inputPetugas.trim()}
              >
                Mulai Bertugas
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bento-container">
        
        {/* HEADER SECTION */}
        <motion.div 
          className="bento-item bento-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="smart-header-profile">
            <div className="custom-avatar">
              {identity.avatar}
            </div>
            <div className="smart-greeting">
              <h2>Smart Campus Parking</h2>
              <p>Sistem Manajemen Parkir Kampus Terpadu</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Akses Parkir:</span>
            <div className="smart-role-selector" style={{ pointerEvents: 'none', background: '#f1f5f9' }}>
              {selectedAdmin}
            </div>
          </div>
        </motion.div>

        {/* DYNAMIC ID CARD WIDGET */}
        <motion.div 
          className="bento-item bento-id-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="widget-title">
            <IdCard size={20} color="var(--navy-teal)" /> Identitas Digital
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedAdmin}
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              className={`id-card-wrapper ${identity.className}`}
            >
              <div className="id-card-bg-shape" />
              
              <div className="id-card-header">
                <span className="id-card-title">Akses {selectedAdmin}</span>
                <span className="id-card-icon">{identity.icon}</span>
              </div>
              
              <div className="id-card-body">
                <div className="id-card-name">{identity.name}</div>
                <div className="id-card-number">{identity.numberLabel}: {identity.number}</div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>{identity.deptLabel}: {identity.dept}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ZONE AVAILABILITY WIDGET */}
        <motion.div 
          className="bento-item bento-zones"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="widget-title">
            <Building size={20} color="var(--navy-teal)" /> Ketersediaan Area Parkir
          </div>
          <div className="zone-list">
            {zones.map((zone) => {
              const percent = (zone.used / zone.capacity) * 100;
              const isActive = selectedZone.id === zone.id;
              // Determine color based on availability (soft red if almost full, otherwise emerald green)
              const barColor = percent > 85 ? 'var(--soft-red)' : 'var(--emerald-green)';
              
              return (
                <div 
                  key={zone.id} 
                  className={`zone-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className="zone-info">
                    <span>{zone.name}</span>
                    <span>{zone.used} / {zone.capacity} Terisi</span>
                  </div>
                  <div className="zone-bar-bg">
                    <motion.div 
                      className="zone-bar-fill" 
                      style={{ backgroundColor: barColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* RECENT ACCESS TABLE */}
        <motion.div 
          className="bento-item bento-logs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="widget-title">
            <Clock size={20} color="var(--navy-teal)" /> Daftar Akses Terakhir
          </div>
          <div className="log-table-container">
            <table className="log-table">
              <thead>
                <tr>
                  <th>Dokumen</th>
                  <th>Pengguna</th>
                  <th>Identitas / Plat</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <span style={{ background: 'var(--navy-teal-light)', color: 'var(--navy-teal)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                        {log.type}
                      </span>
                    </td>
                    <td>
                      <div className="log-row-avatar">
                        <div className="mini-avatar">{log.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>{log.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{log.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{log.identifier}</td>
                    <td style={{ color: '#64748b' }}>{log.time}</td>
                  </tr>
                ))}
                {recentLogs.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      <Clock size={32} style={{ opacity: 0.5, margin: '0 auto 10px', display: 'block' }} />
                      Belum ada aktivitas terekam hari ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ZONATION MAP GRID */}
        <motion.div 
          className="bento-item bento-map"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="widget-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Map size={20} color="var(--navy-teal)" /> Peta {selectedZone.name}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 400, color: '#64748b' }}>
              Grid Otomatis
            </span>
          </div>
          
          <div className="parking-map-container">
            <div className="map-legend">
              <div className="legend-item"><div className="legend-color" style={{ background: 'var(--emerald-green-light)', border: '1px solid #34d399' }}/> Tersedia</div>
              <div className="legend-item"><div className="legend-color" style={{ background: 'var(--soft-red-light)', border: '1px solid #fca5a5' }}/> Terisi</div>
            </div>
            
            <motion.div 
              className="map-grid"
              key={selectedZone.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${selectedZone.totalSlots > 40 ? '30px' : '45px'}, 1fr))` }}
            >
              {mapSlots.map(slot => (
                <motion.div 
                  key={slot.id}
                  className={`slot-item slot-${slot.type}`}
                  title={slot.tooltip}
                  whileHover={slot.type === 'empty' ? { scale: 1.1 } : {}}
                  whileTap={slot.type === 'empty' ? { scale: 0.9 } : {}}
                >
                  {slot.type === 'filled' ? (
                    slot.vehicle === 'car' ? <Car size={selectedZone.totalSlots > 40 ? 14 : 18}/> : <Bike size={selectedZone.totalSlots > 40 ? 14 : 18}/>
                  ) : (
                    <span style={{ fontSize: selectedZone.totalSlots > 40 ? '10px' : '12px' }}>{slot.label}</span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
