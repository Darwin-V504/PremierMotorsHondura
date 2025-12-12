import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../infoutils/theme';
import { 
  VEHICLE_MODELS,
  SERVICE_CATEGORIES, 
  VehicleBrand,
  Service,
  SERVICES } from '../../infoutils/Services/infoServices';
import CButton from '../../components/CButton';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onServiceSelected: (service: Service, vehicleInfo: any) => void;
  initialBrand?: VehicleBrand;
  initialModel?: string;
};

export default function VehicleServiceSelector({ 
  onServiceSelected, 
  initialBrand,
  initialModel 
}: Props) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const styles = getStyles(colors);

  const [selectedBrand, setSelectedBrand] = useState<VehicleBrand>(initialBrand || 'CHANGAN');
  const [selectedModel, setSelectedModel] = useState<string>(initialModel || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('pintura');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [vehicleYear, setVehicleYear] = useState<string>('');
  const [mileage, setMileage] = useState<string>('');

  // Filtrar servicios compatibles
  const filteredServices = SERVICES.filter(service => {
    // Filtrar por categoría
    if (service.category !== selectedCategory) return false;
    
    // Filtrar por marca compatible
    if (!service.compatibleBrands.includes(selectedBrand)) return false;
    
    // Filtrar por modelos específicos si existen
    if (service.compatibleModels && service.compatibleModels.length > 0) {
      return service.compatibleModels.includes(selectedModel);
    }
    
    return true;
  });

  // Calcular próximo mantenimiento
  const calculateNextMaintenance = () => {
    if (!mileage || !selectedService?.recommendedInterval) return null;
    
    const currentMileage = parseInt(mileage);
    const interval = selectedService.recommendedInterval;
    
    // Encontrar el próximo múltiplo
    const nextMaintenance = Math.ceil(currentMileage / interval) * interval;
    
    return {
      nextMileage: nextMaintenance,
      price: selectedService.price
    };
  };

  const handleServiceSelect = (service: Service) => {
    if (service.requiresMileage && !mileage) {
      Alert.alert('Kilometraje requerido', 'Este servicio requiere ingresar el kilometraje actual');
      return;
    }
    
    setSelectedService(service);
    
    const vehicleInfo = {
      brand: selectedBrand,
      model: selectedModel,
      year: vehicleYear ? parseInt(vehicleYear) : new Date().getFullYear(),
      mileage: mileage ? parseInt(mileage) : undefined
    };
    
    onServiceSelected(service, vehicleInfo);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Selección de Marca */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecciona la Marca</Text>
        <View style={styles.brandContainer}>
          {Object.keys(VEHICLE_MODELS).map(brand => (
            <TouchableOpacity
              key={brand}
              style={[
                styles.brandButton,
                selectedBrand === brand && styles.brandButtonSelected
              ]}
              onPress={() => {
                setSelectedBrand(brand as VehicleBrand);
                setSelectedModel(VEHICLE_MODELS[brand as VehicleBrand][0]);
              }}
            >
              <Text style={[
                styles.brandText,
                selectedBrand === brand && styles.brandTextSelected
              ]}>
                {brand}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Selección de Modelo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecciona el Modelo</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.modelsContainer}>
            {VEHICLE_MODELS[selectedBrand].map(model => (
              <TouchableOpacity
                key={model}
                style={[
                  styles.modelButton,
                  selectedModel === model && styles.modelButtonSelected
                ]}
                onPress={() => setSelectedModel(model)}
              >
                <Text style={[
                  styles.modelText,
                  selectedModel === model && styles.modelTextSelected
                ]}>
                  {model}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Año del Vehículo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Año del Vehículo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 2023"
          value={vehicleYear}
          onChangeText={setVehicleYear}
          keyboardType="numeric"
          maxLength={4}
        />
      </View>

      {/* Kilometraje (para mantenimientos) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kilometraje Actual (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 8500 km"
          value={mileage}
          onChangeText={setMileage}
          keyboardType="numeric"
        />
      </View>

      {/* Categorías de Servicio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Servicio</Text>
        <View style={styles.categoriesContainer}>
          {Object.keys(SERVICE_CATEGORIES).map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextSelected
              ]}>
                {category === 'pintura' ? 'Pintura' : 
                 category === 'mecanica' ? 'Mecánica' :
                 category === 'mantenimiento' ? 'Mantenimiento' : 'Accesorios'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Servicios Disponibles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Servicios Disponibles para {selectedBrand} {selectedModel}
        </Text>
        
        {filteredServices.length === 0 ? (
          <Text style={styles.noServicesText}>
            No hay servicios disponibles para esta combinación
          </Text>
        ) : (
          filteredServices.map(service => {
            const nextMaintenance = service.requiresMileage ? calculateNextMaintenance() : null;
            
            return (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceCard,
                  selectedService?.id === service.id && styles.serviceCardSelected
                ]}
                onPress={() => handleServiceSelect(service)}
              >
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.servicePrice}>L. {service.price}</Text>
                </View>
                
                <Text style={styles.serviceDescription}>{service.description}</Text>
                
                {nextMaintenance && (
                  <View style={styles.maintenanceInfo}>
                    <Ionicons name="speedometer" size={16} color={colors.primary} />
                    <Text style={styles.maintenanceText}>
                      Próximo mantenimiento a los {nextMaintenance.nextMileage} km
                    </Text>
                  </View>
                )}
                
                <View style={styles.serviceFooter}>
                  <Text style={styles.durationText}>
                    <Ionicons name="time-outline" size={14} /> {service.duration} min
                  </Text>
                  <Text style={styles.compatibleText}>
                    Compatible ✓
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Información del Servicio Seleccionado */}
      {selectedService && (
        <View style={styles.selectedServiceSection}>
          <Text style={styles.selectedTitle}>Servicio Seleccionado:</Text>
          <View style={styles.selectedServiceCard}>
            <Text style={styles.selectedServiceName}>{selectedService.name}</Text>
            <Text style={styles.selectedVehicleInfo}>
              Para: {selectedBrand} {selectedModel} {vehicleYear ? `(${vehicleYear})` : ''}
            </Text>
            <Text style={styles.selectedPrice}>Total: L. {selectedService.price}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  brandContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  brandButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brandButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  brandText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  brandTextSelected: {
    color: colors.white,
  },
  modelsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  modelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modelButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modelText: {
    fontSize: 12,
    color: colors.text,
  },
  modelTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: colors.white,
  },
  serviceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundAlt,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  maintenanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  maintenanceText: {
    marginLeft: 8,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  compatibleText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  noServicesText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontStyle: 'italic',
    padding: 20,
  },
  selectedServiceSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  selectedServiceCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    padding: 16,
  },
  selectedServiceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  selectedVehicleInfo: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  selectedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
});