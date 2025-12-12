import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SERVICES, Service } from '../../infoutils/Services/infoServices';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../infoutils/theme';
import { Ionicons } from '@expo/vector-icons';
import CButton from '../../components/CButton';

export default function ServiceCatalogScreen({ navigation }: any) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const styles = getStyles(colors);

  const ServiceItem = ({ service }: { service: Service }) => {
    // Obtener nombres de las categorías
    const getCategoryName = (category: string) => {
      switch (category) {
        case 'pintura': return 'Pintura';
        case 'mecanica': return 'Mecánica';
        case 'mantenimiento': return 'Mantenimiento';
        case 'accesorios': return 'Accesorios';
        default: return category;
      }
    };

    // Obtener ícono según categoría
    const getCategoryIcon = (category: string) => {
      switch (category) {
        case 'pintura': return 'color-palette-outline';
        case 'mecanica': return 'construct-outline';
        case 'mantenimiento': return 'settings-outline';
        case 'accesorios': return 'cube-outline';
        default: return 'construct-outline';
      }
    };

    return (
      <View style={styles.serviceCard}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceTitleContainer}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <View style={styles.categoryBadge}>
              <Ionicons 
                name={getCategoryIcon(service.category) as any} 
                size={12} 
                color={colors.white} 
              />
              <Text style={styles.categoryBadgeText}>
                {getCategoryName(service.category)}
              </Text>
            </View>
          </View>
          <Text style={styles.servicePrice}>L. {service.price}</Text>
        </View>
        
        <Text style={styles.serviceDescription}>{service.description}</Text>
        
        <View style={styles.serviceDetails}>
          {/* Duración */}
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{service.duration} minutos</Text>
          </View>
          
          {/* Marcas compatibles */}
          <View style={styles.detailItem}>
            <Ionicons name="car-sport" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              {service.compatibleBrands?.join(', ') || 'Todas las marcas'}
            </Text>
          </View>
          
          {/* Modelos específicos si existen */}
          {service.compatibleModels && service.compatibleModels.length > 0 && (
            <View style={styles.detailItem}>
              <Ionicons name="list-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>
                {service.compatibleModels.length} modelo{service.compatibleModels.length !== 1 ? 's' : ''} específico{service.compatibleModels.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
          
          {/* Para mantenimientos, mostrar intervalo recomendado */}
          {service.requiresMileage && service.recommendedInterval && (
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>
                Cada {service.recommendedInterval.toLocaleString()} km
              </Text>
            </View>
          )}
        </View>
        
        {/* Botón de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => {
              // Mostrar más información o navegar a detalles
              Alert.alert(
                'Información del Servicio',
                `${service.name}\n\n${service.description}\n\n` +
                `Precio: L. ${service.price}\n` +
                `Duración: ${service.duration} minutos\n` +
                `Categoría: ${getCategoryName(service.category)}\n` +
                `Marcas compatibles: ${service.compatibleBrands?.join(', ') || 'Todas'}\n` +
                `${service.requiresMileage ? 'Requiere kilometraje: Sí' : ''}`
              );
            }}
          >
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.infoButtonText}>Más info</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.reserveButton}
            onPress={() => navigation.navigate('BookService', { service })}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.white} />
            <Text style={styles.reserveButtonText}>Reservar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Agrupar servicios por categoría
  const servicesByCategory: { [key: string]: Service[] } = {};
  SERVICES.forEach(service => {
    if (!servicesByCategory[service.category]) {
      servicesByCategory[service.category] = [];
    }
    servicesByCategory[service.category].push(service);
  });

  // Obtener nombre de categoría para mostrar
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'pintura': return 'Servicios de Pintura';
      case 'mecanica': return 'Servicios Mecánicos';
      case 'mantenimiento': return 'Mantenimientos Preventivos';
      case 'accesorios': return 'Accesorios';
      default: return category;
    }
  };

  // Obtener ícono de categoría
  const getCategoryDisplayIcon = (category: string) => {
    switch (category) {
      case 'pintura': return 'color-palette';
      case 'mecanica': return 'construct';
      case 'mantenimiento': return 'settings';
      case 'accesorios': return 'cube';
      default: return 'construct';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Catálogo de Servicios</Text>
          <Text style={styles.subtitle}>
            Servicios profesionales para tu vehículo
          </Text>
        </View>
        <CButton
          title="Plan Mantenimiento"
          onPress={() => navigation.navigate('MaintenancePaymentPlan')}
          variant="secondary"
          size="small"
        />
      </View>

      {/* Lista de servicios agrupados por categoría */}
      <FlatList
        data={Object.keys(servicesByCategory)}
        keyExtractor={(category) => category}
        renderItem={({ item: category }) => (
          <View style={styles.categorySection}>
            {/* Encabezado de categoría */}
            <View style={styles.categoryHeader}>
              <View style={styles.categoryHeaderLeft}>
                <Ionicons 
                  name={getCategoryDisplayIcon(category) as any} 
                  size={24} 
                  color={colors.primary} 
                />
                <Text style={styles.categoryTitle}>
                  {getCategoryDisplayName(category)}
                </Text>
              </View>
              <Text style={styles.servicesCount}>
                {servicesByCategory[category].length} servicio{servicesByCategory[category].length !== 1 ? 's' : ''}
              </Text>
            </View>
            
            {/* Lista de servicios de esta categoría */}
            <FlatList
              data={servicesByCategory[category]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ServiceItem service={item} />}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.serviceSeparator} />}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.categorySeparator} />}
      />
    </View>
  );
}

// Necesitamos importar Alert
import { Alert } from 'react-native';

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: 16,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
  },
  servicesCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categorySeparator: {
    height: 24,
  },
  serviceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceSeparator: {
    height: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceTitleContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  servicePrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  serviceDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  reserveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  reserveButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});