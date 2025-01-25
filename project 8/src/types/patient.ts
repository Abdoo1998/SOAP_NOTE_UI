export interface PatientInfo {
  id: string;
  name: string;
  createdAt: Date;
}

export interface SoapNoteRecord {
  patientInfo: PatientInfo;
  content: string;
  recordedAt: Date;
}