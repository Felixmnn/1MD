import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { use, useEffect } from 'react'
import CustomButton from '@/components/gui/customButton';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import CustomTextInput from '@/components/gui/customTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomBottomSheet, { CustomBottomSheetRef } from '@/components/gui/customBottomSheet';
import { useTranslation } from 'react-i18next';
import { useGlobalContext } from '@/components/context/GlobalProvider';

const Password = () => {
  const { t } = useTranslation();
    const { colorTheme, setColorTheme, themeColors } = useGlobalContext();


  const [ hereToEdit, setHereToEdit ] = React.useState(false);

  const [ passwordYesNo, setPasswordYesNo ] = React.useState<boolean | null>(null);
  const [ password, setPassword ] = React.useState<string>("");
  const [ passwordConfirm, setPasswordConfirm ] = React.useState<string>("");
  const [ passwordSet, setPasswordSet ] = React.useState<boolean>(false);
  const [ passwordResetRequested, setPasswordResetRequested ] = React.useState(false);

  const [ biometricYesNo, setBiometricYesNo ] = React.useState<boolean | null>(null);

  const [ agbAccepted, setAgbAccepted ] = React.useState(false);

  const bottomSheetRef = React.useRef<CustomBottomSheetRef>(null);

  useEffect(() => {
    AsyncStorage.getItem("password").then((value)=> { 
      if(value) {
        setHereToEdit(true);
        setPasswordSet(true);
        setPasswordYesNo(true);
        setAgbAccepted(true);
      }})
    AsyncStorage.getItem("biometricLogin").then((value)=> { 
      if(value) {
        setBiometricYesNo(value === "true" ? true : value === "false" ? false : null);
      }})
  },[]);

  let agbsRaw = t("login.AGB", { returnObjects: true });
  let agbs: string[] = Array.isArray(agbsRaw)
    ? agbsRaw
    : Object.values(agbsRaw as object).map(String);

  const YesNoComponent = ({ title = "YesNo", state = false, setState = (s: boolean) => {} }) => {
    return (
      <View className='w-full items-center justify-between flex-row  mb-2 ' >
        <Text className='flex-1  text-xl font-bold text-white '>{title}</Text>
        <View className='w-full max-w-[100px] flex-row items-center justify-center'>
          <View className='flex-row items-center mr-2'>
            <TouchableOpacity
              onPress={() => setState(true)}
              className={`mr-1 ${state == true ? "bg-blue-600" : "bg-gray-300"} rounded-full w-5 h-5 justify-center items-center`}
            > 
              {state == true && <Text className="text-white text-xs">✓</Text>}
            </TouchableOpacity>
            <Text className={`text-lg ${state == true ? "text-white" : "text-gray-400"}`}>
              {t("profile.password.yes")}
            </Text>
          </View>
          <View className='flex-row items-center mr-2'>
            <TouchableOpacity
              onPress={() => setState(false)}
              className={`mr-2 ${state == false ? "bg-blue-600" : "bg-gray-300"} rounded-full w-5 h-5 justify-center items-center`}
            >
              {state == false && <Text className="text-white text-xs">✓</Text>}
            </TouchableOpacity>
            <Text className={`text-lg ${state == false ? "text-white" : "text-gray-400"}`}>
              {t("profile.password.no")}
            </Text>
          </View>
        </View>
      </View>
    )
  }
  
  return (
    <SafeAreaView className='flex-1 w-full items-center  p-4'
     style={{
         backgroundColor: themeColors[colorTheme].background
      }}
    >
      <View className='w-full justify-start items-center w-full rounded-lg' 
        style={{
          backgroundColor:themeColors[colorTheme].button,
          padding: 20,
          marginBottom: 10
        }}
      >
      <Text className='text-3xl font-bold text-white mb-6 text-center'>
        {t("profile.password.passwordProtection")}
      </Text>


      {/* Password Settings */}
      <YesNoComponent
        title={t("profile.password.passwordProtection1")}
        state={passwordYesNo === null ? undefined : passwordYesNo}
        setState={setPasswordYesNo}
      />

      {
        passwordResetRequested == true &&
        <View className='w-full'>
          <CustomTextInput
            placeholder={t("profile.password.oldPassword")}
            value={password}
            setValue={setPassword}
            aditionalStyles="mb-4 w-full "
            secureTextEntry={true}
          />
          <CustomTextInput 
            placeholder={t("profile.password.newPassword")}
            value={passwordConfirm}
            setValue={setPasswordConfirm}
            aditionalStyles="mb-4 w-full "
            secureTextEntry={true}
          />
        </View>
      }

      { hereToEdit === true && passwordSet === true &&
      <CustomButton
        title={ passwordResetRequested == false ? t("profile.password.changeButton")
          :  password != passwordConfirm ? 
          t("profile.password.passwordsDontMatch")
          : password.length < 4 ? 
          t("profile.password.passwordTooShort"):
          t("profile.password.saveNewPassword") 
        }
        aditionalStyles='w-full mb-4'
        onPress={async() => {
          if (passwordResetRequested == false) {
            setPasswordResetRequested(true);
            setPassword("");
            setPasswordConfirm("");
          } else {
            AsyncStorage.setItem("password", password);
            setPasswordResetRequested(false);
          }
        }}
        isDisabled={ passwordResetRequested == true && (password.length < 4 || password !== passwordConfirm) }
      />
      }

      {/* Biometric Settings */}
      {passwordYesNo !== null && (passwordSet === true || passwordYesNo == false ) &&
      <YesNoComponent 
        title={"Biometrische Anmeldung: "}
        state={biometricYesNo === null ? undefined : biometricYesNo}
        setState={setBiometricYesNo}
      />
      }






      {  passwordYesNo !== null && passwordSet === false && passwordYesNo === true &&
      <View className='w-full px-2'>
        <CustomTextInput
          placeholder={t("profile.password.setPassword")}
          value={password}
          setValue={setPassword}
          aditionalStyles="mb-4 w-full "
          secureTextEntry={true}
        />
        <CustomTextInput
          placeholder={t("profile.password.confirmPassword")}
          value={passwordConfirm}
          setValue={setPasswordConfirm}
          aditionalStyles="mb-4 w-full "
          secureTextEntry={true}
        />
        <CustomButton
          title={t("profile.password.setPassword")}
          onPress={async() => {
            await AsyncStorage.setItem("password", password);
            setPasswordSet(true);
          }}
          aditionalStyles="w-full"
          isDisabled={password.length < 4 || password !== passwordConfirm}
        />
            

      </View>
      }
      


        {/* AGB Acceptance */}
        {!agbAccepted && (passwordYesNo !== null && biometricYesNo !== null) && (passwordSet === true || passwordYesNo == false ) && (
          <View className="flex-row items-center mt-2">
            <TouchableOpacity
              onPress={() => { setAgbAccepted(!agbAccepted) }}
              className={`mr-2 ${agbAccepted ? "bg-blue-600" : "bg-gray-300"} rounded-full w-5 h-5 justify-center items-center`}
            >
              {agbAccepted && <Text className="text-white text-xs">✓</Text>}
            </TouchableOpacity>
            <Text className={`text-sm text-white`}>
              {t("login.acceptAGB")}
            </Text>
          </View>
        )}

        {/* View AGB */}
        {!agbAccepted && (passwordYesNo !== null && biometricYesNo !== null) && (passwordSet === true || passwordYesNo == false ) && (
        <TouchableOpacity
          onPress={() => bottomSheetRef.current?.openSheet(0)}
          className="mt-2"
        >
          <Text className="text-blue-600 dark:text-blue-400">
            {t("login.viewAGB")}
          </Text>
        </TouchableOpacity>
        )}
        </View>
        {
          hereToEdit === true &&
        <CustomButton 
          title={t("profile.password.saveChanges")}
          aditionalStyles='w-full mb-2'
          onPress={async() => {
            await AsyncStorage.setItem("passwordProtected", passwordYesNo ? "true" : "false");
            await AsyncStorage.setItem("biometricLogin", biometricYesNo ? "true" : "false");
            router.back()
          }}
        />
        }
        {
        (passwordYesNo !== null && biometricYesNo !== null) && (passwordSet === true || passwordYesNo == false ) && !hereToEdit &&
        <CustomButton
          title={t("profile.password.letsGo")}
          aditionalStyles='w-full '
          onPress={async() => {
            await AsyncStorage.setItem("passwordProtected", passwordYesNo ? "true" : "false");
            await AsyncStorage.setItem("biometricLogin", biometricYesNo ? "true" : "false");
            await AsyncStorage.setItem("onboardingSetp", "done");
            await AsyncStorage.setItem("agbAccepted", agbAccepted ? "true" : "false");
            router.push("/home");
          }}
          isDisabled={ (agbAccepted === false)}
          />
      }
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
      
    </SafeAreaView>
  )
}

export default Password