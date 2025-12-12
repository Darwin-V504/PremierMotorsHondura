import { useEffect } from 'react';
import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';

import { store } from './src/store';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import StackNavigator from './src/navigation/StackNavigator';

// Mantener el splash screen visible hasta que la app esté lista
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    // Ocultar el splash screen después de que todo esté cargado
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };

    // Simular tiempo de carga o esperar a que todo esté listo
    setTimeout(() => {
      hideSplash();
    }, 3000); // 3 segundos

  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}