import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useState } from 'react';
import LogoHeader from '../components/LogoHeader';
import ServiceCard from '../components/ServiceCard';
import { useServices } from '../hooksredux/useServices';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../infoutils/theme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function HistoryScreen({ navigation }: any) {
    const { serviceHistory, upcomingServices, completeService, cancelService } = useServices();
    const [activeTab, setActiveTab] = useState<'history' | 'upcoming'>('history');
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const handleCancelService = (id: string) => {
        Alert.alert(
            'Cancelar Servicio',
            '¿Estás seguro de que quieres cancelar este servicio?',
            [
                { text: 'No', style: "cancel" },
                { text: 'Sí, cancelar', onPress: () => cancelService(id) }
            ]
        );
    };

    const handleCompleteService = (id: string) => {
        completeService(id);
    };

    const data = activeTab === 'history' ? serviceHistory : upcomingServices;

    return (
        <View style={styles.container}>
            {/* Header */}
         <View style={styles.header}>
    <LogoHeader size="small" position="left" />
    <Text style={styles.title}>Mis Servicios</Text>
</View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'history' && styles.tabActive]}
                        onPress={() => setActiveTab('history')}
                    >
                        <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
                            Completados ({serviceHistory.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
                        onPress={() => setActiveTab('upcoming')}
                    >
                        <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
                            Próximos ({upcomingServices.length})
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Lista */}
            {data.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons 
                        name={activeTab === 'history' ? "time-outline" : "calendar-outline"} 
                        size={48} 
                        color={colors.textSecondary} 
                    />
                    <Text style={styles.emptyText}>
                        {activeTab === 'history' 
                            ? 'No hay servicios en tu historial' 
                            : 'No tienes servicios programados'}
                    </Text>
                    <Text style={styles.emptySubtext}>
                        {activeTab === 'history'
                            ? 'Los servicios que reserves aparecerán aquí'
                            : 'Reserva tu primer servicio para comenzar'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ServiceCard
                            item={item}
                            onCancel={activeTab === 'upcoming' ? handleCancelService : undefined}
                            onComplete={activeTab === 'upcoming' ? handleCompleteService : undefined}
                            showActions={activeTab === 'upcoming'}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
    },
    tabsContainer: {
        marginBottom: 16,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: colors.backgroundAlt,
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    tabActive: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    tabTextActive: {
        color: colors.white,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: colors.text,
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});


