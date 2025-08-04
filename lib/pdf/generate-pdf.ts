import { jsPDF } from 'jspdf';

export function generatePDF(content: string): Uint8Array {
  const doc = new jsPDF();
  doc.text(content, 10, 10);
  return doc.output('arraybuffer');
}