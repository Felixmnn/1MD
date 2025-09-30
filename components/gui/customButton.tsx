import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../context/GlobalProvider';

/**
 * CustomButton is a reusable component for rendering a styled button.
 * It can be disabled and accepts additional styles.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} [props.isDisabled=false] - If true, the button will be disabled.
 * @param {string} [props.title='Press Me'] - The text displayed on the button.
 * @param {Function} [props.onPress] - Callback function to handle button press events.
 * @param {string} [props.aditionalStyles=''] - Additional styles to apply to the button.
 */
const CustomButton = ({
    isDisabled = false,
    title = 'Press Me',
    onPress,
    aditionalStyles = "",
    backgroundColor
}: {
    isDisabled?: boolean;
    title?: string;
    onPress?: () => void;
    aditionalStyles?: string;
    backgroundColor?: string;
}) => {
    const { colorTheme, setColorTheme, themeColors } = useGlobalContext();
  
  return (
    <TouchableOpacity
        className={`rounded-md w-64 p-2 ${aditionalStyles}`}
        disabled={isDisabled}
        style={{
            borderColor: themeColors[colorTheme].button ,
            backgroundColor: themeColors[colorTheme].button,
            borderWidth: 2,
            opacity: isDisabled ? 0.5 : 1,
        }}
        onPress={onPress}
    >
      <View className="flex items-center justify-center">
        <Text className="text-white font-semibold text-center ">{title}</Text>
      </View>
    </TouchableOpacity>

  )
}

export default CustomButton