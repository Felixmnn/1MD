import { View, Text } from 'react-native'
import React from 'react'
import Icon from "@/components/gui/icon";

interface EnumVarProps {
  item: {
    name: string;
    type: string;
    options: string[];
    icons?: string[];
    iconLib?: string;
  }
}

const EnumVar: React.FC<EnumVarProps> = ({
    item
}) => {

  return (
    <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        //maxWidth:150,
        width: "100%",
        marginBottom: 10,
    }}>
        <Text className='flex-1 text-white text-lg font-bold text-[18px]'
            style={{lineHeight: 20}}
        >
        {item.name}
        </Text>
      <View className='flex-row justfiy-between items-center max-w-[200px]'>
        {
            item.options.map((option, index) =>
                <Icon
                    key={index}
                    set={item.iconLib as any || "FontAwesome5"}
                    name={item.icons ? item.icons[index] : option}
                    size={28}
                    color="white"
                    />
                )
        }
      </View>
    </View>
  )
}

export default EnumVar

