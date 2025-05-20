
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
  /*host: '10.10.10.26',
  port: '5432',
  database: 'IDOSGD_GRA',
  user: 'postgres',
  password: '123456',*/
});



pool.connect()
  .then(client => {
    console.log('✅ Conexión exitosa a la base de datos PostgreSQL.');
    client.release(); 
  })
  .catch(err => {
    console.log(err);
    console.error('❌ Error al conectar a la base de datos:', err.message);
  });

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res.rows;
}

