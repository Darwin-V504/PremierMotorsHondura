import { KeyboardTypeOptions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type Props = {
    required?: boolean;
    type?: 'text' | 'email' | 'password' | 'number';
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
}

export default function CInput({ type = "text", required, value, placeholder, onChangeText }: Props) {
    const [isSecureText, setIsSecureText] = useState(type === "password");
    const isPasswordField = type === 'password';
    
    const icon = type === 'email' ? 'email' :
                 type === 'password' ? 'lock' : ''

    const keyboardType: KeyboardTypeOptions =
        type === 'email' ? 'email-address' :
        type === 'number' ? 'numeric' :
        'default';

    const getError = () => {
        if (type === 'email' && value && !value.includes('@')) return 'Correo inválido';
        if (type === 'password' && value && value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        return '';
    }

    const error = getError();

    return (
        <View style={styles.wrapper}>
            <View style={[styles.inputContainer, error && styles.inputError]}>
                <MaterialIcons name={icon as any} size={20} color="#000000" />
                <TextInput
                 placeholder={placeholder}
                 value={value}
                 onChangeText={onChangeText}
                 onBlur={() => {}}
                 secureTextEntry={isSecureText}
                 style={styles.input}
                 keyboardType={keyboardType}
                />
               
             { isPasswordField && <TouchableOpacity
                    onPress={
                        () => {
                            setIsSecureText(!isSecureText);
                        }
                    }
                >
                    <Ionicons name={isSecureText ? 'eye' : 'eye-off'} size={22} />
                </TouchableOpacity>}
            </View>
            { error && <Text style={styles.errorText}> {error} </Text>}
        </View>
    );
}

const styles = StyleSheet.create({
   wrapper: {
        marginBottom: 10,
   },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 13,
        backgroundColor: '#f9f9f9',
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: '80%',
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    }
});