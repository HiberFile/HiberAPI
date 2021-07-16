import prisma from './prisma';
import mariadb from 'mariadb';

require('dotenv').config();

(async () => {
  const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 5,
  });

  const conn = await pool.getConnection();
  const files: { id: string; name: string; expire: Date }[] = await conn.query(
    'SELECT * FROM Files'
  );

  await prisma.file.createMany({
    data: files.map((file) => ({
      hiberfileId: file.id,
      name: file.name,
      expire: file.expire,
      uploading: false,
    })),
  });

  return;
})();
