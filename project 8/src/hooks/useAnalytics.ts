import { useHistory } from './useHistory';
import { usePatients } from './usePatients';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, subDays } from 'date-fns';

export const useAnalytics = (doctorId: string) => {
  const { getNotesByDoctor } = useHistory();
  const { patients } = usePatients();
  const notes = getNotesByDoctor(doctorId);

  // Language distribution
  const languageData = [
    { language: 'English', count: notes.filter(n => n.language === 'en').length },
    { language: 'Arabic', count: notes.filter(n => n.language === 'ar').length }
  ];

  // Weekly activity - last 7 days
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      name: format(date, 'EEE'),
      value: notes.filter(note => 
        format(new Date(note.createdAt), 'yyyy-MM-dd') === 
        format(date, 'yyyy-MM-dd')
      ).length
    };
  });

  // Monthly data - actual notes per month
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = format(new Date(2024, i, 1), 'MMM');
    const notesInMonth = notes.filter(note => 
      new Date(note.createdAt).getMonth() === i
    ).length;
    const patientsInMonth = new Set(
      notes.filter(note => new Date(note.createdAt).getMonth() === i)
        .map(note => note.patientId)
    ).size;

    return {
      name: month,
      notes: notesInMonth,
      patients: patientsInMonth
    };
  });

  // Calculate success rate based on note content quality
  const successRate = notes.length > 0
    ? (notes.filter(note => note.content.length > 100).length / notes.length) * 100
    : 0;

  // Calculate average processing time (estimated based on content length)
  const avgProcessingTime = notes.length > 0
    ? notes.reduce((acc, note) => acc + (note.content.length / 100), 0) / notes.length
    : 0;

  const metrics = {
    totalPatients: patients.length,
    totalNotes: notes.length,
    avgProcessingTime: parseFloat(avgProcessingTime.toFixed(1)),
    successRate: parseFloat(successRate.toFixed(1))
  };

  return {
    metrics,
    languageData,
    weeklyData,
    monthlyData,
    getFilteredData: () => ({
      metrics,
      weeklyData,
      monthlyData
    })
  };
};