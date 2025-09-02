import React from 'react'
import { Stack } from 'expo-router'
import { useGlobalContext } from '@/components/context/GlobalProvider';

const _layout = () => {
  const { colorTheme } = useGlobalContext();

  return (
    <Stack
        screenOptions={{
        headerStyle: { backgroundColor: colorTheme == "LightBlue" ? "#138bacff": '#0c1f44ff' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Stack>
  )
}

export default _layout