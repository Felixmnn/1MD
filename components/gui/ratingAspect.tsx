import { View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

/**
 * Props for the RatingAspect Component
 * - `options`: Array of string options representing the rating icons.
 * - `selectedValue`: The currently selected value.
 * - `setSelectedValue`: Callback function to update the selected value.
 * - `iconSize`: Optional size of the icons (default is 28).
 * - `color`: Optional color for the selected icon (default is `#21449cff`).
 */
type RatingAspectProps = {
  options: string[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  iconSize?: number;
  color?: string;
};

/**
 * RatingAspect Component
 * - Displays a row of icons for rating selection.
 * - Highlights the selected icon and allows users to select a rating.
 */
const RatingAspect: React.FC<RatingAspectProps> = ({
  options = [],
  selectedValue = '',
  setSelectedValue = () => {},
  iconSize = 28,
  color = '#21449cff',
}) => {
  return (
    <View className="flex-row items-center justify-between mb-2">
      {/* Render the list of rating icons */}
      <View className="flex-row items-center justify-start flex-wrap">
        {options.map((option) => (
          <Icon
            key={option} // Unique key for each icon
            name={option} // Icon name
            size={iconSize} // Icon size
            color={selectedValue === option ? color : 'white'} // Highlight selected icon
            onPress={() => setSelectedValue(option)} // Update selected value on press
            style={{ marginLeft: 8, marginHorizontal: 4 }} // Spacing between icons
          />
        ))}
      </View>
    </View>
  );
};

export default RatingAspect;