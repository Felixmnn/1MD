import { Stack } from "expo-router";
import "../global.css"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../assets/languages/i18n/index"; 
import { useTranslation } from "react-i18next";
import { StatusBar } from "react-native";
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from "react";




export default function RootLayout() {
   useEffect(() => {
     NavigationBar.setVisibilityAsync('hidden');
  }, []);
  return  <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar hidden={true} /> 
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(profile)" options={{ headerShown: false }} />
            </Stack>
          </GestureHandlerRootView>
}
