import React from 'react';
import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTranslation } from 'react-i18next';

import CustomButton from './customButton';
import { getAndTransformallEntries } from '@/database/setEntry';

/**
 * Props for the CsvExportScreen Component
 * - `handleToast`: Optional function to display a toast message for success or error.
 */
type CsvExportScreenProps = {
  handleToast?: (type: 'success' | 'error') => void;
};

/**
 * handleExportCSV Function
 * - Exports all entries from the database to a CSV file.
 * - Saves the file locally and shares it using the device's sharing options.
 * 
 * @param handleToast - Callback function to handle success or error toast messages.
 * @param t - Translation function for localized strings.
 */
export const handleExportCSV = async (
  handleToast: (csvExportStatus: 'success' | 'error') => void,
  t: (key: string) => string
) => {
  // Fetch and transform all entries from the database
  const allEntries = await getAndTransformallEntries();

  // Convert the entries to a CSV string
  const csv = Papa.unparse(allEntries);

  // Generate a file name with the current date
  const date = new Date().toISOString().split('T')[0];
  const fileUri = FileSystem.cacheDirectory + `1MD_Backup_${date}.csv`;

  try {
    // Write the CSV data to a file
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Verify the file exists
    await FileSystem.getInfoAsync(fileUri);

    // Share the file if sharing is available
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: t('csvExport.shareDialogTitle'),
      });
      handleToast('success'); // Notify success
    } else {
      handleToast('error'); // Notify error if sharing is unavailable
    }
  } catch (error) {
    // Handle any errors during the export process
    handleToast('error');
  }
};

/**
 * CsvExportScreen Component
 * - Displays a button to export data to a CSV file.
 * - Uses the `handleExportCSV` function to perform the export.
 */
const CsvExportScreen: React.FC<CsvExportScreenProps> = ({
  handleToast = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <CustomButton
      title={t('csvExport.exportButton')} // Localized button title
      aditionalStyles="flex-1 m-1" // Additional styles for the button
      onPress={() => handleExportCSV(handleToast, t)} // Trigger CSV export on button press
    />
  );
};

export default CsvExportScreen;