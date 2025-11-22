export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendNotification(title: string, options?: NotificationOptions): void {
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
}

export function scheduleBreakNotification(minutesUntilBreak: number): void {
  if (minutesUntilBreak <= 0) {
    sendNotification('Time for a break!', {
      body: 'Take a moment to stretch and refresh your mind.',
      icon: '/vite.svg',
      tag: 'break-reminder',
      requireInteraction: true,
    });
  } else if (minutesUntilBreak === 5) {
    sendNotification('Break coming up!', {
      body: 'Your next break is in 5 minutes.',
      icon: '/vite.svg',
      tag: 'break-warning',
    });
  }
}
