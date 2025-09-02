import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import PillButton from './pillButton';


type VariableItem = {
  name: string;
  type: string;
  options: string[];
  kategory: string;
};

const VariablesBox = ({
    title = "VariablesBox",
    items = [],
    onPressItem = (_item: VariableItem) => {},
    onPressMore = () => {},
    gradient1 = "#081648ff",
    gradient2 = "#0e2a6dff",
    done = false,
    onPressDone = () => {},
}: {
    title?: string;
    items?: VariableItem[];
    onPressItem?: (item: VariableItem) => void;
    onPressMore?: () => void;
    gradient1?: string;
    gradient2?: string;
    done?: boolean;
    onPressDone: () => void;
    }) => {

    const [collapsed, setCollapsed] = React.useState(false);
    
    

  return (
    <TouchableOpacity className='w-full px-2 mb-2' onPress={onPressMore}>
      <LinearGradient
            colors={["#1f2641ff", "#07214dff"]} // dunkelblauer Verlauf
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                paddingVertical: done ? 8 : 16,
                paddingHorizontal: 16,
                borderRadius: 12,
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#12116bff',
            }}
        >
          <View className='flex-row justify-between items-center '
            style={{
                marginBottom: done ? 0 : 6,
            }}
          >
        <Text className='text-2xl font-bold text-white'>{title}</Text>
        {
            done ?
            <TouchableOpacity onPress={onPressDone} className='bg-gray-700 px-3 py-1 rounded-full'>
                <Text className='text-white font-semibold'>Edit</Text>
            </TouchableOpacity>
            : 
            <TouchableOpacity onPress={onPressDone} className='bg-gray-700 px-3 py-1 rounded-full'>
                <Text className='text-white font-semibold'>Fertig</Text>
            </TouchableOpacity>
        }
        </View>
        { !done &&
            <View className="flex-1 flex-row flex-wrap">
                {
                 items.map((variable) => (
                    <PillButton
                        key={variable.name}
                        title={variable.name}
                        onPress={() => onPressItem(variable)}
                        small={true}
                        type={variable.type}
                        color1="#07214dff"
                        color2="#1f2641ff"
                    />
                 ))
                }
            </View>
        }

    </LinearGradient>
    </TouchableOpacity>
  )
}

export default VariablesBox