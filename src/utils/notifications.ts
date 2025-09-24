// Utility for showing notifications outside of React components
// This will be used by contexts and other non-component code

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Global notification handler - will be set by the NotificationProvider
let globalNotificationHandler: ((type: NotificationType, message: string, duration?: number) => void) | null = null;

export const setGlobalNotificationHandler = (handler: (type: NotificationType, message: string, duration?: number) => void) => {
  globalNotificationHandler = handler;
};

export const showNotification = (type: NotificationType, message: string, duration?: number) => {
  if (globalNotificationHandler) {
    globalNotificationHandler(type, message, duration);
  } else {
    // Fallback to alert if notification system is not available
    alert(message);
  }
};

// Convenience functions
export const showSuccess = (message: string, duration?: number) => showNotification('success', message, duration);
export const showError = (message: string, duration?: number) => showNotification('error', message, duration);
export const showInfo = (message: string, duration?: number) => showNotification('info', message, duration);
export const showWarning = (message: string, duration?: number) => showNotification('warning', message, duration);