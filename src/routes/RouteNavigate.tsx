import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { WelcomeScreen } from '../screens/WelcomeScreen/WelcomeScreen';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen/LoginScreen';

const linking = {
    prefixes: ['ajemusic://'],
    config: {
      screens: {
        WelcomeScreen: 'welcome',
        HomeScreen: 'home',
        LoginScreen: 'login',
      },
    },
  };

const Stack = createNativeStackNavigator<RootStackParamList>();

const RouteNavigate: React.FC = () => {

    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator initialRouteName="WelcomeScreen">

                <Stack.Screen
                    name='WelcomeScreen'
                    component={WelcomeScreen}
                    options={{ headerShown: false }} />

                <Stack.Screen
                    name='HomeScreen'
                    component={HomeScreen}
                />

                <Stack.Screen
                    name='LoginScreen'
                    component={LoginScreen}
                    options={{
                        headerTitle: '',
                        headerStyle: { backgroundColor: '#1E1E1E' },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold' },
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export { RouteNavigate }