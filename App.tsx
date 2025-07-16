// 📁 App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Loader from './src/scripts/Loader';
import Onboarding from './src/scripts/Onboarding';
import MainTabs from './src/navigator/MainTabs';
import LaughStartScreen from './src/scripts/LaughStartScreen'; // ✅ Правильный путь

// ✅ Навигационный стек с параметром для LaughStart
export type RootStackParamList = {
  Loader: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  LaughStart: { selectedCategory: string }; // 🎯 ОБЯЗАТЕЛЕН для route.params
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loader" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loader" component={Loader} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="LaughStart" component={LaughStartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
