import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/types';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WelcomeScreen'>

const WelcomeScreen: React.FC = () => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => {
        setIsPressed(true)
    }

    const handlePressOut = () => {
        setIsPressed(false)
    }

    const handlePress = () => {
        navigation.navigate('LoginScreen');
    };

    return (
        <View style={styles.container}>
            {/* Lua Grande */}
            <Image source={require('../../img/Ellipse2.png')} style={styles.imgBigCircle} />
            {/* Lua Média */}
            <Image source={require('../../img/Ellipse4.png')} style={styles.imgMediumCircle} />
            {/* Lua Pequena */}
            <Image source={require('../../img/Ellipse3.png')} style={styles.imgSmallCircle} />

            <View style={styles.subContainer}>
                <Image source={require('../../img/img_girl.png')} />
            </View>

            <View style={styles.subContainers}>
                <Text style={styles.text}>
                    Dos sucessos <Text style={{ color: '#26c6da' }}>mais recentes</Text> aos <Text style={{ color: '#26c6da' }}>maiores</Text>, toque suas faixas favoritas no <Text style={{ color: '#26c6da' }}>AJEM Music</Text> agora!
                </Text>
                <View style={styles.progressBar}>
                    {/* Primeira parte: preenchida */}
                    <View style={[styles.progressSegment, styles.filled]} />
                    {/* Segunda parte: parcialmente preenchida */}
                    <View style={[styles.progressSegment, styles.partiallyFilled]} />
                    {/* Terceira parte: vazia */}
                    {/* <View style={[styles.progressSegment, styles.empty]} /> */}
                </View>
                <TouchableOpacity
                    style={[styles.button, isPressed && styles.buttonPressed]} 
                    onPress={handlePress} 
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}>

                    <Text style={styles.buttonText}>Começar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#41C3D6',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subContainer: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
        top: -80,
    },
    subContainers: {
        flex: 1,
        backgroundColor: '#333',
        width: '100%',
        height: '40%',
        position: 'absolute',
        zIndex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        top: 540,
        padding: 20,
    },
    text: {
        color: 'white',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    imgBigCircle: {
        position: 'absolute',
        top: 50,
        left: 10,
        width: 149,
        height: 146,
        zIndex: 1,
    },
    imgMediumCircle: {
        position: 'absolute',
        top: 90,
        right: 40,
        width: 78,
        height: 78,
        zIndex: 1,
    },
    imgSmallCircle: {
        position: 'absolute',
        top: 240,
        left: 290,
        width: 103,
        height: 103,
        zIndex: 1,
    },
    button: {
        backgroundColor: '#26c6da',
        paddingVertical: 15,
        borderRadius: 30,
        width: '100%',
    },
    buttonPressed: {
        backgroundColor: '#06A0B5'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    progressBar: {
        flexDirection: 'row',
        width: 120,
        height: 8,
        backgroundColor: '#444',
        borderRadius: 10,
        marginBottom: 30,
    },
    progressSegment: {
        height: '100%',
        borderRadius: 10,
    },
    filled: {
        flex: 1,
        backgroundColor: '#00C0C6',
        marginRight: 2,
    },
    partiallyFilled: {
        flex: 1,
        backgroundColor: '#ccc',
        marginRight: 2,
    },
    empty: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export { WelcomeScreen };
