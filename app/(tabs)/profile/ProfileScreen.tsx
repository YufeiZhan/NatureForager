// app/(tabs)/profile/ProfileScreen.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Profile Screen</Text>
      <Link href="./profile/Favorites"> Go to Favorites </Link>
      <Link href="./SaveForLater"> Go to Save for Later </Link>
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
