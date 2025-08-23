import { useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import CustomTextInput from "@/components/customTextInput";
import CustomButton from "@/components/customButton";
import { initializeTable } from "@/database/setEntry";
import Toast, { BaseToast, ToastConfigParams } from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { initNotificationChannel, scheduleDailyReminder } from "@/functions/notifications";
import CustomBottomSheet, { CustomBottomSheetRef } from "@/components/customBottomSheet";
import i18n from "@/assets/languages/i18n";

/**
 * Index component serves as the entry point for the app.
 * It handles user authentication, AGB acceptance, and initial setup.
 */
export default function Index() {
  // Translation hook
  const { t } = useTranslation();

  // State variables
  const [passwordInput, setPasswordInput] = useState("");
  const [storedPassword, setStoredPassword] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptedAGB, setAcceptedAGB] = useState(false);
  const [agbAccepted, setAgbAccepted] = useState(false);
  const scheme = useColorScheme(); // Detects light or dark mode
  const bottomSheetRef = useRef<CustomBottomSheetRef>(null);

  /**
   * Toast configuration for success and error messages.
   */
  const toastConfig = {
    success: (props: ToastConfigParams<any>) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#10b981', backgroundColor: '#1c3456ff' }}
        contentContainerStyle={{ paddingHorizontal: 15, flexWrap: 'wrap' }}
        text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}
        text2Style={{ fontSize: 14, color: '#d1d5db', flexWrap: 'wrap' }}
      />
    ),
    error: (props: ToastConfigParams<any>) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#ef4444', backgroundColor: '#1f2937' }}
        contentContainerStyle={{ paddingHorizontal: 15, flexWrap: 'wrap' }}
        text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}
        text2Style={{ fontSize: 14, color: '#fca5a5', flexWrap: 'wrap' }}
      />
    ),
  };

  /**
   * Fetch stored password and AGB acceptance status on component mount.
   */
  useEffect(() => {
    AsyncStorage.getItem("appPassword").then((val) => {
      setStoredPassword(val);
      setIsLoading(false);
      if (val) attemptBiometricLogin(); // Attempt biometric login if password exists
    });
    AsyncStorage.getItem("acceptedAGB").then((val) => {
      setAgbAccepted(val === "true");
      setAcceptedAGB(val === "true");
    });
  }, []);

  /**
   * Initialize the database table on component mount.
   */
  useEffect(() => {
    initializeTable().catch(err =>
      showToast("error", t("data.toast.errorTitle"), t("data.toast.errorMessage"))
    );
  }, []);

  /**
   * Initialize notification channel and schedule daily reminders.
   */
  useEffect(() => {
    initNotificationChannel();
    scheduleDailyReminder();
  }, []);

  /**
   * Initialize the app language based on stored preferences.
   */
  useEffect(() => {
    async function initLanguage() {
      const lang = await AsyncStorage.getItem("language");
      if (lang) {
        await i18n.changeLanguage(lang);
      }
      return lang || i18n.language;
    }
    initLanguage();
  }, []);

  /**
   * Show toast messages.
   * @param type - Type of the toast (success or error)
   * @param title - Title of the toast
   * @param message - Message of the toast
   */
  const showToast = (type = "error", title = "", message = "") => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
    });
  };

  /**
   * Handle AGB acceptance and store it in AsyncStorage.
   */
  async function handleAcceptAGB() {
    await AsyncStorage.setItem("acceptedAGB", "true");
  }

  /**
   * Attempt biometric login if hardware and enrollment are available.
   */
  const attemptBiometricLogin = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t("login.biometricPrompt"),
        fallbackLabel: t("login.biometricFallback"),
      });
      if (result.success) router.replace("/(tabs)/home");
    }
  };

  /**
   * Handle password submission for login or saving a new password.
   */
  const handleSubmit = async () => {
    if (!passwordInput) return;
    if (storedPassword === null) {
      await AsyncStorage.setItem("appPassword", passwordInput);
      showToast("success", t("login.toastPasswordSavedTitle"), t("login.toastPasswordSavedMessage"));
      router.replace("/(tabs)/home");
    } else {
      if (passwordInput === storedPassword) {
        router.replace("/(tabs)/home");
      } else {
        showToast("error", t("login.toastWrongPasswordTitle"), t("login.toastWrongPasswordMessage"));
      }
    }
  };

  /**
   * Parse AGB text from translations.
   */
  let agbsRaw = t("login.AGB", { returnObjects: true });
  let agbs: string[] = Array.isArray(agbsRaw)
    ? agbsRaw
    : Object.values(agbsRaw as object).map(String);

  // Show loading state if data is still being fetched
  if (isLoading) return null;

  return (
    <View className={`flex-1 px-6 justify-center items-center ${scheme === "dark" ? "bg-neutral-900" : "bg-white"}`}>
      {/* App Icon */}
      <Image
        source={require("../assets/images/adaptive-icon.png")}
        style={{ width: 100, height: 100, marginBottom: 20, borderRadius: 20 }}
        resizeMode="contain"
      />

      {/* Title */}
      <Text className={`font-bold text-2xl mb-6 ${scheme === "dark" ? "text-white" : "text-black"}`}>
        {storedPassword ? t("login.enterPasswordTitle") : t("login.setPasswordTitle")}
      </Text>

      {/* Password Input */}
      <CustomTextInput
        placeholder={t("login.passwordPlaceholder")}
        value={passwordInput}
        setValue={setPasswordInput}
        aditionalStyles="mb-4 w-full max-w-[250px]"
        secureTextEntry={true}
      />

      {/* AGB Acceptance */}
      {!agbAccepted && (
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => { setAcceptedAGB(!acceptedAGB); handleAcceptAGB(); }}
            className={`mr-2 ${acceptedAGB ? "bg-blue-600" : "bg-gray-300"} rounded-full w-5 h-5 justify-center items-center`}
          >
            {acceptedAGB && <Text className="text-white text-xs">✓</Text>}
          </TouchableOpacity>
          <Text className={`text-sm ${scheme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
            {t("login.acceptAGB")}
          </Text>
        </View>
      )}

      {/* Submit Button */}
      <CustomButton
        title={storedPassword ? t("login.login") : t("login.savePassword")}
        onPress={handleSubmit}
        aditionalStyles="w-full max-w-[250px]"
        isDisabled={(!acceptedAGB && !agbAccepted) || !passwordInput}
      />

      {/* Biometric Login */}
      {storedPassword && (
        <TouchableOpacity onPress={attemptBiometricLogin} className="mt-4">
          <Text className="text-blue-600 dark:text-blue-400">
            {t("login.biometricPrompt")}
          </Text>
        </TouchableOpacity>
      )}

      {/* Toast Notifications */}
      <Toast config={toastConfig} />

      {/* View AGB */}
      <TouchableOpacity
        onPress={() => bottomSheetRef.current?.openSheet(0)}
        className="mt-4"
      >
        <Text className="text-blue-600 dark:text-blue-400">
          {t("login.viewAGB")}
        </Text>
      </TouchableOpacity>

      {/* AGB Bottom Sheet */}
      <CustomBottomSheet ref={bottomSheetRef}>
        <View className="p-4">
          {agbs.map((line: string, index: number) => (
            <Text key={index} className="text-gray-300 mb-2 font-semibold w-full">
              {index + 1}. {line}
            </Text>
          ))}
        </View>
      </CustomBottomSheet>
    </View>
  );
}