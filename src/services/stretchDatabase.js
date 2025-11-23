import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSIONS_KEY = '@stretch_sessions';
const STATS_KEY = '@stretch_stats';

/**
 * Save a completed stretch session
 */
export async function saveStretchSession(sessionData) {
  try {
    const { exerciseName, duration, feeling, timestamp } = sessionData;

    const session = {
      id: Date.now().toString(),
      exerciseName: exerciseName || 'Neck Stretch',
      duration: duration || 5,
      feeling: feeling || null,
      timestamp: timestamp || new Date().toISOString(),
      date: new Date().toLocaleDateString(),
    };

    // Get existing sessions
    const sessions = await getAllSessions();
    sessions.push(session);

    // Save updated sessions
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

    // Update stats
    await updateStats();

    return session;
  } catch (error) {
    console.error('Error saving stretch session:', error);
    throw error;
  }
}

/**
 * Get all stretch sessions
 */
export async function getAllSessions() {
  try {
    const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
    return sessionsJson ? JSON.parse(sessionsJson) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
}

/**
 * Get sessions for a specific date
 */
export async function getSessionsByDate(date) {
  try {
    const sessions = await getAllSessions();
    return sessions.filter((session) => session.date === date);
  } catch (error) {
    console.error('Error getting sessions by date:', error);
    return [];
  }
}

/**
 * Update statistics
 */
async function updateStats() {
  try {
    const sessions = await getAllSessions();

    const stats = {
      totalSessions: sessions.length,
      totalMinutes: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      averageFeeling: calculateAverageFeeling(sessions),
      streak: calculateStreak(sessions),
      lastSession: sessions.length > 0 ? sessions[sessions.length - 1] : null,
      sessionsThisWeek: getSessionsThisWeek(sessions),
      sessionsThisMonth: getSessionsThisMonth(sessions),
    };

    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error('Error updating stats:', error);
    throw error;
  }
}

/**
 * Get current statistics
 */
export async function getStats() {
  try {
    const statsJson = await AsyncStorage.getItem(STATS_KEY);
    if (statsJson) {
      return JSON.parse(statsJson);
    }

    // If no stats exist, create initial stats
    await updateStats();
    const newStatsJson = await AsyncStorage.getItem(STATS_KEY);
    return newStatsJson ? JSON.parse(newStatsJson) : getDefaultStats();
  } catch (error) {
    console.error('Error getting stats:', error);
    return getDefaultStats();
  }
}

function getDefaultStats() {
  return {
    totalSessions: 0,
    totalMinutes: 0,
    averageFeeling: 0,
    streak: 0,
    lastSession: null,
    sessionsThisWeek: 0,
    sessionsThisMonth: 0,
  };
}

/**
 * Calculate average feeling from sessions
 */
function calculateAverageFeeling(sessions) {
  const sessionsWithFeelings = sessions.filter((s) => s.feeling !== null);
  if (sessionsWithFeelings.length === 0) return 0;

  const sum = sessionsWithFeelings.reduce((total, s) => total + s.feeling, 0);
  return Math.round(sum / sessionsWithFeelings.length);
}

/**
 * Calculate current streak (consecutive days with at least one session)
 */
function calculateStreak(sessions) {
  if (sessions.length === 0) return 0;

  const sortedSessions = sessions.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const uniqueDates = [
    ...new Set(sortedSessions.map((s) => new Date(s.timestamp).toDateString())),
  ];

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < uniqueDates.length; i++) {
    const sessionDate = new Date(uniqueDates[i]);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (sessionDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get number of sessions this week
 */
function getSessionsThisWeek(sessions) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  return sessions.filter((s) => new Date(s.timestamp) >= weekStart).length;
}

/**
 * Get number of sessions this month
 */
function getSessionsThisMonth(sessions) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return sessions.filter((s) => new Date(s.timestamp) >= monthStart).length;
}

/**
 * Clear all data (for testing)
 */
export async function clearAllData() {
  try {
    await AsyncStorage.multiRemove([SESSIONS_KEY, STATS_KEY]);
    console.log('All stretch data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}
