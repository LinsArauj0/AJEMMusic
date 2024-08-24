import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/types';

const WelcomeScreen: React.FC = () => {
    // Corrigindo a sintaxe ao usar o hook useNavigation
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handlePress = () => {
        navigation.navigate('HomeScreen');
    };

    return (
        <View style={styles.container}>
            <Text>Olá, Mundo!</Text>
            <Button title="Pressione-me" onPress={handlePress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export { WelcomeScreen };
