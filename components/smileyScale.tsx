import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

/**
 * Props for the SmileyScale Component
 * - `selectedSmiley`: The index of the currently selected smiley (default is 0).
 * - `setSelectedSmiley`: Callback function to update the selected smiley index.
 */
type SmileyScaleProps = {
  selectedSmiley?: number;
  setSelectedSmiley?: (index: number) => void;
};

/**
 * SmileyScale Component
 * - A reusable component that displays a scale of smiley faces.
 * - Users can select a smiley to indicate their mood or satisfaction level.
 */
const SmileyScale: React.FC<SmileyScaleProps> = ({
  selectedSmiley = 0,
  setSelectedSmiley,
}) => {
  // Array of smiley configurations
  const smileys = [
    { name: "frown", smileyColor: "#f00", smileyBackground: "#a41e29ff" },
    { name: "meh", smileyColor: "#d7ba62ff", smileyBackground: "#c6a539ff" },
    { name: "smile", smileyColor: "#28a745", smileyBackground: "#227135ff" },
    { name: "grin", smileyColor: "#43bcceff", smileyBackground: "#1997adff" },
    { name: "grin-beam", smileyColor: "#007bff", smileyBackground: "#0b3868ff" },
  ];

  return (
    <View className="flex-row items-center justify-between rounded-md">
      {/* Render each smiley as a selectable button */}
      {smileys.map((smiley, index) => (
        <TouchableOpacity
          key={index} // Unique key for each smiley
          onPress={() => setSelectedSmiley && setSelectedSmiley(index)} // Update selected smiley on press
          className="flex items-center rounded-lg p-2 m-1"
          style={{
            backgroundColor: smiley.smileyBackground, // Background color for the smiley
            opacity: selectedSmiley === index ? 1 : 0.3, // Highlight the selected smiley
          }}
        >
          <Icon
            name={smiley.name} // Icon name
            size={30} // Icon size
            color={smiley.smileyColor} // Icon color
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SmileyScale;