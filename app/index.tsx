import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect directly to the home screen inside the (tabs) folder
  return <Redirect href="/home/HomeScreen" />;
}
