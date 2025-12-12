import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CInput from "../components/CInput";
import CButton from "../components/CButton";
import LogoHeader from "../components/LogoHeader";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAllowed } = useAuth();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const styles = getStyles(colors);

  const isLoginDisabled = () => {
    return email.trim() === '' || password.trim() === '';
  };

  const handleLogin = () => {
    try {
      const allowed = login(email, password);
      if (allowed) {
        navigation.replace('Tabs', { email });
      } else {
        alert('Credenciales incorrectas. Use un email válido y contraseña de al menos 6 caracteres.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = () => {
    try {
      navigation.navigate('Register');
    } catch (error) {
      console.log("Error en navegación: " + error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
    <LogoHeader size="medium" position="center" />
    <Text style={styles.title}>Premier Motors Honduras</Text>
       
        <Text style={styles.subtitle}>Iniciar Sesión</Text>
        
        <CInput
          value={email}
          type='email'
          placeholder='Correo electrónico'
          onChangeText={setEmail}
        />
        <CInput
          value={password}
          type='password'
          placeholder='Contraseña'
          onChangeText={setPassword}
        />
        <CButton
          title="Iniciar Sesión"
          onPress={handleLogin}
          disabled={isLoginDisabled()}
          size="medium"
        />
        <CButton
          title="Crear Cuenta"
          variant='tertiary'
          onPress={handleRegister}
          size="medium"
        />
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.text,
  }
});