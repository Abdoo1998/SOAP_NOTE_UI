import { create } from 'zustand';
import { createSoapNote } from '../services/api';

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
  isLoading: boolean;
  error: string | null;
  addNote: (note: Omit<HistoryNote, 'id' | 'createdAt'>) => Promise<void>;
  deleteNote: (id: string) => void;
  getNotesByDoctor: (doctor: string) => HistoryNote[];
}

export const useHistory = create<HistoryStore>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,

  addNote: async (note) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createSoapNote({
        patient_id: note.patientId,
        patient_name: note.patientName,
        content: note.content
      });

      set((state) => ({
        notes: [
          ...state.notes,
          {
            ...note,
            id: response.id,
            createdAt: new Date(),
          },
        ],
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save note';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter(note => note.id !== id)
  })),

  getNotesByDoctor: (doctor) => {
    return get().notes.filter(note => note.doctor === doctor);
  },
}));