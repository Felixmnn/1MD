import { View, Text, TextInput } from 'react-native';
import React from 'react';
import { isNumber } from '@/functions/numbers';
import { useGlobalContext } from '../context/GlobalProvider';

/**
 * CustomTextInput Component
 * - A reusable styled `TextInput` field.
 * - Supports numeric input validation, secure text entry, and dynamic styling.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} [props.numeric=false] - If true, the input will only accept numeric values.
 * @param {boolean} [props.compleated=false] - If true, applies a "completed" style to the input.
 * @param {string} [props.placeholder=''] - Placeholder text for the input field.
 * @param {string} props.value - The current value of the input field.
 * @param {Function} props.setValue - Callback function to update the input value.
 * @param {string} [props.aditionalStyles=''] - Additional styles for the input field.
 * @param {string} [props.valueAdition=''] - Additional value to display alongside the input.
 * @param {boolean} [props.successColor=false] - If true, applies a success color to the input.
 * @param {boolean} [props.dateInput=false] - If true, disables numeric validation for date inputs.
 * @param {boolean} [props.secureTextEntry=false] - If true, hides the input text (e.g., for passwords).
 */
const CustomTextInput = ({
  numeric = false,
  compleated = false,
  placeholder = '',
  value = '',
  setValue,
  aditionalStyles = '',
  valueAdition = '',
  successColor = false,
  dateInput = false,
  secureTextEntry = false,
}: {
  numeric?: boolean;
  compleated?: boolean;
  placeholder?: string;
  value: string;
  setValue: (text: string) => void;
  aditionalStyles?: string;
  valueAdition?: string;
  successColor?: boolean;
  dateInput?: boolean;
  secureTextEntry?: boolean;
}) => {
  // State to track whether the input is focused
  const [isFocussed, setIsFocused] = React.useState(false);
  const { colorTheme, setColorTheme, themeColors } = useGlobalContext();

  return (
    <TextInput
      // Dynamic class names for styling
      className={`p-2 rounded-md 
        ${aditionalStyles}
        ${numeric && !isNumber(value) && !dateInput ? 'text-red-600' : 'text-white'}
      `}
      // Inline styles for dynamic background and border colors
      style={{
        backgroundColor: successColor
          ? '#12512aff'
          : compleated
          ?   themeColors[colorTheme].button
          :   themeColors[colorTheme].card,
        borderWidth: isFocussed ? 0 : 2,
        borderColor: successColor
          ? 'green'
          : isFocussed
          ? undefined
          : themeColors[colorTheme].button
        
      } as any}
      // Event handlers for focus and blur
      onFocus={() => setIsFocused(false)}
      onBlur={() => setIsFocused(true)}
      // Keyboard type based on the `numeric` prop
      keyboardType={numeric ? 'numeric' : 'default'}
      // Placeholder text and color
      placeholder={placeholder}
      placeholderTextColor="#fff"
      // Input value and change handler
      value={value}
      onChangeText={(text) => setValue(text)}
      // Secure text entry for password-like inputs
      secureTextEntry={secureTextEntry}
    />
  );
};

export default CustomTextInput;