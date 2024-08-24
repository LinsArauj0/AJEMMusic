import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/WelcomeScreen/WelcomeScreen';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';

const Stack = createNativeStackNavigator();

const RouteNavigate: React.FC = ( ) => {

    return (
        <NavigationContainer>
            <Stack.Navigator>

                <Stack.Screen
                    name='Welcome'
                    component={WelcomeScreen}
                    options={{ headerShown: false }} />

                <Stack.Screen
                    name='HomeScreen'
                    component={HomeScreen}
                     />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export { RouteNavigate }