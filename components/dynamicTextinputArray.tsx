import { View, Text } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import CustomTextInput from "./customTextInput";
import { useTranslation } from "react-i18next";

/**
 * Props for the DynamicTextInputArray Component
 * - `arrayToEdit`: Specifies which array to edit (e.g., "thingsLearned" or "somethingSpecial").
 * - `stringArray`: The current array of strings to display and edit.
 * - `setStringArray`: Callback function to update the array of strings.
 * - `title`: Title for the section.
 * - `selectedData`: Object containing the current data for "thingsLearned" and "somethingSpecial".
 * - `setSelectedData`: Callback function to update the `selectedData` object.
 */
type DynamicTextInputArrayProps = {
  arrayToEdit?: "thingsLearned" | "somethingSpecial";
  stringArray: string[];
  setStringArray: (arr: string[]) => void;
  title?: string;
  selectedData: {
    thingsLearned: string[];
    somethingSpecial: string[];
  };
  setSelectedData: (
    data: { thingsLearned: string[]; somethingSpecial: string[] }
  ) => void;
};

/**
 * DynamicTextInputArray Component
 * - A reusable component for dynamically managing an array of text inputs.
 * - Allows adding, editing, and removing items from the array.
 */
const DynamicTextInputArray: React.FC<DynamicTextInputArrayProps> = ({
  arrayToEdit = "thingsLearned",
  stringArray = [],
  setStringArray,
  title = "",
  selectedData,
  setSelectedData,
}) => {

  const {t} = useTranslation();
  return (
    <View className="px-2">
      {/* Section Title and Add Button */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white text-lg font-bold text-[18px]">
          {title}
        </Text>
        <Icon
          name="plus"
          size={20}
          color="white"
          onPress={() => {
            // Add a new empty string to the selected array
            if (arrayToEdit === "thingsLearned") {
              setSelectedData({
                ...selectedData,
                thingsLearned: [...selectedData.thingsLearned, ""],
              });
            } else if (arrayToEdit === "somethingSpecial") {
              setSelectedData({
                ...selectedData,
                somethingSpecial: [...selectedData.somethingSpecial, ""],
              });
            }
          }}
        />
      </View>

      {/* Render the Array of Text Inputs */}
      <View>
        {stringArray.map((item, index) => (
          <View
            className="flex-row items-center justify-between"
            key={index}
          >
            {/* Editable Text Input */}
            <CustomTextInput
              value={item}
              setValue={(value: string) => {
                // Update the value of the specific item in the array
                const newArray = [...stringArray];
                newArray[index] = value;
                setStringArray(newArray);
              }}
              placeholder={""} // Placeholder text
              aditionalStyles="mb-2 flex-1" // Additional styles for the input
              compleated={item.length > 0} // Mark as completed if the input is not empty
            />
            {/* Delete Button */}
            <Icon
              name="trash"
              size={20}
              color="gray"
              onPress={() => {
                // Remove the specific item from the array
                const newArray = stringArray.filter((_, i) => i !== index);
                setStringArray(newArray);
              }}
              style={{
                marginLeft: 8,
                marginBottom: 4,
                alignSelf: "center",
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default DynamicTextInputArray;