import { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import LandingScreen from './src/screens/LandingScreen';
import HomeScreen from './src/screens/HomeScreen';
import StretchScreen from './src/screens/StretchScreen';
import WellnessInfoScreen from './src/screens/WellnessInfoScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function StretchingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Stretch"
        component={StretchScreen}
        options={{ title: 'Stretch Exercise' }}
      />
    </Stack.Navigator>
  );
}

function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Stretching"
        component={StretchingStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Stretching',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="yoga" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Wellness"
        component={WellnessInfoScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Wellness Info',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const navigationRef = useRef();

  useEffect(() => {
    // Handle notification response (when user taps notification)
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data.screen;
      if (screen && navigationRef.current) {
        navigationRef.current.navigate('MainApp', { screen: 'Stretching', params: { screen } });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="MainApp" component={MainAppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

