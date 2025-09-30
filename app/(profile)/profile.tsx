import React, { use, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, UIManager, LayoutAnimation, FlatList, ScrollView } from 'react-native';
import Toast, { BaseToast, ToastConfigParams } from 'react-native-toast-message';
import CustomButton from '@/components/gui/customButton';
import CsvExportScreen, { handleExportCSV } from '@/components/gui/csvExporter';
import CsvImportScreen from '@/components/gui/csvImporter';
import { deleteTable, initializeTable } from '@/database/setEntry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from '@/assets/languages/i18n';
import { router } from 'expo-router';
import { useGlobalContext } from '@/components/context/GlobalProvider';
import { Background } from '@react-navigation/elements';

/**
 * The Profile component provides a user interface for managing user settings, wich currently includes:
 * - CSV Export / Import
 * - Password management
 * - Terms and conditions (AGB)
 * - Language selection
 * 
 */
const Profile = () => {
  
  const { t } = useTranslation();
  const { colorTheme, setColorTheme, themeColors } = useGlobalContext();



  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [areYouSure, setAreYouSure] = useState(false);
  const [showAgb, setShowAgb] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>(i18n.language);


  // Function to save the selected language to AsyncStorage and update i18n
  const saveLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem("language", lang);
      await i18n.changeLanguage(lang);
      setCurrentLang(lang);
    } catch (error) {
      showToast('error', 'Fehler', 'Die Sprache konnte nicht gespeichert werden.');
    }
  }
  const changeLanguage = async (lang: string) => {
      await saveLanguage(lang);
      setCurrentLang(lang);
    };




  // All toast related functions and components
  const showToast = (type="error", title="", message="") => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
    });
  };
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
  const handleCsvToast = (
    action= 'export', status="error"
  )=> {
    const actionLabel = action === 'export' ? t('profile.csv.export') : t('profile.csv.import');

    if (status === 'success') {
      showToast('success', `${actionLabel} erfolgreich`, t('profile.csv.successMessage'));
    } else if (status === 'error') {
      showToast(
        'error',
        `${actionLabel} fehlgeschlagen`,
        action === 'export'
          ? t('profile.csv.errorMessageExport')
          : t('profile.csv.errorMessageImport')
      );
    } else {
      showToast(
        'error',
        `${actionLabel} abgebrochen`,
        t('profile.csv.canceledMessage')
      );
    }
  };


  return (
    <ScrollView className="flex-1 w-full bg-gray-900 p-2 space-y-6 "
      style={{ backgroundColor: themeColors[colorTheme].background}}
    >
      {/* CSV Export / Import */}
      <View className=" p-4 rounded-xl"
        style={{
          backgroundColor: themeColors[colorTheme].card
        }}
      >
        <Text className="text-white text-lg font-bold mb-3"
          style={{
            color: themeColors[colorTheme].text,
          }}
        >{t('profile.csv.sectionTitle')}</Text>
        <View className="flex-row">
          <CsvExportScreen handleToast={(status) => handleCsvToast('export', status)} />
          <CsvImportScreen handleToast={(status) => handleCsvToast('import', status)} />
        </View>
        <View style={{ paddingHorizontal: 3 }}>
          <CustomButton
            title={areYouSure ? t('profile.csv.deleteWarning') : t('profile.csv.deleteAllButton')} 
            aditionalStyles={`w-full mt-2 mb-1 ${areYouSure ? 'opacity-80' : ''}`}
            backgroundColor={
              colorTheme === "LightBlue" ?
                areYouSure ? '#750909ff' : themeColors[colorTheme].button
              :
              areYouSure ? '#ef4444' : themeColors[colorTheme].button
            }
            onPress={async () => {
              if (!areYouSure) {
                handleExportCSV(
                  (status: "error" | "success") => handleCsvToast('export', status),
                  t
                );
                setAreYouSure(true);
                showToast('error', t('profile.csv.toastWarningTitle'), t('profile.csv.toastWarningMessage'));
              } else {
                try {
                  await deleteTable();
                  await initializeTable();
                  showToast('error',t('profile.csv.deleteSuccessTitle'), t('profile.csv.deleteSuccessMessage'));
                  setAreYouSure(false);
                  router.push("/");
                } catch {
                  showToast('error',t('profile.csv.deleteErrorTitle'), t('profile.csv.deleteErrorMessage'));
                }
              }
            }}
          />
          {areYouSure && (
            <CustomButton
              title={t('profile.csv.cancelButton')}
              aditionalStyles="w-full mt-2"
              backgroundColor={ themeColors[colorTheme].button}
              onPress={() => setAreYouSure(false)}
            />
          )}
        </View>
      </View>

      {/* Password management */}
      
      <View className="bg-gray-800 p-4 rounded-xl mt-2"
        style={{
          
          backgroundColor: themeColors[colorTheme].card  ,
        }}
      >
        
        <Text className="text-white text-lg font-bold mb-3">{t('profile.password.sectionTitle')}</Text>
        <CustomButton
          title={"Passworteinstellungen"}
          onPress={()=> router.push("/password")}
          aditionalStyles='w-full'
          backgroundColor={themeColors[colorTheme].button}
          />
      </View>
      
 

      {/* Terms and conditions (AGB)  */}
      <View className="bg-gray-800 p-4 rounded-xl mt-2"
        style={{
          backgroundColor: showAgb ? themeColors[colorTheme].button  : themeColors[colorTheme].card,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setShowAgb(!showAgb);
          }}
        >
          <Text className="text-white text-lg font-bold">{t('profile.agb.sectionTitle')}</Text>
        </TouchableOpacity>
       {(() => {
        const lines = t("profile.agb.lines", { returnObjects: true });
        const arr = Array.isArray(lines) ? lines : [];

        return (
          <View style={{  overflow: "hidden" }}>
            {arr.map((item, index) => (
              <Text
                key={index}
                className={`text-gray-300 mb-1 ${
                  showAgb ? "font-semibold" : "hidden"
                }`}
              >
                {index + 1}. {typeof item === "object" ? JSON.stringify(item) : item}
              </Text>
            ))}
          </View>
        );
      })()}
        
      </View>

      {/* Language selection */}
      <View className="bg-gray-800 p-4 rounded-xl mt-2"
        style={{
          backgroundColor: themeColors[colorTheme].card,
        }}
      >
        <Text className="text-white text-lg font-bold mb-3">{t('profile.language.sectionTitle')}</Text>
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => changeLanguage('en')}
            className={`px-4 py-2 rounded-lg ${currentLang === 'en' ? '#facc15' : '#0c1f44ff'}`}
            style={{
              backgroundColor: currentLang === 'en' ? '#138bacff' : '#333842ff',
            }}
          >
            <Text className="text-white font-semibold">English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeLanguage('de')}
            className={`px-4 py-2 rounded-lg ml-2 ${currentLang === 'de' ? '#facc15' : '#0c1f44ff'}`}
            style={{
              backgroundColor: currentLang === 'de' ? '#138bacff' : '#333842ff',
            }}
          >
            <Text className="text-white font-semibold">Deutsch</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Variable Selection */}
      <View className="bg-gray-800 p-4 rounded-xl mt-2 items-start justify-start"
        style={{
          backgroundColor: themeColors[colorTheme].card,
        }}
      >
        <Text className="text-white text-lg font-bold mb-3">Passe deine Variablen an</Text>
        <CustomButton
          title='Go to Variable Selection'
          onPress={() => router.push("/variables")}
          aditionalStyles='w-full'
          backgroundColor={themeColors[colorTheme].button}
          />
      </View>
      {/* Color Theme Selection - starting now */}
      <View className="bg-gray-800 p-4 rounded-xl mt-2 items-start justify-start "
        style={{
          backgroundColor: themeColors[colorTheme].card,
          marginBottom: 30,
        }}
      >
        <Text className="text-white text-lg font-bold mb-3">Farbthema Auswahl</Text>
        <View className='flex-row space-x-3'>
            <TouchableOpacity style={{
              padding:15, borderRadius:"100%", backgroundColor: "#0c1f44ff", marginRight:5 , borderColor: colorTheme === "DarkBlue" ? '#138bacff' : '#0c1f44ff', borderWidth:2,
              }} onPress={()=> setColorTheme("DarkBlue")} />
            <TouchableOpacity style={{padding:15, borderRadius:"100%", backgroundColor: "#138bacff",
              borderColor: colorTheme === "LightBlue" ? '#f9fafb' : '#138bacff', borderWidth:2,
            }} onPress={()=> setColorTheme("LightBlue")} />
        </View>
      </View>

      <Toast config={toastConfig} />
    </ScrollView>
  );
};

export default Profile;
