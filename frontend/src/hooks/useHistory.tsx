import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HistoryNote {
  id: string;
  patientName: string;
  patientId: string;
  content: string;
  createdAt: Date;
  language: string;
  doctor: string;
}

interface HistoryStore {
  notes: HistoryNote[];
  addNote: (note: Omit<HistoryNote, 'id' | 'createdAt'>) => void;
  deleteNote: (id: string) => void;
  getNotesByDoctor: (doctor: string) => HistoryNote[];
}

export const useHistory = create<HistoryStore>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (note) => set((state) => ({
        notes: [
          ...state.notes,
          {
            ...note,
            id: crypto.randomUUID(),
            createdAt: new Date(),
          },
        ],
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(note => note.id !== id)
      })),
      getNotesByDoctor: (doctor) => {
        return get().notes.filter(note => note.doctor === doctor);
      },
    }),
    {
      name: 'soap-notes-history',
    }
  )
);