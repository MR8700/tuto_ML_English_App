import * as XLSX from 'xlsx';

export interface UploadedData {
  date: string;
  rainfall: number;
  temperature?: number;
  soil?: number;
  yield?: number;
}

export interface DataPoint {
  month: number;
  rainfall: number;
  yield: number;
  season: 'Rainy' | 'Dry';
}

function normalizeKey(key: string) {
  return key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const cleaned = value.trim().replace(',', '.');
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function readField(row: Record<string, unknown>, aliases: string[]) {
  const entries = Object.entries(row);

  for (const [rawKey, rawValue] of entries) {
    const key = normalizeKey(rawKey);
    if (aliases.includes(key)) {
      return rawValue;
    }
  }

  return undefined;
}

function toIsoDate(value: unknown): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) {
      const month = String(parsed.m).padStart(2, '0');
      const day = String(parsed.d).padStart(2, '0');
      return `${parsed.y}-${month}-${day}`;
    }
  }

  return '';
}

export async function parseExcel(file: File): Promise<UploadedData[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error('No sheet found in this workbook.');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: undefined });

  const parsed = rows
    .map((row, index): UploadedData | null => {
      const rainfall = toNumber(readField(row, ['rainfall', 'rain', 'pluie']));
      const date = toIsoDate(readField(row, ['date', 'jour', 'day']));
      const temperature = toNumber(readField(row, ['temperature', 'temp']));
      const soil = toNumber(readField(row, ['soil', 'soilquality', 'sol']));
      const yieldValue = toNumber(readField(row, ['yield', 'production', 'rendement']));

      if (typeof rainfall !== 'number' || rainfall < 0) {
        return null;
      }

      const parsedRow: UploadedData = {
        date: date || `Row-${index + 1}`,
        rainfall,
      };

      if (typeof temperature === 'number') parsedRow.temperature = temperature;
      if (typeof soil === 'number') parsedRow.soil = soil;
      if (typeof yieldValue === 'number') parsedRow.yield = yieldValue;

      return parsedRow;
    })
    .filter((row): row is UploadedData => row !== null);

  if (parsed.length < 10) {
    throw new Error('The Excel file must include at least 10 valid rows with Rainfall data.');
  }

  return parsed;
}
