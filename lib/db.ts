
// Database disabled - simulation only (mysql2 optional dependency)
// To enable: npm i mysql2, set .env vars (MYSQL_HOST etc.)

export const pool = null;

export async function initDb() {
  if (!pool) throw new Error('Database disabled');
}

export async function saveTrainingRecord(region: string, year: number, r2: number, dataset: any[]) {
  throw new Error('Database disabled - simulation mode');
}

export async function getTrainingRecords() {
  throw new Error('Database disabled - simulation mode');
}

