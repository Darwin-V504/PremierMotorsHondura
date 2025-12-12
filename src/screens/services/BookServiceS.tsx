import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import CButton from '../../components/CButton';
import { useServices } from '../../hooksredux/useServices';
import { Service, ServiceHistory } from '../../infoutils/Services/infoServices';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../infoutils/theme';
import VehicleServiceSelector from './VechicleServiceSelector';
export default function BookServiceScreen({ navigation, route }: any) {
  const { addUpcomingService } = useServices();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const styles = getStyles(colors);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);

  const handleServiceSelected = (service: Service, info: any) => {
    setSelectedService(service);
    setVehicleInfo(info);
  };

  const handleBookService = () => {
    if (!selectedService || !vehicleInfo) {
      Alert.alert('Error', 'Por favor selecciona un servicio y completa la información del vehículo');
      return;
    }

    const serviceHistory: ServiceHistory = {
      id: Date.now().toString(),
      service: selectedService,
      date: new Date().toISOString(),
      vehicleInfo: {
        brand: vehicleInfo.brand,
        model: vehicleInfo.model,
        year: vehicleInfo.year,
        type: 'carro', // Puedes ajustar esto
        mileage: vehicleInfo.mileage,
      },
      status: 'pendiente',
      total: selectedService.price
    };

    addUpcomingService(serviceHistory);
    
    Alert.alert(
      'Servicio Reservado',
      `Tu servicio de ${selectedService.name} para ${vehicleInfo.brand} ${vehicleInfo.model} ha sido reservado exitosamente.`,
      [
        {
          text: 'Ver Mis Servicios',
          onPress: () => navigation.navigate('Tabs', { screen: 'History' })
        },
        {
          text: 'Seguir Reservando',
          onPress: () => {
            setSelectedService(null);
            setVehicleInfo(null);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reservar Servicio Específico</Text>
        
        {/* Usar el nuevo selector */}
        <VehicleServiceSelector onServiceSelected={handleServiceSelected} />
        
        {/* Botones de acción */}
        {selectedService && (
          <View style={styles.actions}>
            <CButton
              title="Cancelar"
              onPress={() => navigation.goBack()}
              variant="tertiary"
            />
            <CButton
              title={`Reservar Servicio - L. ${selectedService.price}`}
              onPress={handleBookService}
              variant="primary"
            />
          </View>
        )}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    gap: 12,
    marginTop: 20,
  },
});