import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../infoutils/theme';
import { Ionicons } from '@expo/vector-icons';
import CButton from '../components/CButton';
import { usePlans } from '../hooksredux/usePlans';

export default function PlansScreen({ navigation }: any) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const styles = getStyles(colors);

  const [activeTab, setActiveTab] = useState<'activos' | 'completados' | 'cancelados'>('activos');
  
  // Usar planes de Redux - con valores por defecto
  const { 
    plans, 
    activePlans, 
    completedPlans, 
    canceledPlans, 
    cancelPlan,
    markPayment,
    deletePlan 
  } = usePlans();

  // Filtrar planes según la pestaña activa con manejo de undefined
  const filteredPlans = activeTab === 'activos' ? (activePlans || []) :
                       activeTab === 'completados' ? (completedPlans || []) :
                       (canceledPlans || []);

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'tarjeta': return 'card';
      case 'app': return 'phone-portrait';
      case 'efectivo': return 'cash';
      default: return 'card';
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'tarjeta': return 'Tarjeta de crédito';
      case 'app': return 'App móvil';
      case 'efectivo': return 'Pago en caja';
      default: return method;
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'semanal': return 'Semanal';
      case 'quincenal': return 'Quincenal';
      case 'mensual': return 'Mensual';
      default: return frequency;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return colors.success;
      case 'completado': return colors.primary;
      case 'cancelado': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'activo': return 'Activo';
      case 'completado': return 'Completado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return date.toLocaleDateString('es-HN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const handleCancelPlan = (planId: string) => {
    Alert.alert(
      'Cancelar Plan',
      '¿Estás seguro de que deseas cancelar este plan de mantenimiento?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => {
            cancelPlan(planId);
            Alert.alert('Plan cancelado', 'El plan ha sido cancelado exitosamente');
          }
        }
      ]
    );
  };

  const handleMarkPayment = (planId: string, plan: any) => {
    Alert.alert(
      'Registrar Pago',
      `¿Deseas registrar el pago de la cuota ${(plan.paidInstallments || 0) + 1} de ${plan.totalInstallments || 0}?\n` +
      `Monto: L. ${(plan.installmentAmount || 0).toLocaleString()}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, registrar',
          onPress: () => {
            markPayment(planId);
            Alert.alert('Pago registrado', 'El pago ha sido registrado exitosamente');
          }
        }
      ]
    );
  };

  const handleDeletePlan = (planId: string) => {
    Alert.alert(
      'Eliminar Plan',
      '¿Estás seguro de que deseas eliminar permanentemente este plan?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, eliminar',
          style: 'destructive',
          onPress: () => {
            deletePlan(planId);
            Alert.alert('Plan eliminado', 'El plan ha sido eliminado exitosamente');
          }
        }
      ]
    );
  };

  const handleViewDetails = (plan: any) => {
    if (!plan) return;
    
    Alert.alert(
      'Detalles del Plan',
      `Vehículo: ${plan.vehicleBrand || ''} ${plan.vehicleModel || ''} (${plan.year || ''})\n` +
      `Mantenimiento: ${(plan.maintenanceMileage || 0).toLocaleString()} km\n` +
      `Método de pago: ${getPaymentMethodText(plan.paymentMethod || '')}\n` +
      `Frecuencia: ${getFrequencyText(plan.frequency || '')}\n` +
      `Cuota: L. ${(plan.installmentAmount || 0).toLocaleString()}\n` +
      `Pagadas: ${plan.paidInstallments || 0} de ${plan.totalInstallments || 0}\n` +
      `Total: L. ${(plan.totalAmount || 0).toLocaleString()}\n` +
      `Próximo pago: ${formatDate(plan.nextPaymentDate || '')}\n` +
      `Estado: ${getStatusText(plan.status || '')}\n` +
      `Creado: ${formatDate(plan.createdAt || '')}`,
      [{ text: 'Cerrar', style: 'cancel' }]
    );
  };

  const handleAddNewPlan = () => {
    navigation.navigate('MaintenancePaymentPlan');
  };

  const PlanItem = ({ plan }: { plan: any }) => {
    if (!plan) return null;
    
    return (
      <View style={styles.planCard}>
        {/* Encabezado del plan */}
        <View style={styles.planHeader}>
          <View style={styles.vehicleInfo}>
            <Ionicons name="car-sport" size={24} color={colors.primary} />
            <View style={styles.vehicleText}>
              <Text style={styles.vehicleName} numberOfLines={1}>
                {plan.vehicleBrand || ''} {plan.vehicleModel || ''}
              </Text>
              <Text style={styles.vehicleYear}>
                {plan.year || ''} • {(plan.maintenanceMileage || 0).toLocaleString()} km
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(plan.status || '')}15` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(plan.status || '') }]}>
              {getStatusText(plan.status || '')}
            </Text>
          </View>
        </View>

        {/* Información del pago */}
        <View style={styles.paymentInfo}>
          <View style={styles.paymentRow}>
            <View style={styles.paymentDetail}>
              <Ionicons 
                name={getPaymentMethodIcon(plan.paymentMethod || '') as any} 
                size={16} 
                color={colors.textSecondary} 
              />
              <Text style={styles.paymentDetailText}>
                {getPaymentMethodText(plan.paymentMethod || '')}
              </Text>
            </View>
            <View style={styles.paymentDetail}>
              <Ionicons name="calendar" size={16} color={colors.textSecondary} />
              <Text style={styles.paymentDetailText}>
                {getFrequencyText(plan.frequency || '')}
              </Text>
            </View>
          </View>

          <View style={styles.paymentRow}>
            <View style={styles.paymentDetail}>
              <Ionicons name="cash" size={16} color={colors.textSecondary} />
              <Text style={styles.paymentDetailText}>
                L. {(plan.installmentAmount || 0).toLocaleString()}/{plan.frequency === 'semanal' ? 'sem' : 
                   plan.frequency === 'quincenal' ? 'quin' : 'mes'}
              </Text>
            </View>
            <View style={styles.paymentDetail}>
              <Ionicons name="checkmark-circle" size={16} color={colors.textSecondary} />
              <Text style={styles.paymentDetailText}>
                {(plan.paidInstallments || 0)}/{(plan.totalInstallments || 0)} pagos
              </Text>
            </View>
          </View>
        </View>

        {/* Progreso del pago */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progreso del pago</Text>
            <Text style={styles.progressPercentage}>
              {plan.totalInstallments && plan.totalInstallments > 0 
                ? Math.round(((plan.paidInstallments || 0) / plan.totalInstallments) * 100)
                : 0}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: plan.totalInstallments && plan.totalInstallments > 0 
                    ? `${((plan.paidInstallments || 0) / plan.totalInstallments) * 100}%`
                    : '0%',
                  backgroundColor: colors.primary
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            Total: L. {(plan.totalAmount || 0).toLocaleString()}
          </Text>
        </View>

        {/* Próximo pago */}
        {plan.status === 'activo' && (
          <View style={styles.nextPayment}>
            <Ionicons name="time" size={16} color={colors.warning} />
            <Text style={styles.nextPaymentText}>
              Próximo pago: {formatDate(plan.nextPaymentDate || '')}
            </Text>
          </View>
        )}

        {/* Acciones */}
        <View style={styles.planActions}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => handleViewDetails(plan)}
          >
            <Text style={styles.detailsButtonText}>Ver detalles</Text>
          </TouchableOpacity>
          
          {plan.status === 'activo' && (
            <>
              <TouchableOpacity
                style={styles.payButton}
                onPress={() => handleMarkPayment(plan.id, plan)}
              >
                <Text style={styles.payButtonText}>Pagar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelPlan(plan.id)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
          
          {plan.status === 'cancelado' && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeletePlan(plan.id)}
            >
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mis Planes</Text>
          <Text style={styles.subtitle}>
            Administra tus planes de mantenimiento
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewPlan}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={styles.addButtonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'activos' && styles.tabActive]}
            onPress={() => setActiveTab('activos')}
          >
            <Text style={[styles.tabText, activeTab === 'activos' && styles.tabTextActive]}>
              Activos ({(activePlans || []).length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completados' && styles.tabActive]}
            onPress={() => setActiveTab('completados')}
          >
            <Text style={[styles.tabText, activeTab === 'completados' && styles.tabTextActive]}>
              Completados ({(completedPlans || []).length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'cancelados' && styles.tabActive]}
            onPress={() => setActiveTab('cancelados')}
          >
            <Text style={[styles.tabText, activeTab === 'cancelados' && styles.tabTextActive]}>
              Cancelados ({(canceledPlans || []).length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de planes */}
      {(!filteredPlans || filteredPlans.length === 0) ? (
        <View style={styles.emptyState}>
          <Ionicons 
            name={activeTab === 'activos' ? "calendar-outline" : "checkmark-done-outline"} 
            size={80} 
            color={colors.textSecondary} 
          />
          <Text style={styles.emptyTitle}>
            {activeTab === 'activos' 
              ? 'No tienes planes activos' 
              : activeTab === 'completados'
                ? 'No hay planes completados'
                : 'No hay planes cancelados'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'activos' 
              ? 'Agrega un nuevo plan de mantenimiento para comenzar'
              : 'Los planes aparecerán aquí según su estado'}
          </Text>
          {activeTab === 'activos' && (
            <CButton
              title="Agregar Nuevo Plan"
              onPress={handleAddNewPlan}
              variant="primary"
              size="medium"
            />
          )}
        </View>
      ) : (
        <FlatList
          data={filteredPlans}
          keyExtractor={(item) => item?.id || Math.random().toString()}
          renderItem={({ item }) => <PlanItem plan={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.plansList}
          ItemSeparatorComponent={() => <View style={styles.planSeparator} />}
        />
      )}

      {/* Estadísticas rápidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {(activePlans || []).length}
          </Text>
          <Text style={styles.statLabel}>Activos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            L. {(activePlans || []).reduce((sum: number, p: any) => sum + (p?.totalAmount || 0), 0).toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Invertido</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {(completedPlans || []).length}
          </Text>
          <Text style={styles.statLabel}>Completados</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 6,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  tabTextActive: {
    color: colors.white,
  },
  plansList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  planSeparator: {
    height: 16,
  },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehicleText: {
    marginLeft: 12,
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  vehicleYear: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentInfo: {
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentDetailText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  nextPayment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.warning}15`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  nextPaymentText: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  planActions: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: `${colors.error}15`,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  payButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: `${colors.success}15`,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: `${colors.error}15`,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  statsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});