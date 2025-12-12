import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import CButton from '../components/CButton';
import { useAuth } from '../contexts/AuthContext';
import LogoHeader from '../components/LogoHeader';
import { useServices } from '../hooksredux/useServices';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../infoutils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }: any) {
    const { logout, user, isAllowed } = useAuth();
    const { serviceHistory, upcomingServices } = useServices();
    const { theme, toggleTheme, isDark } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const totalServices = serviceHistory.length;
    const pendingServices = upcomingServices.length;

    const handleLogout = () => {    
        logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Index' }],
        });
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
           <View style={styles.header}>
    <LogoHeader size="medium" position="center" />
   

                <Text style={styles.userName}>
                    {user?.name || 'Usuario'}
                </Text>
                <Text style={styles.userEmail}>
                    {user?.email || 'No autenticado'}
                </Text>
                <Text style={styles.userStatus}>
                    {isAllowed ? 'Conectado' : 'Desconectado'}
                </Text>
            </View>

            {/* Estadísticas */}
            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Mis Estadísticas</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Ionicons name="construct" size={24} color={colors.primary} />
                        <Text style={styles.statNumber}>{totalServices}</Text>
                        <Text style={styles.statLabel}>Servicios Realizados</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="calendar" size={24} color={colors.accent} />
                        <Text style={styles.statNumber}>{pendingServices}</Text>
                        <Text style={styles.statLabel}>Servicios Pendientes</Text>
                    </View>
                </View>
            </View>

            {/* Configuración de Tema */}
            <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Apariencia</Text>
                <View style={styles.themeSetting}>
                    <View style={styles.themeInfo}>
                        <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={colors.primary} />
                        <View style={styles.themeText}>
                            <Text style={styles.themeLabel}>
                                {isDark ? 'Modo Oscuro' : 'Modo Claro'}
                            </Text>
                            <Text style={styles.themeDescription}>
                                Tema {isDark ? 'oscuro' : 'claro'} activado
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: colors.lightGray, true: colors.primarySoft }}
                        thumbColor={isDark ? colors.primary : colors.white}
                    />
                </View>
            </View>

            {/* Acciones Rápidas */}
            <View style={styles.actionsSection}>
                <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                <CButton
                    title="Reservar Servicio"
                    onPress={() => navigation.navigate('BookService')}
                    variant="primary"
                />
                <CButton
                    title="Ver Mis Servicios"
                    onPress={() => navigation.navigate('History')}
                    variant="secondary"
                />
                <CButton
                    title="Catálogo de Servicios"
                    onPress={() => navigation.navigate('ServiceCatalog')}
                    variant="tertiary"
                />
            </View>

            {/* Información de la App */}
            <View style={styles.infoSection}>
                <Text style={styles.appName}>Premier Motors Honduras</Text>
                <Text style={styles.appDescription}>
                    Servicios profesionales para tu vehículo
                </Text>
                <Text style={styles.appVersion}>Versión 1.0.0</Text>
            </View>

            {/* Cerrar Sesión */}
            {isAllowed && (
                <View style={styles.logoutSection}>
                    <CButton
                        title="Cerrar Sesión"
                        onPress={handleLogout}
                        variant="secondary"
                    />
                </View>
            )}
        </ScrollView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.primary,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: colors.white,
        marginBottom: 4,
    },
    userStatus: {
        fontSize: 14,
        color: colors.white,
        opacity: 0.8,
    },
    statsSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 0.48,
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 12,
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
        marginVertical: 8,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    settingsSection: {
        padding: 20,
    },
    themeSetting: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    themeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    themeText: {
        marginLeft: 12,
    },
    themeLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    themeDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    actionsSection: {
        padding: 20,
        gap: 12,
    },
    infoSection: {
        alignItems: 'center',
        padding: 20,
        marginBottom: 20,
    },
    appName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    appDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 8,
        fontStyle: 'italic',
    },
    appVersion: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    logoutSection: {
        padding: 20,
        paddingTop: 0,
    },
});