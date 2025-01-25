import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('l', 'mm', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('analytics-report.pdf');
};

export const exportToCSV = (data: any[], filename: string) => {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

export const exportToImage = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element);
  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, 'analytics-report.png');
    }
  });
};

const convertToCSV = (data: any[]): string => {
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(header => obj[header]));
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
};