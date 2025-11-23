import { useEffect, useRef } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
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

export default function App() {
  const navigationRef = useRef();

  useEffect(() => {
    // Handle notification response (when user taps notification)
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data.screen;
      if (screen && navigationRef.current) {
        navigationRef.current.navigate('Stretching', { screen });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
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
            tabBarIcon: ({ color }) => <TabIcon icon="💪" color={color} />,
          }}
        />
        <Tab.Screen
          name="Wellness"
          component={WellnessInfoScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Wellness Info',
            tabBarIcon: ({ color }) => <TabIcon icon="📚" color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function TabIcon({ icon }) {
  return <Text style={{ fontSize: 24 }}>{icon}</Text>;
}
