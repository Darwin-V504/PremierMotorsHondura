import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import CInput from '../../components/CInput';
import CButton from '../../components/CButton';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../infoutils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function VehicleInfoScreen({ navigation, route }: any) {
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [plate, setPlate] = useState('');
    const [color, setColor] = useState('');
    const [vin, setVin] = useState('');
    const [mileage, setMileage] = useState('');

    const handleSaveVehicle = () => {
        if (!brand || !model || !year) {
            Alert.alert('Error', 'Por favor completa la marca, modelo y año del carro');
            return;
        }

        const vehicleInfo = {
            type: 'carro' as const,
            brand,
            model,
            year: parseInt(year),
            plate: plate || undefined,
            color: color || undefined,
            vin: vin || undefined,
            mileage: mileage ? parseInt(mileage) : undefined
        };

        Alert.alert(
            'Carro Guardado',
            `Información de ${brand} ${model} (${year}) guardada exitosamente`,
            [
                {
                    text: 'Continuar',
                    onPress: () => {
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    const isFormValid = brand.trim() !== '' && model.trim() !== '' && year.trim() !== '';

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Información del Carro</Text>
                <Text style={styles.subtitle}>
                    Agrega los datos de tu carro para un mejor servicio
                </Text>

                {/* Información Básica */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Básica</Text>
                    <CInput
                        value={brand}
                        type="text"
                        placeholder="Marca (ej: Toyota, Honda)"
                        onChangeText={setBrand}
                    />
                    <CInput
                        value={model}
                        type="text"
                        placeholder="Modelo (ej: Corolla, Civic)"
                        onChangeText={setModel}
                    />
                    <CInput
                        value={year}
                        type="number"
                        placeholder="Año (ej: 2020)"
                        onChangeText={setYear}
                    />
                    <CInput
                        value={color}
                        type="text"
                        placeholder="Color (opcional)"
                        onChangeText={setColor}
                    />
                </View>

                {/* Información Adicional */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Adicional</Text>
                    <CInput
                        value={plate}
                        type="text"
                        placeholder="Número de placa (opcional)"
                        onChangeText={setPlate}
                    />
                    <CInput
                        value={vin}
                        type="text"
                        placeholder="VIN (Número de identificación del vehículo)"
                        onChangeText={setVin}
                    />
                    <CInput
                        value={mileage}
                        type="number"
                        placeholder="Kilometraje (opcional)"
                        onChangeText={setMileage}
                    />
                </View>

                {/* Información de Servicios Recomendados */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Servicios Recomendados</Text>
                    <View style={styles.recommendedServices}>
                        <View style={styles.serviceTip}>
                            <Ionicons name="construct-outline" size={20} color={colors.primary} />
                            <Text style={styles.serviceTipText}>
                                Cambio de aceite cada 5,000 km
                            </Text>
                        </View>
                        <View style={styles.serviceTip}>
                            <Ionicons name="construct-outline" size={20} color={colors.primary} />
                            <Text style={styles.serviceTipText}>
                                Rotación de llantas cada 10,000 km
                            </Text>
                        </View>
                        <View style={styles.serviceTip}>
                            <Ionicons name="construct-outline" size={20} color={colors.primary} />
                            <Text style={styles.serviceTipText}>
                                Revisión de frenos cada 15,000 km
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Botones de Acción */}
                <View style={styles.actions}>
                    <CButton
                        title="Cancelar"
                        onPress={() => navigation.goBack()}
                        variant="tertiary"
                    />
                    <CButton
                        title="Guardar Carro"
                        onPress={handleSaveVehicle}
                        disabled={!isFormValid}
                        variant="primary"
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        margin: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    recommendedServices: {
        backgroundColor: colors.backgroundAlt,
        borderRadius: 8,
        padding: 12,
    },
    serviceTip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    serviceTipText: {
        marginLeft: 12,
        color: colors.text,
        fontSize: 14,
        flex: 1,
    },
    actions: {
        gap: 12,
        marginTop: 20,
    },
});