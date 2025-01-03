import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { PatientInfo } from '../types/patient';

export const exportToWord = async (
  content: string,
  patientInfo: PatientInfo,
  timestamp: Date
) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: "SOAP Note",
              bold: true,
              size: 32,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Patient: ${patientInfo.name} (ID: ${patientInfo.id})`,
              bold: true,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Date: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: content })],
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `SOAP_Note_${patientInfo.name}_${timestamp.toISOString().split('T')[0]}.docx`;
  saveAs(blob, fileName);
};