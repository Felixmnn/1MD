import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function TabLayout() {
  return (
    <Tabs
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarStyle: Platform.select({
      ios: {
        position: 'absolute',
        backgroundColor: '#1e1e1e',
        borderTopWidth: 0,
        height: 80, // Höhe der TabBar auf iOS
        paddingBottom: 20, // optional, um Icons besser zu zentrieren
      },
      default: {
        backgroundColor: '#0c1f44ff',
        borderTopWidth: 0,
        height: 70, // Höhe der TabBar auf Android/anderen Plattformen
      },
    }),
    tabBarActiveTintColor: '#ffffff',
    tabBarInactiveTintColor: '#888888',
    tabBarIcon: ({ color, size }) => {
      let iconName;
      if (route.name === 'home') {
        iconName = 'home';
      } else if (route.name === 'data') {
        iconName = 'chart-bar';
      } else if (route.name === 'analyse') {
        iconName = 'search';
      }
      return <Icon name={iconName} size={size || 28} color={color} />;
    },
  })}
>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="analyse"
        options={{
          title: 'Analyse',
        }}/>
        <Tabs.Screen
        name="data"
        options={{
          title: 'Data',
        }}
      />
    </Tabs>
  );
}
