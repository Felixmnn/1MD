import { View, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native'
import React, { useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/gui/customButton'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome5'

const { width } = Dimensions.get('window')

const slides = [
  { id: '1', title: 'Your Personal Diary', description: 'Capture your day in seconds and see the bigger picture of your life.',icon: "book", color1: '#0a1e65ff', color2: '#0a1e65ff', x: 1, y: 1, x2: 0, y2: 0 },
  { id: '2', title: 'Smart Insights', description: 'We help you spot patterns and trends so you can understand yourself better.',icon: "search", color1: '#062da3ff', color2: '#0a1e65ff', x: 0, y: 1, x2: 1, y2: 0 },
  { id: '3', title: 'Actionable Advice', description: 'Based on your entries, get tips on how to improve habits and wellbeing.',icon:"bullseye", color1: '#0a1e65ff', color2: '#062da3ff', x: 1, y: 0, x2: 0, y2: 1 },
  { id: '4', title: 'Full Control', description: 'Your entries stay private. Nothing leaves your device without your permission.',icon:"lock" ,color1: '#0a1e65ff', color2: '#062da3ff', x : 0, y: 0, x2: 1, y2: 1 },
  { id: '5', title: 'Make It a Habit', description: 'Track your days regularly and watch small changes build into big progress.',icon:"calendar-check", color1: '#0a1e65ff', color2: '#062da3ff' , x: 1, y: 1, x2: 0, y2: 0 }
]


const Introduction = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef(null)

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index)
    }
  }).current

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Slides */}
      <FlatList
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        renderItem={({ item }) => (
          <View style={{ width, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            {/* Platzhalter für Bilder */}  
            <LinearGradient
                colors={['#062da3ff', "#07133fff"]} // dunkelblauer Verlauf
                start={{ x: item.x, y: item.y }}
                end={{ x: item.x2, y: item.y2 }}  
                style={{ padding: 20, borderRadius: 15, alignItems: 'center', flex: 1, justifyContent: 'space-between' }}
                > 
                <View/>
                <Icon name={item.icon} size={100} color="#ffffffaa" />
                <View>
                  <Text className="text-white text-xl font-bold text-center">{item.title}</Text>
                  <Text className="text-gray-300 text-center font-semibold">{item.description}</Text>
                </View>
            </LinearGradient>
          </View>
        )}
      />

      {/* Indikatoren + Button */}
      <View className="flex-row justify-center mb-6">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 mx-1 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-gray-500'
            }`}
          />
        ))}
      </View>

      <View className="px-6 mb-8">
        <CustomButton
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Skip Intro'}
          onPress={async() => {
            await AsyncStorage.setItem("onboardingSetp", "one");
            router.replace("/category")
          }}
          aditionalStyles='w-full'
        />
      </View>
    </SafeAreaView>
  )
}

export default Introduction
