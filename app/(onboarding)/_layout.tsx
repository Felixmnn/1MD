import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack
        screenOptions={{
        headerStyle: { backgroundColor: '#0c1f44ff' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },

        headerShown: false,

      }}
    >
      <Stack.Screen
        name="categioy"
        options={{
          title: 'Category',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="variables"
        options={{
          title: 'Variables',
        }}
      />
      <Stack.Screen
        name="password"
        options={{
          title: 'Password',
        }}
      />
      <Stack.Screen
        name="introduction"
        options={{
          title: 'Introduction',
        }}
      />
    </Stack>
  )
}

export default _layout