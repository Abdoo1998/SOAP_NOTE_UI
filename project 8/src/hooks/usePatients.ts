import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  notesCount: number;
  lastVisit: string;
}

interface PatientsStore {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
}

// Sample data
const samplePatients: Patient[] = [
  {
    id: 'P001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State',
    status: 'active',
    notesCount: 5,
    lastVisit: new Date('2024-02-15').toISOString(),
  },
  {
    id: 'P002',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave, City, State',
    status: 'active',
    notesCount: 3,
    lastVisit: new Date('2024-02-10').toISOString(),
  },
  {
    id: 'P003',
    name: 'Michael Brown',
    email: 'michael.b@email.com',
    phone: '+1 (555) 456-7890',
    address: '789 Pine St, City, State',
    status: 'inactive',
    notesCount: 2,
    lastVisit: new Date('2024-01-25').toISOString(),
  },
];

export const usePatients = create<PatientsStore>()(
  persist(
    (set) => ({
      patients: samplePatients,
      addPatient: (patient) => set((state) => ({
        patients: [...state.patients, { ...patient, id: `P${String(state.patients.length + 1).padStart(3, '0')}` }],
      })),
      updatePatient: (id, updates) => set((state) => ({
        patients: state.patients.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      })),
      deletePatient: (id) => set((state) => ({
        patients: state.patients.filter((p) => p.id !== id),
      })),
    }),
    {
      name: 'patients-storage',
    }
  )
);