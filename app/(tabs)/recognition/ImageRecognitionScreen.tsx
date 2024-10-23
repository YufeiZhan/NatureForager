// app/(tabs)/recognition/ImageRecognitionScreen.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function ImageRecognitionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Image Recognition Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
