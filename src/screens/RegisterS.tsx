import { View, Text, StyleSheet } from "react-native";
import CInput from "../components/CInput";
import CButton from "../components/CButton";
import { useState } from "react";
import LogoHeader from "../components/LogoHeader";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";

export default function RegisterScreen({ navigation }: any) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Simulación de registro exitoso
        alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
        navigation.navigate('Login');
    };

    const isFormValid = fullName.trim() !== '' && email.trim() !== '' && 
                       password.trim() !== '' && confirmPassword.trim() !== '' &&
                       password === confirmPassword;

    return (
        <View style={styles.container}>
            <View style={styles.card}>
    <LogoHeader size="medium" position="center" />
    <Text style={styles.title}>Premier Motors Honduras</Text>
                <Text style={styles.title}>Crear Cuenta</Text>
                <Text style={styles.subtitle}>Únete a Premier Motors</Text>
                
                <CInput
                    value={fullName}
                    type='text'
                    placeholder='Nombre completo'
                    onChangeText={setFullName}
                />
                <CInput
                    value={email}
                    type='email'
                    placeholder='Correo electrónico'
                    onChangeText={setEmail}
                />
                <CInput
                    value={phone}
                    type='number'
                    placeholder='Teléfono'
                    onChangeText={setPhone}
                />
                <CInput
                    value={password}
                    type='password'
                    placeholder='Contraseña'
                    onChangeText={setPassword}
                />
                <CInput
                    value={confirmPassword}
                    type='password'
                    placeholder='Confirmar contraseña'
                    onChangeText={setConfirmPassword}
                />
                
                <CButton 
                    title='Crear Cuenta' 
                    onPress={handleRegister}
                    disabled={!isFormValid}
                />
                
                <CButton
                    title='¿Ya tienes cuenta? Iniciar Sesión'
                    variant='tertiary'
                    onPress={() => navigation.navigate('Login')}
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
        borderRadius: 15,
        padding: 30,
        width: '85%',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
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
        marginBottom: 20,
        color: colors.text,
    }
});