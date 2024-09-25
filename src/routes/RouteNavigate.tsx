import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from "@expo/vector-icons";
import { RootStackParamList } from './types';
import { WelcomeScreen } from '../screens/WelcomeScreen/WelcomeScreen';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen/LoginScreen';
import { ExplorerScreen } from '../screens/ExplorerScreen/ExplorerScreen';
import { LibraryScreen } from '../screens/LibraryScreen/LibraryScreen';
import { LikedSongsScreen } from '../screens/LikedSongsScreen/LikedSongsScreen';
import { SongInfoScreen } from '../screens/SongInfoScreen/SongInfoScreen';
import { AlbumDetailScreen } from '../components/AlbumDetailScreen/AlbumDetailScreen';
import { View, Text } from 'react-native';

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
const Tab = createBottomTabNavigator();

const HomeTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarLabelStyle: {
                    color: 'black',
                },
            }}
        >
            <Tab.Screen name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: "Home",
                    headerShown: false,
                    tabBarLabelStyle: { color: "white", fontWeight: '600', fontSize: 12 },
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Entypo name="home" size={24} color="white" />
                        ) : (
                            <AntDesign name="home" size={24} color="white" />
                        ),
                }} />
            <Tab.Screen name="Pesquisar"
                component={ExplorerScreen}
                options={{
                    tabBarLabel: "Explorar",
                    headerShown: false,
                    tabBarLabelStyle: { color: "white", fontWeight: '600', fontSize: 12 },
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Ionicons name="search" size={24} color="white" />
                        ) : (
                            <Ionicons name="search" size={24} color="white" />
                        ),
                }} />
            <Tab.Screen name="Biblioteca"
                component={LibraryScreen}
                options={{
                    tabBarLabel: "Biblioteca",
                    headerShown: false,
                    tabBarLabelStyle: { color: "white", fontWeight: '600', fontSize: 12 },
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Ionicons name="library-outline" size={24} color="white" />
                        ) : (
                            <Ionicons name="library-outline" size={24} color="white" />
                        ),
                }} />
        </Tab.Navigator>
    );
};

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
                    component={HomeTabNavigator}
                    options={{ headerShown: false }}
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
                <Stack.Screen
                    name="Liked"
                    component={LikedSongsScreen}
                    options={{ headerShown: false }} />
                
                <Stack.Screen
                    name="Info"
                    component={SongInfoScreen}
                    options={{ headerShown: false }} />
                
                <Stack.Screen
                    name="AlbumDetail"
                    component={AlbumDetailScreen}
                    options={{ headerShown: false }} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export { RouteNavigate }
