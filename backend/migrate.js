const db = require('./db');

async function migrate() {
  try {
    console.log('Adding area_parkir column to parkir table...');
    await db.query(`
      ALTER TABLE parkir 
      ADD COLUMN area_parkir VARCHAR(100) NOT NULL DEFAULT 'Gedung Kuliah Bersama (GKB)'
    `);
    console.log('Migration successful!');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Column area_parkir already exists. Moving on.');
      process.exit(0);
    } else {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  }
}

migrate();
