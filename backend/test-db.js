const dbConnection = require('./src/infrastructure/database/mysqlConnection');

async function test() {
  try {
    await dbConnection.connect();
    const pool = dbConnection.getPool();
    
    const [rows] = await pool.query('SELECT 1+1 AS result, NOW() AS time, VERSION() AS version');
    console.log('✅ Test réussi !');
    console.log('📊 Résultat:', rows[0]);
    
    await dbConnection.close();
    console.log('✅ Test terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test échoué:', error.message);
    process.exit(1);
  }
}

test();