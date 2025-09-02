import { use, useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, useColorScheme, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import CustomTextInput from "@/components/gui/customTextInput";
import CustomButton from "@/components/gui/customButton";
import { initializeTable } from "@/database/setEntry";
import Toast, { BaseToast, ToastConfigParams } from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { initNotificationChannel, scheduleDailyReminder } from "@/functions/notifications";
import CustomBottomSheet, { CustomBottomSheetRef } from "@/components/gui/customBottomSheet";
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

  const [passwordProtected, setPasswordProtected] = useState<boolean | null>(null);
  const [biometricLoginPossible, setBiometricLogin] = useState<boolean | null>(null);

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
   * Fetch stored password and AGB acceptance status on component mount.
   */
  useEffect(() => {
    async function fetchData(){
      const pasword = await AsyncStorage.getItem("password");
        setStoredPassword(typeof pasword == "string" ? pasword : null);
      const acceptedAgb = await AsyncStorage.getItem("acceptedAGB");
        setAcceptedAGB(typeof acceptedAgb == "string" ? acceptedAgb == "true" : false);
      const lang = await AsyncStorage.getItem("language");
        if (lang) {
          await i18n.changeLanguage(lang);
        }

      const onBoardingStep = await AsyncStorage.getItem("onboardingSetp");
      if (typeof onBoardingStep !== "string") {
        router.replace("/introduction");
      } else if (onBoardingStep == "one"){
        router.replace("/category");
      } else if (onBoardingStep == "two"){
        router.replace("/variables");
      } else if (onBoardingStep == "three"){
        router.replace("/password");
      } else if (onBoardingStep == "done") {
        const passwordProtected = await AsyncStorage.getItem("passwordProtected");
        const biometricLogin = await AsyncStorage.getItem("biometricLogin");
        setPasswordProtected(typeof passwordProtected == "string" ? passwordProtected == "true" : null);
        setBiometricLogin(typeof biometricLogin == "string" ? biometricLogin == "true" : null);
        if (passwordProtected == "false" && biometricLogin == "false") {
          router.replace("/home");
        }
        setIsLoading(false);
        if ( typeof biometricLogin == "string" && biometricLogin == "true" ) attemptBiometricLogin(); 
      }
        
      }   
      fetchData();
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



  

  return (
    <View className={`flex-1 px-6 justify-center items-center ${scheme === "dark" ? "bg-neutral-900" : "bg-white"}`}>
      {/* App Icon */}
      <Image
        source={require("../assets/images/splash-icon.png")}
        style={{ width: 100, height: 100, marginBottom: 20, borderRadius: 20 }}
        resizeMode="contain"
      />

      {/* Title */}
      { passwordProtected === true &&
      <Text className={`font-bold text-2xl mb-6 ${scheme === "dark" ? "text-white" : "text-black"}`}>
        {storedPassword ? t("login.enterPasswordTitle") : t("login.setPasswordTitle")}
      </Text>
      }

      { isLoading &&
        <ActivityIndicator size="large" color="#0000ff" />
      }

      {/* Password Input */}
      { passwordProtected === true &&
      <CustomTextInput
        placeholder={t("login.passwordPlaceholder")}
        value={passwordInput}
        setValue={setPasswordInput}
        aditionalStyles="mb-4 w-full max-w-[250px]"
        secureTextEntry={true}
      />
      }
      {/* Submit Button */}
      { passwordProtected === true &&
      <CustomButton
        title={storedPassword ? t("login.login") : t("login.savePassword")}
        onPress={handleSubmit}
        aditionalStyles="w-full max-w-[250px]"
      />
      }

      {/* Biometric Login */}
      {biometricLoginPossible &&
        <TouchableOpacity onPress={attemptBiometricLogin} className="mt-4">
          <Text className="text-blue-600 dark:text-blue-400">
            {t("login.biometricPrompt")}
          </Text>
        </TouchableOpacity>
      }

      {/* Toast Notifications */}
      <Toast config={toastConfig} />
      {/*      <CustomButton
        title={"reset onboarding"}
        onPress={async () => {
          await AsyncStorage.removeItem("onboardingSetp");
          await AsyncStorage.removeItem("acceptedAGB");
          await AsyncStorage.removeItem("password");
          await AsyncStorage.removeItem("passwordProtected");
          await AsyncStorage.removeItem("biometricLogin");
          router.replace("/introduction");
        }}
        aditionalStyles="w-full max-w-[250px] mt-10 bg-red-600"
      />*/}
    </View>
  );
}