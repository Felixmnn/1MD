import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import CustomTextInput from '../gui/customTextInput'
import Icon from 'react-native-vector-icons/FontAwesome5'

const RenderInput = ({
    item,
    dataInputs,
    setDataInputs
}:{
    item: any,
    dataInputs?: { [key: string]: any },
    setDataInputs?: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}) => {
  return (
    <View>
        {item.type === "number" && <CustomTextInput
            placeholder={item.name}
            numeric={true}
            value={dataInputs ? String(dataInputs[item.key] || '') : ''}
            setValue={setDataInputs ? (value: string) => setDataInputs((prev) => ({ ...prev, [item.key]: value })) : undefined}
        />}
        {item.type === "bool" && <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-gray text-lg font-bold text-[18px]">
                      {item.name}
                    </Text>
                    <TouchableOpacity onPress={()=> {
                        console.log("💵Pressed");
                        if (setDataInputs) {
                            setDataInputs((prev) => ({
                                ...prev,
                                [item.key]: !(prev[item.key] || false)
                            }));
                        }
                    }}  >
                        <Icon
                        name={dataInputs && dataInputs[item.key]
                            ? 'check-square' : 'square'}
                        size={20}
                        color={dataInputs && dataInputs[item.key]
                            ? '#21449cff' : 'white'}
                        />
                    </TouchableOpacity>
                  </View>}
        {item.type === "enum" && 
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray text-lg font-bold text-[18px]">
                  {item.name}
                </Text>
                <View className="flex-row items-center">
                    {item.options && item.options.map((option: string, index: number) => (
                        <TouchableOpacity key={index} className="flex-row items-center mb-1 mx-2"
                            onPress={() => {
                                if (setDataInputs) {
                                    setDataInputs((prev) => ({
                                        ...prev,
                                        [item.key]: index
                                    }));
                                }
                            }}
                        >
                            <Icon name={"box"} size={16} color={
                                dataInputs && dataInputs[item.key] === index
                                ? "#10b981"
                                : "#6b7280"
                            } />
                    </TouchableOpacity>
                    ))}
                </View>
            </View>
        }
    </View>
  )
}

export default RenderInput