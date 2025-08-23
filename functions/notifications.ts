import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { t } from "i18next";

/**
 * Set Notification Handler
 * - Configures how notifications are handled when they are received.
 * - Determines whether alerts, sounds, badges, banners, and lists should be shown.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Show an alert for the notification
    shouldPlaySound: true, // Play a sound for the notification
    shouldSetBadge: false, // Do not update the app badge
    shouldShowBanner: true, // Show a banner for the notification (iOS-specific)
    shouldShowList: true, // Show the notification in the notification list (iOS-specific)
  }),
});

/**
 * initNotificationChannel Function
 * - Initializes a notification channel for Android devices.
 * - Ensures that notifications are delivered with the specified settings.
 */
export async function initNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("daily-reminder", {
      name: "Tägliche Erinnerung", // Name of the notification channel
      importance: Notifications.AndroidImportance.HIGH, // High importance for notifications
      sound: "default", // Default notification sound
      vibrationPattern: [0, 250, 250, 250], // Vibration pattern for the notification
      lightColor: "#FF231F7C", // LED light color for the notification (if supported)
    });
  }
}

/**
 * scheduleDailyReminder Function
 * - Schedules a daily notification reminder at a specific time.
 * - Requests notification permissions and cancels any previously scheduled notifications.
 */
export async function scheduleDailyReminder() {
  // Request notification permissions from the user
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn(t("notifications.permissionDenied")); // Log a warning if permissions are denied
    return;
  }

  // Cancel all previously scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Determine the first trigger time for the daily reminder
  const now = new Date();
  const firstTrigger = new Date();
  firstTrigger.setHours(14, 0, 0, 0); // Set the reminder time to 14:00 (2:00 PM)

  // If the trigger time has already passed today, schedule it for tomorrow
  if (firstTrigger <= now) {
    firstTrigger.setDate(firstTrigger.getDate() + 1);
  }

  // Schedule the daily notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: t("notifications.dailyReminder.title"), // Notification title (localized)
      body: t("notifications.dailyReminder.body"), // Notification body (localized)
      sound: "default", // Default notification sound
    },
    trigger: firstTrigger, // Trigger time for the notification
  });
}