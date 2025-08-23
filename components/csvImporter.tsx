import React from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import CustomButton from './customButton';
import { addEntry } from '@/database/setEntry';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

/**
 * Props for the CsvImportScreen Component
 * - `handleToast`: Optional function to display a toast message for success, error, or cancellation.
 */
type CsvImportScreenProps = {
  handleToast?: (type: 'success' | 'error' | 'cancelled') => void;
};

/**
 * CsvImportScreen Component
 * - Allows users to import data from a CSV file.
 * - Parses the CSV file and adds the data to the database.
 */
const CsvImportScreen: React.FC<CsvImportScreenProps> = ({
  handleToast = () => {},
}) => {
  const { t } = useTranslation();

  /**
   * handleImportCSV Function
   * - Handles the CSV import process.
   * - Opens a file picker, reads the selected file, parses its content, and adds entries to the database.
   */
  const handleImportCSV = async () => {
    console.log('Importing CSV...'); // Log the start of the import process
    try {
      // Open the document picker to select a CSV file
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'application/vnd.ms-excel'],
        copyToCacheDirectory: true,
      });

      // Check if the user canceled the file selection
      if (!result.canceled) {
        const fileUri = result.assets?.[0]?.uri;

        // Read the content of the selected file
        const content = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        // Define the structure of the CSV entries
        type EntryType = {
          date: string;
          workHours?: string;
          thingsLearned?: string;
          productivity?: string;
          sleepDuration?: string;
          sleepQuality?: string;
          kcal?: string;
          steps?: string;
          workout?: string;
          workoutDuration?: string;
          workoutIntensity?: string;
          socialInteractions?: string;
          goodSocialInteractions?: string;
          badSocialInteractions?: string;
          socialMediaUsageMorning?: string;
          socialMediaUsageEvening?: string;
          avoidedBadHabits?: string;
          somethingSpecial?: string;
          overallDayRating?: string;
        };

        // Parse the CSV content into an array of entries
        const parsed = Papa.parse<EntryType>(content, {
          header: true,
          skipEmptyLines: true,
        });

        // Iterate through the parsed data and add each entry to the database
        for (let i = 0; i < parsed.data.length; i++) {
          console.log(parsed.data[i]); // Log each entry for debugging
          try {
            await addEntry({
              date: parsed.data[i].date,
              workHours: parseInt(parsed.data[i].workHours ?? '') ?? 0,
              thingsLearned: parsed.data[i].thingsLearned ?? '',
              productivity: parseInt(parsed.data[i].productivity ?? '') ?? 0,
              sleepDuration: parseInt(parsed.data[i].sleepDuration ?? '') ?? -1,
              sleepQuality: parseInt(parsed.data[i].sleepQuality ?? '') ?? -1,
              kcal: parseInt(parsed.data[i].kcal ?? '') ?? -1,
              steps: parseInt(parsed.data[i].steps ?? '') ?? -1,
              workout: parsed.data[i].workout?.toLowerCase() === 'true',
              workoutDuration: parseInt(parsed.data[i].workoutDuration ?? '') ?? -1,
              workoutIntensity: parsed.data[i].workoutIntensity && parsed.data[i].workoutIntensity !== 'none'
                ? parseInt(parsed.data[i].workoutIntensity ?? '')
                : -1,
              socialInteractions: parseInt(parsed.data[i].socialInteractions ?? '') ?? -1,
              goodSocialInteractions: parseInt(parsed.data[i].goodSocialInteractions ?? '') ?? -1,
              badSocialInteractions: parseInt(parsed.data[i].badSocialInteractions ?? '') ?? -1,
              socialMediaUsageMorning: parsed.data[i].socialMediaUsageMorning?.toLowerCase() === 'true',
              socialMediaUsageEvening: parsed.data[i].socialMediaUsageEvening?.toLowerCase() === 'true',
              avoidedBadHabits: parsed.data[i].avoidedBadHabits?.toLowerCase() === 'true',
              somethingSpecial: parsed.data[i].somethingSpecial ?? '',
              overallDayRating: parseInt(parsed.data[i].overallDayRating ?? '') ?? -1,
            });
          } catch (error) {
            // Handle errors for individual entries
            handleToast('error');
          }
        }

        // Notify success after all entries are added
        handleToast('success');
        router.push("/")
      } else {
        // Notify cancellation if the user cancels the file selection
        console.log('CSV import cancelled by user'); // Log cancellation
        handleToast('cancelled');
      }
    } catch (error) {
      // Handle any errors during the import process
      console.error('Error importing CSV:', error);
      handleToast('error');
    }
  };

  return (
    <CustomButton
      title={t('csvImport.importButton')} // Localized button title
      aditionalStyles="flex-1 m-1" // Additional styles for the button
      onPress={async () => {
        console.log('CSV import button pressed'); // Log button press
        await handleImportCSV(); // Trigger the CSV import process on button press
      }}
    />
  );
};

export default CsvImportScreen;