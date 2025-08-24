import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast, { BaseToast, ToastConfigParams } from 'react-native-toast-message';

import CsvImportScreen from '@/components/csvImporter';
import CsvExportScreen from '@/components/csvExporter';
import { addEntry, getAllEntries, getEntryForDate } from '@/database/setEntry';
import CustomTextInput from '@/components/customTextInput';
import CustomBottomSheet, { CustomBottomSheetRef } from '@/components/customBottomSheet';
import DiplayAndEditDay from '@/components/diplayAndEditDay';
import CustomButton from '@/components/customButton';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';

/**
 * The Data component is the page where users can view and edit past diary entries.
 * It allows users to filter entries by date, view details of each entry,
 * Note: This component aditionally includes the import and export functionalitys wich are also provided in the Profile section.
 */
const Data = () => {
  const { t } = useTranslation();
  const bottomSheetRef = useRef<CustomBottomSheetRef>(null);
  const numColumns = Math.floor(Dimensions.get('window').width / 100);
  const [ filterDay, setFilterDay ] = useState("");

  type DiaryEntry = {
    date: string;
    thingsLearned: any[];
    productivity: string | null;
    kcal: any;
    steps: any;
    workout: boolean | null;
    workoutDuration: any;
    workoutIntensity: any;
    sleepQuality: string | null;
    socialInteractions: any;
    goodSocialInteractions: any;
    badSocialInteractions: any;
    somethingSpecial: any[];
    overallDayRating: any;
    workHours: any;
    sleepDuration: any;
    socialMediaUsageMorning: boolean | null;
    socialMediaUsageEvening: null | boolean;
    avoidedBadHabits: boolean | null;
  };
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
  const [pastEntries, setPastEntries] = useState<DiaryEntry[]>([]);
  
  //Config for the Toast messages
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
   * This Effect fetches all diary entries when the component mounts or when the screen is focused.
   */
  const isFocused = useIsFocused(); 
  useEffect(() => {
  if (isFocused) {
    const fetchData = async () => {
      const allEntries = await getAllEntries();
      const sortedEntries = [...allEntries].sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split(".");
        const [dayB, monthB, yearB] = b.date.split(".");

        const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
        const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

        return dateB.getTime() - dateA.getTime(); 
      });

      setPastEntries(sortedEntries);
    };

    fetchData();
  }
}, [isFocused]);

  /**
   * The constants below are used to define the valid enum values for various diary entry fields and the colors for overall day ratings.
   */
  const [ validEnumValues, setValidEnumValues ] = React.useState({
      productivity: ["bed", "battery-quarter","tasks", "chart-line", "rocket"],
      workoutType: ["none", "strength", "cardio", "flexibility"],
      sleepQuality: ["tired", "frown", "meh", "smile", "grin-beam"],
      workoutIntensity: ["snowflake"	,"thermometer-empty", "thermometer-half", "thermometer-full", "fire"],
  })
  const overallDayRatingColors = [
    "#d83a3a", 
    "#caa63c", 
    "#2f974d",
    "#2fa3b5", 
    "#2f6cb5"  
  ];
  const overallDayRatingColorsBackground = [
    "#962828",
    "#8d752a",
    "#206f38",
    "#207782",
    "#204a82" 
  ];
  const overallDayRatingIcons = ['frown', 'meh', 'smile', 'grin', 'grin-beam'];


  /**
   * The data is initialized as a list of date/day ratings.
   * This function loads the entry for a specific date and sets the selected data state.
   * @param {DiaryEntry} item - The diary entry to load containing the date wich is the key for the entry
   */
  async function loadEntry(item: DiaryEntry) {
      bottomSheetRef.current?.openSheet(0);
      let todayEntry = await getEntryForDate(item.date);
      if (!todayEntry) {
        todayEntry = {
          date: item.date,
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
          socialMediaUsageMorning: false,
          socialMediaUsageEvening: false,
          avoidedBadHabits: false
        };
      }
        try {
          setSelectedData({
          ...selectedData,
          date: todayEntry.date,
          thingsLearned: todayEntry.thingsLearned ?? [],
          somethingSpecial: todayEntry.somethingSpecial ?? [],
          overallDayRating: todayEntry.overallDayRating ?? null,
          sleepQuality: typeof todayEntry.sleepQuality === 'number' ? validEnumValues.sleepQuality[todayEntry.sleepQuality] : null,
          productivity: todayEntry.productivity != null ? validEnumValues.productivity[todayEntry.productivity] : null,
          workout: todayEntry.workout ?? false,
          workoutIntensity: todayEntry.workoutIntensity != null ? validEnumValues.workoutIntensity[todayEntry.workoutIntensity] : null,
          workoutDuration: todayEntry.workoutDuration ?? null,
          sleepDuration: todayEntry.sleepDuration ?? null,
          kcal: todayEntry.kcal ?? null,
          steps: todayEntry.steps ?? null,
          workHours: todayEntry.workHours ?? null,
          socialInteractions: todayEntry.socialInteractions ?? null,
          goodSocialInteractions: todayEntry.goodSocialInteractions ?? null,
          badSocialInteractions: todayEntry.badSocialInteractions ?? null,
          socialMediaUsageMorning: todayEntry.socialMediaUsageMorning ?? false,
          socialMediaUsageEvening: todayEntry.socialMediaUsageEvening ?? false,
          avoidedBadHabits: todayEntry.avoidedBadHabits ?? false,
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: t('data.toast.errorTitle'),
          text2: t('data.toast.errorMessage')
        });
    }}

  /**
   * This function updates the selected entry with new data.
   * It transforms the data to match the expected format and updates the state.
   */
  async function updateSpecificEntry(date: string, newData: Partial<SelectedData>) {
    try {
      const transformedData = {
        date: selectedData.date,
        thingsLearned: selectedData.thingsLearned,
        productivity: selectedData.productivity ? validEnumValues.productivity.indexOf(selectedData.productivity) : null,
        kcal: selectedData.kcal,
        steps: selectedData.steps,
        workout: selectedData.workout,
        workoutDuration: selectedData.workoutDuration,
        workoutIntensity: selectedData.workoutIntensity,
        sleepQuality: selectedData.sleepQuality ? validEnumValues.sleepQuality.indexOf(selectedData.sleepQuality) : null,
        socialInteractions: selectedData.socialInteractions,
        goodSocialInteractions: selectedData.goodSocialInteractions,
        badSocialInteractions: selectedData.badSocialInteractions,
        somethingSpecial: selectedData.somethingSpecial,
        overallDayRating: selectedData.overallDayRating ,
        workHours: selectedData.workHours,
        sleepDuration: selectedData.sleepDuration,
        socialMediaUsageMorning: selectedData.socialMediaUsageMorning,
        socialMediaUsageEvening: selectedData.socialMediaUsageEvening,
        avoidedBadHabits: selectedData.avoidedBadHabits ? true : false
      };
      setPastEntries((prevEntries) => {
        const updatedEntries = prevEntries.map(entry => 
          entry.date === selectedData.date
            ? {
                ...entry,
                ...transformedData,
                productivity: transformedData.productivity !== null && transformedData.productivity !== undefined
                  ? validEnumValues.productivity[transformedData.productivity as number]
                  : null,
                sleepQuality: transformedData.sleepQuality !== null && transformedData.sleepQuality !== undefined
                  ? validEnumValues.sleepQuality[transformedData.sleepQuality as number]
                  : null,
                workoutIntensity: transformedData.workoutIntensity !== null && transformedData.workoutIntensity !== undefined
                  ? validEnumValues.workoutIntensity[(transformedData.workoutIntensity as unknown) as number]
                  : null,
              }
            : entry
        );
        return updatedEntries;
      });
      await addEntry(transformedData);
      Toast.show({
        type: 'success',
        text1: t('data.toast.successTitle'),
        text2: t('data.toast.successMessage')
      });
    } catch (error) {
        Toast.show({
          type: 'error',
          text1: t('data.toast.errorTitle'),
          text2: t('data.toast.errorMessage')
        });
    }}

  return (
    <SafeAreaView  edges={['top']} className="flex-1   bg-gray-900">
      <CustomTextInput
        placeholder={t('data.filterPlaceholder')}
        value={filterDay}
        numeric={true}
        setValue={(text: string) => setFilterDay(text)}
        aditionalStyles=' my-2 mx-2'
        dateInput={true}
      />
      <FlatList
        data={pastEntries.filter(item => item.date.includes(filterDay))}
        keyExtractor={(item) => item.date}
        numColumns={numColumns}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10 m-2 rounded-lg"
            style={{ backgroundColor: '#0c1f44ff' }}
          >
            <Icon
              name="calendar"
              size={48}
              color="#facc15"
            />
            <Text className="text-yellow-400 text-lg font-semibold mt-3">
              {t('data.noEntriesTitle')}
            </Text>
            <Text className="text-yellow-400 text-sm mt-1 text-center px-6" onPress={() => router.push("/home")}>
              {t('data.noEntriesMessage')}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={async() => {loadEntry(item)}}
            className="p-2 mb-2 mx-1 items-center flex-1 max-h-[60px] rounded-md"
            style={{
              backgroundColor: overallDayRatingColorsBackground[item.overallDayRating],
              marginHorizontal: 2,
            }}
          >
            <Text className="text-white">{item.date}</Text>
            <Icon
              name={overallDayRatingIcons[item.overallDayRating]}
              size={20}
              color={overallDayRatingColors[item.overallDayRating]}
            />
          </TouchableOpacity>
        )}
      /> 
      <View className="flex-row w-full justify-between p-2">
        <CsvImportScreen />
        <CsvExportScreen />
      </View>
      <CustomBottomSheet ref={bottomSheetRef}>
        <View className='flex-1'>
          <View className='flex-row justify-between items-center'>
            <CustomButton
                title={selectedData.date ? `${selectedData.date} ${t('data.bottomSheet.complete')}` : selectedData.date}
                 onPress={async () => { updateSpecificEntry(selectedData.date, selectedData)}}
                  aditionalStyles='mb-2 w-full px-2'
            />
            
          </View> 
      <DiplayAndEditDay
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        validEnumValues={validEnumValues}
      />
        </View>
    <CustomButton
      title={selectedData.date === "" ? t('data.buttons.saveData') : t('data.buttons.updateData', { date: selectedData.date })}
      onPress={async () => { updateSpecificEntry(selectedData.date, selectedData)}}
      aditionalStyles='mb-4 w-full px-2'
    />
      </CustomBottomSheet> 
      <Toast config={toastConfig} />
    </SafeAreaView>

  );
};

export default Data;
