import { View, Text } from 'react-native';
import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useGlobalContext } from '../context/GlobalProvider';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Props for the CustomBottomSheet Component
 * - `children`: React children to be rendered inside the bottom sheet.
 */
type CustomBottomSheetProps = {
  children: React.ReactNode;
};

/**
 * Ref Type for the CustomBottomSheet Component
 * - `openSheet`: Function to open the bottom sheet at a specific index.
 * - `closeSheet`: Function to close the bottom sheet.
 */
export type CustomBottomSheetRef = {
  openSheet: (index?: number) => void;
  closeSheet: () => void;
};

/**
 * CustomBottomSheet Component
 * - A reusable bottom sheet component using `@gorhom/bottom-sheet`.
 * - Supports dynamic content and provides methods to open and close the sheet.
 */
const CustomBottomSheet = forwardRef<CustomBottomSheetRef, CustomBottomSheetProps>(
  ({ children }, ref) => {
    const { colorTheme, themeColors } = useGlobalContext();
    // Reference to the BottomSheet instance
    const sheetRef = useRef<BottomSheet>(null);

    // Snap points define the heights the bottom sheet can snap to
    const snapPoints = ['20%', '40%', '60%', '80%'];

    /**
     * Expose methods to the parent component using `useImperativeHandle`.
     * - `openSheet`: Opens the bottom sheet at the specified index (default is 0).
     * - `closeSheet`: Closes the bottom sheet.
     */
    useImperativeHandle(ref, () => ({
      openSheet: (index = 0) => {
        sheetRef.current?.snapToIndex(index);
      },
      closeSheet: () => {
        sheetRef.current?.close();
      },
    }));

    return (
      <BottomSheet
        ref={sheetRef} // Attach the reference to the BottomSheet
        index={-1} // Initially closed
        snapPoints={snapPoints} // Define snap points
        enablePanDownToClose={true} // Allow closing by swiping down
        handleIndicatorStyle={{ backgroundColor: '#fff' }} // Style for the drag indicator
        backgroundStyle={{ backgroundColor: themeColors[colorTheme].inaktivText }} // Background color of the sheet
      >
        {/* Scrollable content inside the bottom sheet */}
        <BottomSheetScrollView
          contentContainerStyle={{
            backgroundColor: themeColors[colorTheme].button,  
            paddingBottom: 40,
          }}
          style={{ backgroundColor: themeColors[colorTheme].button }}
          className="bg-gray-900 p-2"
          showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
        >
          
          {children}
          
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

export default CustomBottomSheet;