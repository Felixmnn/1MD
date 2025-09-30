import React, { useState } from 'react';
import { View, Text, ViewStyle, useWindowDimensions } from 'react-native';
import { DraggableGrid } from 'react-native-draggable-grid';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

interface GridItem {
  key: string;
  name: string;
  style?: ViewStyle; // individuelle Styles pro Item
}

export const MyTest: React.FC = () => {
  const {width} = useWindowDimensions();
  

  const [data, setData] = useState<GridItem[]>([
    { name: '1', key: 'one', style: { width: 80, height: 100, backgroundColor: 'transparent'  } },
    { name: '2', key: 'two', style: { width: 150, height: 100, backgroundColor: 'transparent' } },
    { name: '3', key: 'three', style: { width: 100, height: 100, backgroundColor: 'transparent' } },
    { name: "", key: 'empty', style: { width: 100, height: 100, backgroundColor: 'transparent' } },
    { name: "", key: 'empty2', style: { width: 100, height: 100, backgroundColor: 'transparent' } },
    { name: "", key: 'empty3', style: { width: 100, height: 100, backgroundColor: 'transparent' } },
    { name: "", key: 'empty4', style: { width: 100, height: 100, backgroundColor: 'transparent' } },
    { name: "", key: 'empty5', style: { width: 100, height: 100, backgroundColor: 'transparent' } },
    { name: "", key: 'empty6', style: { width: 100, height: 100, backgroundColor: 'transparent' } },
    { name: "", key: 'empty7', style: { width: 100, height: 100, backgroundColor: 'transparent' } },
    { name: "", key: 'empty8', style: { width: 100, height: 100, backgroundColor: 'transparent' } },
    { name: "", key: 'empty9', style: { width: 100, height: 100, backgroundColor: 'transparent' } },

  ]);

  const getIndexByKey = (key: string) => data.findIndex((item) => item.key === key);
  function getEmptyItemsInRow(key: string) {
    const index = getIndexByKey(key);
    if (getIndexByKey(key) % 3 === 0) {
      return data[index +1].name === "" && data[index +2].name === "" ? 2 : data[index +1].name === "" || data[index +2].name === "" ? 1 : 0;
    } else if (getIndexByKey(key) % 3 === 1) {
      return data[index -1].name === "" && data[index +1].name === "" ? 2 : data[index -1].name === "" || data[index +1].name === "" ? 1 : 0;
    } else {
      return data[index -1].name === "" && data[index -2].name === "" ? 2 : data[index -1].name === "" || data[index -2].name === "" ? 1 : 0;
    }
  }

  const renderItem = (item: GridItem) => (
    <View
      key={item.key}
      style={{
        height: 100,
        borderRadius: 8,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        
        ...(item.style || {}), // überschreibt Standard
        ...({
          width: item.name == "" ? getEmptyItemsInRow(item.key) == 1 ? (width / 2) - 20 : width -20 :  width / 2 - 20
        }),
      }
    
    }
    >
      {
        item.name !== "" && 
          <View className='bg-blue-500'
            style={{
              width: "100%",
              height: 100,
              marginLeft: getEmptyItemsInRow(item.key) == 2 ?
                          getIndexByKey(item.key) % 3 === 0 ? width / 3
                          ? getIndexByKey(item.key) % 3 === 2 ? - width / 3
                          : 0 : 0 : 0 : 0
              }}

          >
          </View>
      }
      
    </View>
  );

  return (
    <View
      style={{
        paddingTop: 100,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <DraggableGrid
        numColumns={2}
        renderItem={renderItem}
        data={data}
        onDragRelease={(newData) => setData(newData)}
      />
    </View>
  );
};
