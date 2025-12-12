import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../infoutils/theme';
import CButton from '../components/CButton';
import { VEHICLE_MODELS, VehicleBrand } from '../infoutils/Services/infoServices';
import { Ionicons } from '@expo/vector-icons';
import { usePlans } from '../hooksredux/usePlans'; // Importar hook de planes

export default function MaintenancePaymentPlanScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const styles = getStyles(colors);
  const { addPlan, calculateNextPaymentDate, calculateInstallmentAmount } = usePlans(); // Usar hook

  const [selectedBrand, setSelectedBrand] = useState<VehicleBrand>('CHANGAN');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [currentMileage, setCurrentMileage] = useState<string>('');
  const [nextMaintenance, setNextMaintenance] = useState<{mileage: number, price: number} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'app' | 'efectivo' | null>(null);
  const [paymentFrequency, setPaymentFrequency] = useState<'semanal' | 'quincenal' | 'mensual' | null>(null);

  // Inicializar modelo cuando cambia la marca
  useEffect(() => {
    if (selectedBrand && VEHICLE_MODELS[selectedBrand] && VEHICLE_MODELS[selectedBrand].length > 0) {
      setSelectedModel(VEHICLE_MODELS[selectedBrand][0]);
    }
  }, [selectedBrand]);

  // Mantenimientos disponibles
  const MAINTENANCE_PLANS = [
    { mileage: 5000, price: 6500 },
    { mileage: 10000, price: 7650 },
    { mileage: 15000, price: 8200 },
    { mileage: 20000, price: 9500 },
    { mileage: 25000, price: 11000 },
  ];

  // Calcular próximo mantenimiento
  const calculateNextMaintenance = () => {
    if (!currentMileage) return;
    
    const mileage = parseInt(currentMileage);
    let nextPlan = null;
    
    for (const plan of MAINTENANCE_PLANS) {
      if (plan.mileage > mileage) {
        nextPlan = plan;
        break;
      }
    }
    
    if (nextPlan) {
      setNextMaintenance({
        mileage: nextPlan.mileage,
        price: nextPlan.price
      });
    } else {
      // Si ya pasó el último, sugerir el primero
      setNextMaintenance(MAINTENANCE_PLANS[0]);
    }
  };

  useEffect(() => {
    if (currentMileage) {
      calculateNextMaintenance();
    }
  }, [currentMileage]);

  // Obtener marcas disponibles
  const getAvailableBrands = (): VehicleBrand[] => {
    return Object.keys(VEHICLE_MODELS) as VehicleBrand[];
  };

  const handleAcceptPlan = () => {
    if (!nextMaintenance || !paymentMethod || !paymentFrequency || !selectedModel || !year) {
      Alert.alert('Completa la información', 'Por favor completa todos los campos requeridos');
      return;
    }

    // Calcular cuota
    const installmentAmount = calculateInstallmentAmount(nextMaintenance.price, paymentFrequency);
    
    // Calcular número de cuotas
    let totalInstallments = 0;
    switch (paymentFrequency) {
      case 'semanal':
        totalInstallments = 12; // 12 semanas = 3 meses
        break;
      case 'quincenal':
        totalInstallments = 6; // 6 quincenas = 3 meses
        break;
      case 'mensual':
        totalInstallments = 3; // 3 meses
        break;
    }

    // Crear el objeto del plan
    const newPlan = {
      vehicleBrand: selectedBrand,
      vehicleModel: selectedModel,
      year: parseInt(year),
      maintenanceMileage: nextMaintenance.mileage,
      nextPaymentDate: calculateNextPaymentDate(paymentFrequency),
      paymentMethod: paymentMethod,
      frequency: paymentFrequency,
      installmentAmount: installmentAmount,
      totalInstallments: totalInstallments,
      paidInstallments: 0,
      totalAmount: nextMaintenance.price,
      status: 'activo' as const
    };

    // Guardar el plan en Redux
    addPlan(newPlan);

    const paymentMethodText = 
      paymentMethod === 'tarjeta' ? 'Tarjeta de crédito' : 
      paymentMethod === 'app' ? 'App móvil' : 'Efectivo';
    
    const frequencyText = 
      paymentFrequency === 'semanal' ? 'semanas' : 
      paymentFrequency === 'quincenal' ? 'quincenas' : 'meses';

    Alert.alert(
      '¡Plan Creado Exitosamente!',
      `Plan de mantenimiento a ${nextMaintenance.mileage.toLocaleString()} km por L. ${nextMaintenance.price.toLocaleString()}\n` +
      `Vehículo: ${selectedBrand} ${selectedModel} (${year})\n` +
      `Pago: ${paymentMethodText}\n` +
      `Frecuencia: ${paymentFrequency} por ${totalInstallments} ${frequencyText}\n` +
      `Cuota: L. ${installmentAmount.toLocaleString()}`,
      [
        {
          text: 'Ver mis planes',
          onPress: () => {
            // Navegar a la pantalla de planes
            navigation.navigate('Tabs', { screen: 'Plans' });
          }
        },
        {
          text: 'Crear otro plan',
          onPress: () => {
            // Resetear el formulario
            setCurrentMileage('');
            setNextMaintenance(null);
            setPaymentMethod(null);
            setPaymentFrequency(null);
          }
        }
      ]
    );
  };

  const handleRejectPlan = () => {
    Alert.alert(
      'Rechazar Plan',
      '¿Estás seguro de que deseas rechazar este plan de mantenimiento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sí, rechazar',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Plan de Pago para Mantenimientos</Text>

        {/* Paso 1: Seleccionar vehículo */}
        <View style={styles.stepSection}>
          <Text style={styles.stepTitle}>1. Selecciona tu vehículo</Text>
          
          <Text style={styles.label}>Marca:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.optionsRow}>
              {getAvailableBrands().map(brand => (
                <TouchableOpacity
                  key={brand}
                  style={[
                    styles.optionButton,
                    selectedBrand === brand && styles.optionButtonSelected
                  ]}
                  onPress={() => {
                    setSelectedBrand(brand);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    selectedBrand === brand && styles.optionTextSelected
                  ]}>
                    {brand}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.label}>Modelo:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.optionsRow}>
              {selectedBrand && VEHICLE_MODELS[selectedBrand]?.map((model: string) => (
                <TouchableOpacity
                  key={model}
                  style={[
                    styles.optionButton,
                    selectedModel === model && styles.optionButtonSelected
                  ]}
                  onPress={() => setSelectedModel(model)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedModel === model && styles.optionTextSelected
                  ]}>
                    {model}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.label}>Año del vehículo:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: 2023"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            maxLength={4}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Paso 2: Kilometraje */}
        <View style={styles.stepSection}>
          <Text style={styles.stepTitle}>2. Kilometraje actual</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: 8,500 km"
            value={currentMileage}
            onChangeText={setCurrentMileage}
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
          <Text style={styles.helperText}>
            Ingresa el kilometraje actual para calcular el próximo mantenimiento
          </Text>
        </View>

        {/* Paso 3: Mostrar valor */}
        {nextMaintenance && (
          <View style={styles.stepSection}>
            <Text style={styles.stepTitle}>3. Próximo mantenimiento</Text>
            <View style={styles.maintenanceCard}>
              <View style={styles.maintenanceHeader}>
                <Ionicons name="construct" size={24} color={colors.primary} />
                <Text style={styles.maintenanceText}>
                  Mantenimiento a los {nextMaintenance.mileage.toLocaleString()} km
                </Text>
              </View>
              <Text style={styles.maintenancePrice}>
                L. {nextMaintenance.price.toLocaleString()}
              </Text>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleInfoText}>
                  {selectedBrand} {selectedModel} {year ? `(${year})` : ''}
                </Text>
              </View>
              <Text style={styles.maintenanceNote}>
                Este es el costo promedio para tu vehículo
              </Text>
            </View>
          </View>
        )}

        {/* Paso 4: Método de pago */}
        {nextMaintenance && (
          <View style={styles.stepSection}>
            <Text style={styles.stepTitle}>4. Método de pago</Text>
            <Text style={styles.label}>Selecciona cómo quieres pagar:</Text>
            <View style={styles.paymentMethods}>
              <TouchableOpacity
                style={[
                  styles.paymentMethod,
                  paymentMethod === 'tarjeta' && styles.paymentMethodSelected
                ]}
                onPress={() => setPaymentMethod('tarjeta')}
              >
                <View style={styles.paymentIcon}>
                  <Ionicons 
                    name="card" 
                    size={24} 
                    color={paymentMethod === 'tarjeta' ? colors.white : colors.primary} 
                  />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={[
                    styles.paymentMethodText,
                    paymentMethod === 'tarjeta' && styles.paymentMethodTextSelected
                  ]}>
                    Tarjeta de crédito
                  </Text>
                  <Text style={styles.paymentMethodSubtext}>
                    Cuotas automáticas
                  </Text>
                </View>
                {paymentMethod === 'tarjeta' && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.white} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentMethod,
                  paymentMethod === 'app' && styles.paymentMethodSelected
                ]}
                onPress={() => setPaymentMethod('app')}
              >
                <View style={styles.paymentIcon}>
                  <Ionicons 
                    name="phone-portrait" 
                    size={24} 
                    color={paymentMethod === 'app' ? colors.white : colors.primary} 
                  />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={[
                    styles.paymentMethodText,
                    paymentMethod === 'app' && styles.paymentMethodTextSelected
                  ]}>
                    App móvil
                  </Text>
                  <Text style={styles.paymentMethodSubtext}>
                    Pagar cuotas en la app
                  </Text>
                </View>
                {paymentMethod === 'app' && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.white} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentMethod,
                  paymentMethod === 'efectivo' && styles.paymentMethodSelected
                ]}
                onPress={() => setPaymentMethod('efectivo')}
              >
                <View style={styles.paymentIcon}>
                  <Ionicons 
                    name="cash" 
                    size={24} 
                    color={paymentMethod === 'efectivo' ? colors.white : colors.primary} 
                  />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={[
                    styles.paymentMethodText,
                    paymentMethod === 'efectivo' && styles.paymentMethodTextSelected
                  ]}>
                    Pago en caja
                  </Text>
                  <Text style={styles.paymentMethodSubtext}>
                    Presencial en sucursal
                  </Text>
                </View>
                {paymentMethod === 'efectivo' && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.white} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Paso 5: Frecuencia de pago */}
        {paymentMethod && (
          <View style={styles.stepSection}>
            <Text style={styles.stepTitle}>5. Frecuencia de pago</Text>
            <Text style={styles.label}>Selecciona cada cuánto quieres pagar (máximo 3 meses):</Text>
            <View style={styles.frequencyContainer}>
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  paymentFrequency === 'semanal' && styles.frequencyButtonSelected
                ]}
                onPress={() => {
                  setPaymentFrequency('semanal');
                }}
              >
                <Text style={[
                  styles.frequencyText,
                  paymentFrequency === 'semanal' && styles.frequencyTextSelected
                ]}>
                  Semanal
                </Text>
                <Text style={styles.frequencySubtext}>
                  12 pagos (3 meses)
                </Text>
                <Text style={styles.frequencyAmount}>
                  L. {nextMaintenance ? Math.ceil(nextMaintenance.price / 12) : 0}/semana
                </Text>
                {paymentFrequency === 'semanal' && (
                  <View style={styles.frequencyCheck}>
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  paymentFrequency === 'quincenal' && styles.frequencyButtonSelected
                ]}
                onPress={() => {
                  setPaymentFrequency('quincenal');
                }}
              >
                <Text style={[
                  styles.frequencyText,
                  paymentFrequency === 'quincenal' && styles.frequencyTextSelected
                ]}>
                  Quincenal
                </Text>
                <Text style={styles.frequencySubtext}>
                  6 pagos (3 meses)
                </Text>
                <Text style={styles.frequencyAmount}>
                  L. {nextMaintenance ? Math.ceil(nextMaintenance.price / 6) : 0}/quincena
                </Text>
                {paymentFrequency === 'quincenal' && (
                  <View style={styles.frequencyCheck}>
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  paymentFrequency === 'mensual' && styles.frequencyButtonSelected
                ]}
                onPress={() => {
                  setPaymentFrequency('mensual');
                }}
              >
                <Text style={[
                  styles.frequencyText,
                  paymentFrequency === 'mensual' && styles.frequencyTextSelected
                ]}>
                  Mensual
                </Text>
                <Text style={styles.frequencySubtext}>
                  3 pagos (3 meses)
                </Text>
                <Text style={styles.frequencyAmount}>
                  L. {nextMaintenance ? Math.ceil(nextMaintenance.price / 3) : 0}/mes
                </Text>
                {paymentFrequency === 'mensual' && (
                  <View style={styles.frequencyCheck}>
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Resumen del plan */}
        {nextMaintenance && paymentMethod && paymentFrequency && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Resumen de tu Plan</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Vehículo:</Text>
                <Text style={styles.summaryValue}>
                  {selectedBrand} {selectedModel} {year ? `(${year})` : ''}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Próximo mantenimiento:</Text>
                <Text style={styles.summaryValue}>
                  {nextMaintenance.mileage.toLocaleString()} km
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Costo total:</Text>
                <Text style={styles.summaryValue}>
                  L. {nextMaintenance.price.toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Método de pago:</Text>
                <Text style={styles.summaryValue}>
                  {paymentMethod === 'tarjeta' ? 'Tarjeta de crédito' : 
                   paymentMethod === 'app' ? 'App móvil' : 'Pago en caja'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Frecuencia:</Text>
                <Text style={styles.summaryValue}>
                  {paymentFrequency}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.actions}>
          <CButton
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="tertiary"
            size="medium"
          />
          <CButton
            title="Rechazar Plan"
            onPress={handleRejectPlan}
            variant="secondary"
            size="medium"
          />
          <CButton
            title="Aceptar Plan"
            onPress={handleAcceptPlan}
            disabled={!nextMaintenance || !paymentMethod || !paymentFrequency}
            variant="primary"
            size="medium"
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
    marginBottom: 24,
  },
  stepSection: {
    marginBottom: 28,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  maintenanceCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  maintenanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  maintenanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  maintenancePrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 12,
  },
  vehicleInfo: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  vehicleInfoText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  maintenanceNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  paymentMethods: {
    gap: 12,
    marginTop: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  paymentMethodSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  paymentMethodTextSelected: {
    color: colors.white,
  },
  paymentMethodSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  frequencyContainer: {
    gap: 12,
    marginTop: 8,
  },
  frequencyButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  frequencyButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  frequencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  frequencyTextSelected: {
    color: colors.white,
  },
  frequencySubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  frequencyAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  frequencyCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summarySection: {
    marginBottom: 24,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.border}50`,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  actions: {
    gap: 12,
    marginTop: 20,
  },
});