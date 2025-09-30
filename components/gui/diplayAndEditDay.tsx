import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CustomTextInput from '../gui/customTextInput';
import SmileyScale from './smileyScale';
import RatingAspect from './ratingAspect';
import DynamicTexinputArray from '../gui/dynamicTextinputArray';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { isCompleated, workConditions, physicalHealthConditions, mentalHealthConditions } from '@/functions/homeCondtions';
import { useGlobalContext } from '../context/GlobalProvider';

/**
 * Props for the DiplayAndEditDay Component
 * - `selectedData`: Object containing the current day's data.
 * - `setSelectedData`: Function to update the selected day's data.
 * - `validEnumValues`: Object containing valid enum values for dropdowns.
 */
type Props = {
  selectedData: any;
  setSelectedData: (data: any) => void;
  validEnumValues: {
    productivity: string[];
    sleepQuality: string[];
    workoutIntensity: string[];
  };
};

/**
 * DiplayAndEditDay Component
 * - Displays and allows editing of a day's data.
 * - Divided into sections: Work, Physical Health, and Mental Health.
 * - Uses various input components for data entry and selection.
 */
const DiplayAndEditDay: React.FC<Props> = ({
  selectedData,
  setSelectedData,
  validEnumValues,
}) => {
  const { t } = useTranslation();
  const { themeColors, colorTheme } = useGlobalContext();
  // Labels and section titles from translations
  const labels = t('displayAndEditData.fields', { returnObjects: true }) as {
    [key: string]: { label: string; placeholder?: string };
  };
  const sections = t('displayAndEditData.sections', { returnObjects: true }) as {
    work: string;
    physicalHealth: string;
    mentalHealth: string;
  };

  
  return (
    <View>
      {/* Work Section */}
      <View
        className={`px-2 mb-4 rounded-lg py-2 ${
          selectedData.workHours !== null && selectedData.productivity !== null
            ? 'rounded-[10px]  bg-blue-900'
            : 'rounded-[10px] '
        }`}
        style={{
          backgroundColor:
            selectedData.workHours !== null && selectedData.productivity
              ? themeColors[colorTheme].button
              : themeColors[colorTheme].buttonBackground,
        }}
      >
        <Text className="text-white text-lg font-bold text-[18px] mb-2">
          {sections.work}
        </Text>
        <View className="flex-row w-full items-center justify-between mb-2">
          {/* Work Hours Input */}
          <CustomTextInput
            compleated={selectedData.workHours !== null}
            numeric
            placeholder={labels.workHours.label}
            value={selectedData.workHours?.toString() || ''}
            setValue={(value: string) =>
              setSelectedData({
                ...selectedData,
                workHours: value === '0' ? 0 : parseFloat(value) || null,
              })
            }
            aditionalStyles="mb-2 flex-1 mr-2"
            
          />
          {/* Productivity Rating */}
          <RatingAspect
            options={validEnumValues.productivity}
            selectedValue={selectedData.productivity}
            setSelectedValue={(value: string) =>
              setSelectedData({ ...selectedData, productivity: value })
            }
            iconSize={25}
            color="#21449cff"
          />
        </View>
        {/* Things Learned Input */}
        <DynamicTexinputArray
          stringArray={selectedData.thingsLearned}
          setStringArray={(arr) =>
            setSelectedData({ ...selectedData, thingsLearned: arr })
          }
          title={labels.thingsLearned.label}
          arrayToEdit="thingsLearned"
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
      </View>

      {/* Physical Health Section */}
      <View
        className={`px-2 mb-4 py-2 rounded-lg ${
          physicalHealthConditions(selectedData)
            ? '  bg-blue-900'
            : ' '
        }`}
        style={{
          backgroundColor: physicalHealthConditions(selectedData)
            ? themeColors[colorTheme].button
            : themeColors[colorTheme].buttonBackground,
        }}
      >
        <Text className="text-white text-lg font-bold text-[18px] mb-2">
          {sections.physicalHealth}
        </Text>
        <View className="flex-row w-full items-center justify-between mb-2">
          {/* Sleep Duration Input */}
          <CustomTextInput
            numeric
            compleated={selectedData.sleepDuration !== null}
            placeholder={labels.sleepDuration.label}
            value={selectedData.sleepDuration?.toString() || ''}
            setValue={(value: string) =>
              setSelectedData({
                ...selectedData,
                sleepDuration: value === '0' ? 0 : parseFloat(value) || null,
              })
            }
            aditionalStyles="mb-2 flex-1 mr-2"
          />
          {/* Sleep Quality Rating */}
          <RatingAspect
            options={validEnumValues.sleepQuality}
            selectedValue={selectedData.sleepQuality}
            setSelectedValue={(value: string) =>
              setSelectedData({ ...selectedData, sleepQuality: value })
            }
            iconSize={25}
            color="#21449cff"
          />
        </View>
        <View className="flex-row w-full items-center justify-between mb-2">
          {/* Calories Input */}
          <CustomTextInput
            numeric
            compleated={selectedData.kcal !== null}
            placeholder={labels.kcal.placeholder}
            value={selectedData.kcal?.toString() || ''}
            setValue={(value: string) =>
              setSelectedData({
                ...selectedData,
                kcal: value === '0' ? 0 : parseInt(value) || null,
              })
            }
            aditionalStyles="mb-2 flex-1 mr-2"
          />
          {/* Steps Input */}
          <CustomTextInput
            numeric
            compleated={selectedData.steps !== null}
            placeholder={labels.steps.placeholder}
            value={selectedData.steps?.toString() || ''}
            setValue={(value: string) =>
              setSelectedData({
                ...selectedData,
                steps: value === '0' ? 0 : parseInt(value) || null,
              })
            }
            aditionalStyles="mb-2 flex-1"
          />
        </View>
        {/* Workout Section */}
        <View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-lg font-bold text-[18px]">
              {labels.workout.label}
            </Text>
            <Icon
              name={selectedData.workout ? 'check-square' : 'square'}
              size={20}
              color={selectedData.workout ? '#21449cff' : 'white'}
              onPress={() =>
                setSelectedData({
                  ...selectedData,
                  workout: !selectedData.workout,
                })
              }
            />
          </View>
          {selectedData.workout && (
            <View className="flex-row items-center justify-between mb-2">
              {/* Workout Duration Input */}
              <CustomTextInput
                numeric
                compleated={selectedData.workoutDuration !== null}
                placeholder={labels.workoutDuration.label}
                value={selectedData.workoutDuration?.toString() || ''}
                setValue={(value: string) =>
                  setSelectedData({
                    ...selectedData,
                    workoutDuration:
                      value === '0' ? 0 : parseInt(value) || null,
                  })
                }
                aditionalStyles="mb-2 flex-1 mr-2"
              />
              {/* Workout Intensity Rating */}
              <RatingAspect
                options={validEnumValues.workoutIntensity}
                selectedValue={selectedData.workoutIntensity}
                setSelectedValue={(value: string) =>
                  setSelectedData({
                    ...selectedData,
                    workoutIntensity: value,
                  })
                }
                iconSize={25}
                color="#b03722ff"
              />
            </View>
          )}
        </View>
      </View>

      {/* Mental Health Section */}
      <View
        className={`px-2 mb-4 py-2 rounded-lg ${
          mentalHealthConditions(selectedData)
            ? 'rounded-[10px] py-2 bg-blue-900'
            : ''
        }`}
       style={{
          backgroundColor: mentalHealthConditions(selectedData)
            ? themeColors[colorTheme].button
            : themeColors[colorTheme].buttonBackground,
        }}
      >
        <Text className="text-white text-lg font-bold text-[18px] mb-2">
          {sections.mentalHealth}
        </Text>
        <View className="flex-row items-center justify-between mb-2">
          {/* Social Interactions Input */}
          <CustomTextInput
            numeric
            compleated={selectedData.socialInteractions !== null}
            placeholder={labels.socialInteractions.label}
            value={selectedData.socialInteractions?.toString() || ''}
            setValue={(value: string) =>
              setSelectedData({
                ...selectedData,
                socialInteractions:
                  value === '0' ? 0 : parseInt(value) || null,
              })
            }
            aditionalStyles="mb-2 w-1/2 mr-2"
          />
          {/* Good Social Interactions Input */}
          <CustomTextInput
            numeric
            compleated={selectedData.goodSocialInteractions !== null}
            placeholder={labels.goodSocialInteractions.label}
            value={selectedData.goodSocialInteractions?.toString() || ''}
            setValue={(value: string) =>
              setSelectedData({
                ...selectedData,
                goodSocialInteractions:
                  value === '0' ? 0 : parseInt(value) || null,
              })
            }
            aditionalStyles="mb-2 flex-1 mr-2"
          />
          {/* Bad Social Interactions Input */}
          <CustomTextInput
            numeric
            compleated={selectedData.badSocialInteractions !== null}
            placeholder={labels.badSocialInteractions.label}
            value={selectedData.badSocialInteractions?.toString() || ''}
            setValue={(value: string) =>
              setSelectedData({
                ...selectedData,
                badSocialInteractions:
                  value === '0' ? 0 : parseInt(value) || null,
              })
            }
            aditionalStyles="mb-2 flex-1 mr-2"
          />
        </View>

        {/* Social Media Usage & Bad Habits */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white text-lg font-bold text-[18px]">
            {labels.socialMediaUsageMorning.label}
          </Text>
          <Icon
            name={
              selectedData.socialMediaUsageMorning ? 'check-square' : 'square'
            }
            size={20}
            color={
              selectedData.socialMediaUsageMorning ? '#21449cff' : 'white'
            }
            onPress={() =>
              setSelectedData({
                ...selectedData,
                socialMediaUsageMorning:
                  !selectedData.socialMediaUsageMorning,
              })
            }
          />
        </View>

        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white text-lg font-bold text-[18px]">
            {labels.socialMediaUsageEvening.label}
          </Text>
          <Icon
            name={
              selectedData.socialMediaUsageEvening ? 'check-square' : 'square'
            }
            size={20}
            color={
              selectedData.socialMediaUsageEvening ? '#21449cff' : 'white'
            }
            onPress={() =>
              setSelectedData({
                ...selectedData,
                socialMediaUsageEvening:
                  !selectedData.socialMediaUsageEvening,
              })
            }
          />
        </View>

        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white text-lg font-bold text-[18px]">
            {labels.avoidedBadHabits.label}
          </Text>
          <Icon
            name={selectedData.avoidedBadHabits ? 'check-square' : 'square'}
            size={20}
            color={selectedData.avoidedBadHabits ? '#21449cff' : 'white'}
            onPress={() =>
              setSelectedData({
                ...selectedData,
                avoidedBadHabits: !selectedData.avoidedBadHabits,
              })
            }
          />
        </View>

        {/* Something Special Input */}
        <DynamicTexinputArray
          stringArray={selectedData.somethingSpecial}
          setStringArray={(arr) =>
            setSelectedData({ ...selectedData, somethingSpecial: arr })
          }
          title={labels.somethingSpecial.label}
          arrayToEdit="somethingSpecial"
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
      </View>

      {/* Overall Day Rating */}
      <View
        className={`px-2 mb-4 py-2 rounded-lg ${
          selectedData.overallDayRating !== null
            ? 'rounded-[10px] py-2 bg-blue-900'
            : ''
        }`}
        style={{
          backgroundColor:
            selectedData.overallDayRating !== null 
            ? themeColors[colorTheme].button
            : themeColors[colorTheme].buttonBackground,
        }}
      >
        <Text className="text-white text-xl font-bold text-[18px] mb-2">
          {t(labels.overallDayRating.label)}
        </Text>
        <View className="items-center justify-start flex-row">
          <SmileyScale
            selectedSmiley={selectedData.overallDayRating}
            setSelectedSmiley={(index) =>
              setSelectedData({ ...selectedData, overallDayRating: index })
            }
          />
        </View>
      </View>
    </View>
  );
};

export default DiplayAndEditDay;