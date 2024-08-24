import { View, Text, StyleSheet } from 'react-native';

const HomeScreen: React.FC = () => {

    return(
        <View style={styles.container}>
        <Text>Minha Home</Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export { HomeScreen }