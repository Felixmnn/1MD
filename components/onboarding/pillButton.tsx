import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome5'
import CustomBottomSheet from '../gui/customBottomSheet'

const PillButton = ({
    title = "Pill",
    color1 = "#252c43ff",
    color2 = '#2d354bff',
    borderColor = '#12116bff',
    onPress = () => { },
    small = false,
    selected = true,
    type= "",
    border = false,
}) => {

    function returnMatchingEmoji(itemType: string) {
        switch (itemType) {
            case "enum":
                return " 📊";
            case "number":
                return " 🔢";
            case "bool":
                return " 🔀";
            case "array":
                return " 📋";
            default:
                return "";
        }
      }
  return (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{
            borderRadius: small ? 8 :25,

            overflow: 'hidden',
            marginHorizontal: small ? 4 : 2,
            marginVertical: small ? 4 : 5,
        }}
        >
        <LinearGradient
            colors={[color1, color2]} // dunkelblauer Verlauf
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                paddingVertical: small ? 6 : 8,
                paddingHorizontal: small ? 6 : 15,
                borderRadius: small ? 8 :25,
                
                alignItems: 'center',
                flexDirection: "row"
            }}
        >   
        
            <Text
            style={{
                color: '#fff',
                fontSize: small ? 14 : 16,
                fontWeight: 'bold',
                letterSpacing: 1,
            }}
            >
            {title} {type && returnMatchingEmoji(type)}
            </Text>
           
        </LinearGradient>
        
    </TouchableOpacity>
  )
}

export default PillButton