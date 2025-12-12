import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LogoHeader from '../components/LogoHeader';
import { useEffect, useState } from 'react';
import CButton from '../components/CButton';
import { useServices } from '../hooksredux/useServices';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../infoutils/theme';
import { ServiceHistory } from '../infoutils/Services/infoServices';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }: any) {
    const { serviceHistory, upcomingServices } = useServices();
    const { user } = useAuth();
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const [recentServices, setRecentServices] = useState<ServiceHistory[]>([]);

    useEffect(() => {
        setRecentServices(serviceHistory.slice(0, 3));
    }, [serviceHistory]);

    const handleBookService = () => {
        navigation.navigate('BookService');
    };

    const handleViewServices = () => {
        navigation.navigate('Services');
    };

    const handleViewHistory = () => {
        navigation.navigate('History');
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
           <View style={styles.header}>
    <LogoHeader size="small" position="left" />
    <Text style={styles.welcome}>Bienvenido a Premier Motors</Text>
    <Text style={styles.subtitle}>
        {user ? `Hola ${user.name}, ¿en qué podemos ayudarte hoy?` : 'Servicios profesionales para tu vehículo'}
    </Text>
</View>

            {/* Estadísticas Rápidas */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="car-sport" size={24} color={colors.primary} />
                    <Text style={styles.statNumber}>{serviceHistory.length}</Text>
                    <Text style={styles.statLabel}>Servicios Realizados</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="calendar" size={24} color={colors.accent} />
                    <Text style={styles.statNumber}>{upcomingServices.length}</Text>
                    <Text style={styles.statLabel}>Próximos Servicios</Text>
                </View>
            </View>

            {/* Acciones Rápidas */}
            <View style={styles.actionsContainer}>
                <CButton
                    title="Reservar Servicio"
                    onPress={handleBookService}
                    variant="primary"
                />
                <CButton
                    title="Ver Servicios"
                    onPress={handleViewServices}
                    variant="secondary"
                />
                <CButton
                    title="Mi Historial"
                    onPress={handleViewHistory}
                    variant="tertiary"
                />
            </View>

            {/* Próximos Servicios */}
            {upcomingServices.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Próximos Servicios</Text>
                    <View style={styles.servicesList}>
                        {upcomingServices.slice(0, 3).map((service, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.serviceItem}
                                onPress={handleViewHistory}
                            >
                                <Ionicons name="time-outline" size={16} color={colors.accent} />
                                <Text style={styles.serviceText}>
                                    {service.service.name} - {new Date(service.date).toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {upcomingServices.length > 3 && (
                        <Text style={styles.seeMore}>
                            +{upcomingServices.length - 3} servicios más
                        </Text>
                    )}
                </View>
            )}

            {/* Servicios Recientes */}
            {recentServices.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Servicios Recientes</Text>
                    <View style={styles.servicesList}>
                        {recentServices.map((service, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.serviceItem}
                                onPress={handleViewHistory}
                            >
                                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                                <Text style={styles.serviceText}>
                                    {service.service.name} - L. {service.total}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Promoción del Día */}
            <View style={styles.promoCard}>
                <Ionicons name="flash" size={20} color={colors.primary} />
                <Text style={styles.promoText}>
                    ¡20% de descuento en lavado premium para clientes frecuentes!
                </Text>
            </View>
        </ScrollView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        flex: 0.48,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginVertical: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    actionsContainer: {
        marginBottom: 24,
        gap: 12,
    },
    section: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
    },
    servicesList: {
        marginBottom: 8,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },
    serviceText: {
        marginLeft: 8,
        color: colors.text,
        fontSize: 14,
        flex: 1,
    },
    seeMore: {
        color: colors.primary,
        fontSize: 12,
        textAlign: 'center',
    },
    promoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundAlt,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    promoText: {
        marginLeft: 12,
        flex: 1,
        color: colors.text,
        fontSize: 14,
        fontStyle: 'italic',
    },
});