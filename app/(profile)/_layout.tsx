import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack
        screenOptions={{
        headerStyle: { backgroundColor: '#0c1f44ff' },
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