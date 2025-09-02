import React, { useState } from "react";
import { View, Text, Modal } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import CustomTextInput from "./gui/customTextInput";
import Toast, { BaseToast, ToastConfigParams } from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import CustomButton from "./gui/customButton";

/**
 * Props for the ResetPasswordModal Component
 * - `visible`: Controls the visibility of the modal.
 * - `onClose`: Callback function to close the modal.
 * - `onPasswordReset`: Function to handle the password reset logic.
 * - `verifyOldPassword`: Optional function to verify the old password.
 * - `onSuccess`: Optional callback for successful password reset.
 * - `onFail`: Optional callback for failed operations.
 */
type Props = {
  visible: boolean;
  onClose: () => void;
  onPasswordReset: (newPassword: string) => Promise<void>;
  verifyOldPassword?: (password: string) => Promise<boolean>;
  onSuccess?: () => void;
  onFail?: (message: string) => void;
};

/**
 * ResetPasswordModal Component
 * - A modal for resetting the user's password.
 * - Supports biometric authentication and password verification.
 */
const ResetPasswordModal: React.FC<Props> = ({
  visible,
  onClose,
  onPasswordReset,
  verifyOldPassword,
  onSuccess = () => {},
  onFail = (message) => {},
}) => {
  const { t } = useTranslation();

  // Toast configuration for success and error messages
  const showToast = (type = "error", title = "", message = "") => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: "top",
    });
  };

  const toastConfig = {
    success: (props: ToastConfigParams<any>) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "#10b981", backgroundColor: "#1c3456ff" }}
        contentContainerStyle={{ paddingHorizontal: 15, flexWrap: "wrap" }}
        text1Style={{ fontSize: 16, fontWeight: "bold", color: "#ffffff" }}
        text2Style={{ fontSize: 14, color: "#d1d5db", flexWrap: "wrap" }}
      />
    ),
    error: (props: ToastConfigParams<any>) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "#ef4444", backgroundColor: "#1f2937" }}
        contentContainerStyle={{ paddingHorizontal: 15, flexWrap: "wrap" }}
        text1Style={{ fontSize: 16, fontWeight: "bold", color: "#ffffff" }}
        text2Style={{ fontSize: 14, color: "#fca5a5", flexWrap: "wrap" }}
      />
    ),
  };

  // State management for the modal steps and input fields
  const [step, setStep] = useState<"auth" | "reset">("auth");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /**
   * Handle biometric authentication.
   * - Checks for hardware compatibility and performs authentication.
   */
  const handleBiometricAuth = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      showToast("error", t("resetPasswordModal.toast.biometryNotAvailable.title"), t("resetPasswordModal.toast.biometryNotAvailable.message"));
      return;
    }

    const { success } = await LocalAuthentication.authenticateAsync({
      promptMessage: t("resetPasswordModal.steps.authTitle"),
      fallbackLabel: t("resetPasswordModal.placeholders.oldPassword"),
    });

    if (success) {
      setStep("reset");
    } else {
      showToast("error", t("resetPasswordModal.toast.biometryFailed.title"), t("resetPasswordModal.toast.biometryFailed.message"));
    }
  };

  /**
   * Handle password authentication.
   * - Verifies the old password using the provided `verifyOldPassword` function.
   */
  const handlePasswordAuth = async () => {
    if (!verifyOldPassword) {
      showToast("error", t("resetPasswordModal.toast.functionNotImplemented.title"), t("resetPasswordModal.toast.functionNotImplemented.message"));

      return;
    }
    const valid = await verifyOldPassword(oldPassword);
    if (valid) {
      setStep("reset");
    } else {
      showToast("error", t("resetPasswordModal.toast.wrongPassword.title"), t("resetPasswordModal.toast.wrongPassword.message"));

    }
  };

  /**
   * Handle password reset.
   * - Validates the new password and triggers the `onPasswordReset` function.
   */
  const handleReset = async () => {
    if (newPassword.length < 6) {
      showToast("error", t("resetPasswordModal.toast.invalidPassword.title"), t("resetPasswordModal.toast.invalidPassword.message"));
      return;
    }
    await onPasswordReset(newPassword);
    onSuccess();
    onClose();
    setStep("auth");
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          className="bg-gray-800"
          style={{ borderRadius: 10, padding: 20 }}
        >
          {/* Authentication Step */}
          {step === "auth" && (
            <>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
                {t("resetPasswordModal.steps.authTitle")}
              </Text>
              {verifyOldPassword && (
                <>
                  <CustomTextInput
                    secureTextEntry
                    placeholder={t(
                      "resetPasswordModal.placeholders.oldPassword"
                    )}
                    value={oldPassword}
                    aditionalStyles="my-2"
                    setValue={setOldPassword}
                  />
                  <CustomButton
                    title={t("resetPasswordModal.buttons.passwordConfirm")}
                    onPress={handlePasswordAuth}
                    aditionalStyles="w-full"
                  />
                </>
              )}
              <View style={{ marginTop: 10 }}>
                <CustomButton
                  title={t("resetPasswordModal.buttons.biometricConfirm")}
                  onPress={handleBiometricAuth}
                  aditionalStyles="w-full"
                />
              </View>
            </>
          )}

          {/* Reset Password Step */}
          {step === "reset" && (
            <>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
                {t("resetPasswordModal.steps.resetTitle")}
              </Text>
              <CustomTextInput
                placeholder={t("resetPasswordModal.placeholders.newPassword")}
                value={newPassword}
                aditionalStyles="my-2"
                setValue={setNewPassword}
              />
              <CustomButton
                title={t("resetPasswordModal.buttons.resetConfirm")}
                onPress={handleReset}
                aditionalStyles="w-full"
              />
            </>
          )}

          {/* Cancel Button */}
          <View style={{ marginTop: 10 }}>
            <CustomButton
              title={t("resetPasswordModal.buttons.cancel")}
              onPress={onClose}
              aditionalStyles="w-full"
              backgroundColor="#5f0101ff"
            />
          </View>
        </View>
        <Toast config={toastConfig} />
      </View>
    </Modal>
  );
};

export default ResetPasswordModal;