import * as XLSX from 'xlsx';
import { SAMPLE_DATASET } from '../components/DatasetExample';

export function downloadSampleExcel() {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert sample data to worksheet
  const ws = XLSX.utils.json_to_sheet(SAMPLE_DATASET);
  
  // Set column widths for better readability
  ws['!cols'] = [
    { wch: 15 }, // Date
    { wch: 15 }, // Rainfall
    { wch: 12 }, // Temperature
    { wch: 12 }, // Soil
    { wch: 15 }, // Yield
  ];
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Crop Data');
  
  // Trigger download
  XLSX.writeFile(
    wb,
    `sample_crop_data_${new Date().toISOString().split('T')[0]}.xlsx`
  );
}
