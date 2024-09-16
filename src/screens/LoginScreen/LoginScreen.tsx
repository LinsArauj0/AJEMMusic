import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { NextComponent } from "../../components/Button/NextComponent";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/types';
import { getAccessToken, loginWithSpotify } from "../../services/authService";
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [authCode, setAuthCode] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const handleUrl = (event: { url: string }) => {
            const url = event.url;
            const code = new URL(url).searchParams.get('code');
            if (code) {
                setAuthCode(code);
            } else {
                Alert.alert('Erro', 'Código de autorização não encontrado.');
            }
        };

        const subscription = Linking.addEventListener('url', handleUrl);

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (authCode) {
            const fetchToken = async () => {
                try {
                    const token = await getAccessToken(authCode);
                    setAccessToken(token);
                    await AsyncStorage.setItem('token', token);
                    navigation.navigate('HomeScreen');
                } catch (error) {
                    console.error('Erro durante a autenticação:', error);
                    Alert.alert('Erro', 'Falha na autenticação. Por favor, tente novamente.');
                }
            };

            fetchToken();
        }
    }, [authCode]);
    const handlePress = () => {
        navigation.navigate('HomeScreen');
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../img/Logo.png')} style={styles.logoImage} />
            <Text style={styles.textLogin}>Vamos entrar</Text>
            <View style={styles.containerButton}>
                <TouchableOpacity style={styles.button} onPress={loginWithSpotify}>
                    <Entypo name="spotify" size={24} color="#1DB954" />
                    <Text style={styles.text}>Continuar com o Spotify</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <AntDesign name="google" size={24} color="red" />
                    <Text style={styles.text}>Continuar com o Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Entypo name="facebook-with-circle" size={24} color="blue" />
                    <Text style={styles.text}>Continuar com o Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <AntDesign name="apple1" size={24} color="white" />
                    <Text style={styles.text}>Continuar com a Apple</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.containerProgress}>
                <View style={styles.progressBar} />
                <Text style={styles.textTwo}>ou</Text>
                <View style={styles.progressBar} />
            </View>
            <NextComponent title="Faça login com uma senha" onPress={handlePress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#1E1E1E'
    },
    logoImage: {
        width: 350,
        height: 300,
    },
    textLogin: {
        fontSize: 44,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        flex: 1,
        textAlign: 'center'
    },
    textTwo: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
        marginVertical: 10,
        padding: 10
    },
    button: {
        backgroundColor: '#1E1E1E',
        padding: 10,
        marginLeft: "auto",
        marginRight: "auto",
        flexDirection: 'row',
        alignItems: 'center',
        width: 300,
        borderRadius: 25,
        borderColor: '#DBE7E8',
        borderWidth: 0.8,
        marginVertical: 10,
    },
    containerButton: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
    containerProgress: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBar: {
        borderColor: '#ffffff',
        borderWidth: .8,
        width: 130,
        height: 1
    }
});

export { LoginScreen };
