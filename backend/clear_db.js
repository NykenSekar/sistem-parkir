const db = require('./db');

async function clearDB() {
  try {
    console.log('Clearing parkir...');
    await db.query('DELETE FROM parkir');
    await db.query('ALTER TABLE parkir AUTO_INCREMENT = 1');
    
    console.log('Clearing kendaraan...');
    await db.query('DELETE FROM kendaraan');
    await db.query('ALTER TABLE kendaraan AUTO_INCREMENT = 1');
    
    console.log('Clearing pengguna_parkir...');
    await db.query('DELETE FROM pengguna_parkir');
    await db.query('ALTER TABLE pengguna_parkir AUTO_INCREMENT = 1');

    console.log('Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing DB:', error);
    process.exit(1);
  }
}

clearDB();
