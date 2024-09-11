// Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const NextComponent: React.FC<ButtonProps> = ({ onPress, title, style, textStyle }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
    >
      <Text style={[styles.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#26c6da',
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    borderRadius: 25,
    borderColor: '#DBE7E8',
    borderWidth: 0.8,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
});

    export { NextComponent };
