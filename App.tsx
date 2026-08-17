// App.tsx
// This is the ROOT of the entire app — the first thing that renders.
// Right now it's a simple test screen to confirm our theme is working.
// Later, we'll replace the content here with our Navigator (all the screens).
import './global.css'
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Colors } from './constants/colors';
import OnboardingScreen from './app/(auth)/OnboardinScree';
import LoginScreen from './app/(auth)/LoginScreen';
import RegisterScreen from './app/(auth)/RegisterScreen';
import AppNavigator from './app/navigation';

export default function App() {
  return (
    <AppNavigator />

    // <OnboardingScreen />
    // <LoginScreen />
    // <RegisterScreen />

  )
  // return (
  //   //
  //   // View is like a <div> in web development — a container
  //   // We use inline style here (not NativeWind) for the root View
  //   // because NativeWind needs a tiny bit more config before it works
  //   <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
  //     {/* we uses status bar makes the clock/battery bar at the to mathc our theme */}
  //     <StatusBar style='light' />
  //     {/* the MoniVo logo text - temporary palceholdr */}
  //     <Text style={{ color: Colors.champagne, fontSize: 36, fontWeight: 'bold', letterSpacing: 2 }} >
  //       MoniVo!
  //     </Text>
  //     <Text style={{ color: Colors.muted, fontSize: 8, fontWeight: 'light', letterSpacing: 2 }} >
  //       Your money, Clearly!
  //     </Text>
  //   </View>
  // );
}