import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { use, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import CustomButton from '@/components/customButton'
import { addEntry, getEntryForToday } from '@/database/setEntry'
import { router } from 'expo-router'
import { isCompleated } from '@/functions/homeCondtions'
import DiplayAndEditDay from '@/components/diplayAndEditDay'
import Toast, { BaseToast, ToastConfigParams } from 'react-native-toast-message'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'

/**
 * The Home component is the landing page of the app.
 * It displays the data for the current day and allows the user to edit it.
 */
const Home = () => { 
const { t } = useTranslation();
type todayEntry = {
  date: string;
  thingsLearned: string[];
  productivity: string | null;
  kcal: number | null;
  steps: number | null;
  workout: boolean;
  workoutDuration: number | null;
  workoutIntensity: string | null;
  sleepQuality: string | null; 
  socialInteractions: number | null;
  goodSocialInteractions: number | null;
  badSocialInteractions: number | null;
  somethingSpecial: string[];
  overallDayRating: number | null;
  workHours: number | null;
  sleepDuration: number | null;
  socialMediaUsageMorning: boolean | null;
  socialMediaUsageEvening: boolean | null;
  avoidedBadHabits: boolean | null;
};

//This effect fetches the entry for today if there is one
const isFocused = useIsFocused();
useEffect(() => {
  async function fetchTodayEntry() {
    const todayEntry = await getEntryForToday();

    // Default values für den Fall, dass kein Eintrag existiert
    const defaultEntry = {
      thingsLearned: [] as string[],
      somethingSpecial: [] as string[],
      overallDayRating: null,
      sleepQuality: null,
      productivity: null,
      workout: false,
      workoutIntensity: null,
      workoutDuration: null,
      sleepDuration: null,
      kcal: null,
      steps: null,
      workHours: null,
      socialInteractions: null,
      goodSocialInteractions: null,
      badSocialInteractions: null,
      socialMediaUsageMorning: false,
      socialMediaUsageEvening: false,
      avoidedBadHabits: false,
    };
    type Entry = {
      thingsLearned: string[];
      somethingSpecial: string[];
      overallDayRating: number | null;
      sleepQuality: keyof typeof validEnumValues.sleepQuality | null;
      productivity: keyof typeof validEnumValues.productivity | null;
      workout: boolean;
      workoutIntensity: keyof typeof validEnumValues.workoutIntensity | null;
      workoutDuration: number | null;
      sleepDuration: number | null;
      kcal: number | null;
      steps: number | null;
      workHours: number | null;
      socialInteractions: number | null;
      goodSocialInteractions: number | null;
      badSocialInteractions: number | null;
      socialMediaUsageMorning: boolean;
      socialMediaUsageEvening: boolean;
      avoidedBadHabits: boolean;
    };
    const entryData:Partial<Entry> = todayEntry ?? defaultEntry;

    setDataSaved(!!todayEntry); // true, falls Eintrag existiert, sonst false

    try {
      setSelectedData({
        ...selectedData,
        thingsLearned: entryData.thingsLearned ?? [],
        somethingSpecial: entryData.somethingSpecial ?? [],
        overallDayRating: entryData.overallDayRating ?? null,
        sleepQuality:
          entryData.sleepQuality != null
            ? validEnumValues.sleepQuality[Number(entryData.sleepQuality)]
            : null,
        productivity:
          entryData.productivity != null
            ? validEnumValues.productivity[Number(entryData.productivity)]
            : null,
        workout: entryData.workout ?? false,
        workoutIntensity:
          entryData.workoutIntensity != null
            ? validEnumValues.workoutIntensity[Number(entryData.workoutIntensity)]
            : null,
        workoutDuration: entryData.workoutDuration ?? null,
        sleepDuration: entryData.sleepDuration ?? null,
        kcal: entryData.kcal ?? null,
        steps: entryData.steps ?? null,
        workHours: entryData.workHours ?? null,
        socialInteractions: entryData.socialInteractions ?? null,
        goodSocialInteractions: entryData.goodSocialInteractions ?? null,
        badSocialInteractions: entryData.badSocialInteractions ?? null,
        socialMediaUsageMorning: entryData.socialMediaUsageMorning ?? false,
        socialMediaUsageEvening: entryData.socialMediaUsageEvening ?? false,
        avoidedBadHabits: entryData.avoidedBadHabits ?? false,
      });
    } catch (error) {
      showToast("error", t('data.toast.errorTitle'), t('data.toast.errorMessage'));
    }
  }

  fetchTodayEntry();
}, [isFocused]);


/**
 * The Toast configuration for success and error messages.
 * Aswell as the function to show the toast messages.
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
  )};
const showToast = (type="error", title="", message="") => {
         Toast.show({
           type,
           text1: title,
           text2: message,
           position: 'top',
         });
  };

//Type definition for the selected data
type SelectedData = {
  date: string;
  thingsLearned: string[];
  productivity: string | null;
  kcal: number | null;
  steps: number | null;
  workout: boolean;
  workoutDuration: number | null;
  workoutIntensity: string | null;
  sleepQuality: string | null; 
  socialInteractions: number | null;
  goodSocialInteractions: number | null;
  badSocialInteractions: number | null;
  somethingSpecial: string[];
  overallDayRating: number | null;
  workHours: number | null;
  sleepDuration: number | null;
  socialMediaUsageMorning: boolean | null;
  socialMediaUsageEvening: boolean | null;
  avoidedBadHabits: boolean | null;
};
     
  
  const [ dataSaved, setDataSaved ] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState<SelectedData>({
    date: new Date().toLocaleDateString(),
    thingsLearned: [],
    productivity: null,
    kcal: null,
    steps: null,
    workout: false,
    workoutDuration: null,
    workoutIntensity: null,
    sleepQuality: null,
    socialInteractions: null,
    goodSocialInteractions: null,
    badSocialInteractions: null,
    somethingSpecial: [],
    overallDayRating: null,
    workHours: null,
    sleepDuration: null,
    socialMediaUsageMorning: null,
    socialMediaUsageEvening: null,
    avoidedBadHabits: null,
  });


  const [ validEnumValues, setValidEnumValues ] = React.useState({
      productivity: ["bed", "battery-quarter","tasks", "chart-line", "rocket"],
      workoutType: ["none", "strength", "cardio", "flexibility"],
      sleepQuality: ["tired", "frown", "meh", "smile", "grin-beam"],
      workoutIntensity: ["snowflake"	,"thermometer-empty", "thermometer-half", "thermometer-full", "fire"],
  })

  /**
   * This function adds a new entry to the database.
   * It transforms the selected data into the format required by the database.
   * It also shows a toast message on success or error.
   */
  async function makeEntry(transformedData: any) {
      try{
      const transformedData = {
          date: selectedData.date,

          workHours: selectedData.workHours,
          thingsLearned: typeof selectedData.thingsLearned != "undefined" && selectedData.thingsLearned.length > 0 ? selectedData.thingsLearned : null,
          productivity: validEnumValues.productivity.indexOf(selectedData.productivity ?  selectedData.productivity : "") !== -1 ? validEnumValues.productivity.indexOf(selectedData.productivity ? selectedData.productivity : "") : null,
          
          sleepDuration: selectedData.sleepDuration,
          sleepQuality: validEnumValues.sleepQuality.indexOf(selectedData.sleepQuality ? selectedData.sleepQuality : "") !== -1 ? validEnumValues.sleepQuality.indexOf(selectedData.sleepQuality ? selectedData.sleepQuality : "" ) : null,
          kcal: selectedData.kcal,
          steps: selectedData.steps,
          workout: selectedData.workout,
          workoutDuration: selectedData.workoutDuration ? selectedData.workoutDuration : null,
          workoutIntensity: validEnumValues.workoutIntensity.indexOf(selectedData.workoutIntensity ? selectedData.workoutIntensity : "" ) !== -1 ? validEnumValues.workoutIntensity.indexOf(selectedData.workoutIntensity ? selectedData.workoutIntensity : "") : null,
          
          socialInteractions: selectedData.socialInteractions,
          goodSocialInteractions: selectedData.goodSocialInteractions,
          badSocialInteractions: selectedData.badSocialInteractions,
          socialMediaUsageMorning: selectedData.socialMediaUsageMorning,
          socialMediaUsageEvening: selectedData.socialMediaUsageEvening,
          avoidedBadHabits: selectedData.avoidedBadHabits,
          somethingSpecial: typeof selectedData.somethingSpecial != "undefined" && selectedData.somethingSpecial.length > 0 ? selectedData.somethingSpecial : null,

          
          overallDayRating: selectedData.overallDayRating,

      };
      console.log("Things learned wird so gespeichert:", transformedData.thingsLearned)
      await addEntry(transformedData);
      setDataSaved(true);
      showToast('success', t('home.toast.successTitle'), t('home.toast.successMessage') );

  }
  catch (error) {
    showToast('error', t('home.toast.errorTitle'), t('home.toast.errorMessage'));
  }
      setDataSaved(true); 
      showToast('success', t('data.toast.successTitle'), t('data.toast.successMessage'));
  }


    
  return ( 
    <SafeAreaView edges={['top']} className='flex-1 px-2 bg-gray-900'>
      <ScrollView className='flex-1 bg-gray-900'>
        <View className='flex-row justify-between items-center mb-2'>
            <CustomButton
                title={dataSaved ? selectedData.date + t('home.dateCompleated') : selectedData.date + t('home.saveData')}
                onPress={async() => { await  makeEntry(selectedData)}}
                isDisabled={isCompleated(selectedData) !== ""}
                aditionalStyles={`flex-1 mr-2 ${isCompleated(selectedData) !== "" ? "opacity-50" : ""}`}
            />
          <TouchableOpacity className=' p-2 rounded-full items-center justify-center' style={{backgroundColor:"#0c1f44ff" }} onPress={()=> router.push("/(profile)/profile")}>
              <Icon
              name="user-circle"
              size={25}
              color={"white"}
              />
          </TouchableOpacity>
        </View>
         <DiplayAndEditDay
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            validEnumValues={validEnumValues}
        />
        <View className=' mb-4 mt-2 '>
            <CustomButton
                title={ isCompleated(selectedData) === "" ? dataSaved? t ('home.updateData') : t ('home.saveData') : `${t('home.missingData')} (${isCompleated(selectedData).length > 15 ? isCompleated(selectedData).slice(0, 15) + '...' : isCompleated(selectedData)})`}
                onPress={async() => { await  makeEntry(selectedData)}}
                isDisabled={isCompleated(selectedData) !== ""}
                aditionalStyles={`mb-4 w-full px-2 ${isCompleated(selectedData) !== "" ? "opacity-50" : ""}`}
            />
        </View>
      </ScrollView>
      <Toast config={toastConfig} />

    </SafeAreaView>
  )
}

export default Home