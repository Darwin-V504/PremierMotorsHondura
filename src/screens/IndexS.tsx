import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import CButton from "../components/CButton";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";

type MenuItem = {
  title: string;
  screen: string;
  requiresAuth: boolean;
};

export default function IndexS({ navigation }: any) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAllowed, logout } = useAuth();
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    // URL del logo de la empresa
    const companyLogo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsBHnLPALDBQ7CgbDq-NFh0_3nPbX--5y2aw&s";

    const menuItems: MenuItem[] = [
        { title: "Iniciar Sesión", screen: "Login", requiresAuth: false },
        { title: "Registrarse", screen: "Register", requiresAuth: false },
        { title: "Inicio", screen: "Tabs", requiresAuth: true },
        { title: "Servicios", screen: "ServiceCatalog", requiresAuth: false },
    ];

    const handleMenuPress = (item: MenuItem) => {
        if (item.requiresAuth && !isAllowed) {
            navigation.navigate("Login");
        } else {
            navigation.navigate(item.screen as never);
        }
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {    
        logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Index' }],
        });
    };

    return (
        <View style={styles.container}>
            {/* Contenido principal */}
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    {/* Logo de la empresa desde URL */}
                    <Image 
                        source={{ uri: companyLogo }}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Premier Motors Honduras</Text>
                </View>
                
                <Text style={styles.subtitle}>
                    Servicios profesionales para tu vehículo
                </Text>
                
                <Text style={styles.description}>
                    Lavado, mantenimiento y reparación para carros y motos. 
                    Calidad y confianza en cada servicio.
                </Text>

                <View style={styles.quickActions}>
                    <CButton
                        title="Ver Servicios"
                        onPress={() => navigation.navigate('ServiceCatalog')}
                        variant="primary"
                        size="medium"
                    />
                    <CButton
                        title={isAllowed ? "Mi Cuenta" : "Iniciar Sesión"}
                        onPress={() => navigation.navigate(isAllowed ? 'Tabs' : 'Login')}
                        variant="secondary"
                        size="medium"
                    />
                </View>
            </View>

            {/* Botón del menú */}
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                <Ionicons name="menu" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Menú lateral */}
            {isMenuOpen && (
                <View style={styles.menuOverlay}>
                    <View style={styles.menuPanel}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.menuTitle}>Menú</Text>
                            <TouchableOpacity
                                style={styles.closeIconButton}
                                onPress={() => setIsMenuOpen(false)}
                            >
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        
                        {user && (
                            <View style={styles.userSection}>
                                <Ionicons name="person-circle" size={40} color={colors.primary} />
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                </View>
                            </View>
                        )}

                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuItem}
                                onPress={() => handleMenuPress(item)}
                            >
                                <Text style={styles.menuItemText}>
                                    {item.title}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {isAllowed && (
                            <TouchableOpacity
                                style={[styles.menuItem, styles.logoutItem]}
                                onPress={handleLogout}
                            >
                                <Ionicons name="log-out-outline" size={20} color={colors.error} />
                                <Text style={[styles.menuItemText, styles.logoutText]}>
                                    Cerrar Sesión
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    <TouchableOpacity
                        style={styles.overlayBackground}
                        onPress={() => setIsMenuOpen(false)}
                    />
                </View>
            )}
        </View>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoImage: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.primary,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 16,
        textAlign: 'center',
        color: colors.text,
        fontWeight: '600',
    },
    description: {
        fontSize: 16,
        marginBottom: 40,
        textAlign: 'center',
        color: colors.textSecondary,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    quickActions: {
        width: '100%',
        maxWidth: 300,
        gap: 12,
    },
    menuButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: colors.primary,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    menuOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        flexDirection: 'row-reverse',
    },
    overlayBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuPanel: {
        width: 300,
        backgroundColor: colors.card,
        padding: 20,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
    },
    closeIconButton: {
        padding: 5,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 12,
        backgroundColor: colors.backgroundAlt,
        borderRadius: 8,
    },
    userInfo: {
        marginLeft: 12,
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    userEmail: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuItemText: {
        fontSize: 18,
        color: colors.text,
        flex: 1,
    },
    logoutItem: {
        marginTop: 10,
        borderBottomWidth: 0,
    },
    logoutText: {
        color: colors.error,
        marginLeft: 8,
    },
});