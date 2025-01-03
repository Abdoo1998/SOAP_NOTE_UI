import { useHistory } from './useHistory';
import { startOfToday, isToday } from 'date-fns';

export const useDashboardMetrics = (doctorId: string) => {
  const { getNotesByDoctor } = useHistory();
  const notes = getNotesByDoctor(doctorId);
  
  // Calculate today's notes
  const todayNotes = notes.filter(note => 
    isToday(new Date(note.createdAt))
  ).length;

  // Calculate total notes
  const totalNotes = notes.length;

  // Calculate language distribution
  const languageDistribution = notes.reduce((acc: Record<string, number>, note) => {
    acc[note.language] = (acc[note.language] || 0) + 1;
    return acc;
  }, {});

  // Calculate success rate (based on note content length)
  const successRate = notes.length > 0
    ? (notes.filter(note => note.content.length > 100).length / notes.length) * 100
    : 0;

  // Calculate average processing time (mock calculation)
  const avgProcessingTime = 2.5 + Math.random();

  // Format recent activity
  const recentActivity = notes
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(note => ({
      id: note.id,
      patientName: note.patientName,
      patientId: note.patientId,
      createdAt: new Date(note.createdAt),
      type: 'created' as const
    }));

  // Format language distribution for chart
  const languageData = Object.entries(languageDistribution).map(([language, count]) => ({
    language: language === 'en' ? 'English' : 'Arabic',
    count
  }));

  return {
    metrics: {
      todayNotes,
      totalNotes,
      avgProcessingTime,
      successRate: parseFloat(successRate.toFixed(1))
    },
    languageData,
    recentActivity
  };
};