import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useAuth } from '../contexts/AuthContext.js';
import LoginScreen from '../screens/LoginScreen.js';
import RegisterScreen from '../screens/RegisterScreen.js';
import DashboardScreen from '../screens/DashboardScreen.js';
import PregnancyScreen from '../screens/PregnancyScreen.js';
import CareScreen from '../screens/CareScreen.js';
import PlanningScreen from '../screens/PlanningScreen.js';
import ProfileScreen from '../screens/ProfileScreen.js';
import AIAssistantScreen from '../screens/AIAssistantScreen.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontWeight: '800', color: '#1e293b' },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f1e8e8',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#e64980',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: () => <Text style={{ fontSize: 16 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Pregnancy"
        component={PregnancyScreen}
        options={{
          title: 'Pregnancy',
          tabBarIcon: () => <Text style={{ fontSize: 16 }}>🤰</Text>,
        }}
      />
      <Tab.Screen
        name="Care"
        component={CareScreen}
        options={{
          title: 'Care & Visits',
          tabBarIcon: () => <Text style={{ fontSize: 16 }}>🩺</Text>,
        }}
      />
      <Tab.Screen
        name="Planning"
        component={PlanningScreen}
        options={{
          title: 'Planning',
          tabBarIcon: () => <Text style={{ fontSize: 16 }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          tabBarIcon: () => <Text style={{ fontSize: 16 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="AIAssistant"
            component={AIAssistantScreen}
            options={{ headerShown: true, title: 'AI Assistant', headerTintColor: '#e64980' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator;
