import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  TextInput,
  Dimensions
} from 'react-native';
import { useState } from 'react';
import CButton from '../../components/CButton';
import { 
  SERVICES, 
  Service, 
  VehicleBrand
} from '../../infoutils/Services/infoServices';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../infoutils/theme';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function ServicesScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedBrand, setSelectedBrand] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const styles = getStyles(colors);

  const categories = [
    { id: 'todos', name: 'Todos', icon: 'apps' },
    { id: 'pintura', name: 'Pintura', icon: 'color-palette' },
    { id: 'mecanica', name: 'Mecánica', icon: 'construct' },
    { id: 'mantenimiento', name: 'Mantenimiento', icon: 'build' },
    { id: 'accesorios', name: 'Accesorios', icon: 'cube' }
  ];

  const brands = ['todos', 'CHANGAN', 'GWM', 'ZX', 'Otro'];

  // Filtrar servicios
  const filteredServices = SERVICES.filter(service => {
    // Filtro por categoría
    const categoryMatch = selectedCategory === 'todos' || service.category === selectedCategory;
    
    // Filtro por marca
    const brandMatch = selectedBrand === 'todos' || 
      (service.compatibleBrands && service.compatibleBrands.includes(selectedBrand as VehicleBrand));
    
    // Filtro por búsqueda
    const searchMatch = !searchQuery || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && brandMatch && searchMatch;
  });

  const ServiceItem = ({ service }: { service: Service }) => {
    // Obtener ícono según categoría
    const getCategoryIcon = () => {
      switch (service.category) {
        case 'pintura': return 'color-palette-outline';
        case 'mecanica': return 'construct-outline';
        case 'mantenimiento': return 'build-outline';
        case 'accesorios': return 'cube-outline';
        default: return 'construct-outline';
      }
    };

    // Obtener color de categoría
    const getCategoryColor = () => {
      switch (service.category) {
        case 'pintura': return '#FF6B6B';
        case 'mecanica': return '#4ECDC4';
        case 'mantenimiento': return '#FFD166';
        case 'accesorios': return '#06D6A0';
        default: return colors.primary;
      }
    };

    // Truncar texto largo pero no demasiado corto
    const truncateText = (text: string, maxLength: number = 40) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };

    return (
      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() => navigation.navigate('BookService', { service })}
        activeOpacity={0.9}
      >
        {/* Encabezado del servicio */}
        <View style={styles.serviceHeader}>
          <View style={styles.serviceIconContainer}>
            <View style={[styles.serviceIcon, { backgroundColor: `${getCategoryColor()}20` }]}>
              <Ionicons 
                name={getCategoryIcon() as any} 
                size={24} 
                color={getCategoryColor()} 
              />
            </View>
            <View style={styles.serviceTitleContainer}>
              <Text style={styles.serviceName} numberOfLines={1} ellipsizeMode="tail">
                {service.name}
              </Text>
              <View style={styles.categoryBadge}>
                <Text style={[styles.categoryBadgeText, { color: getCategoryColor() }]}>
                  {service.category === 'pintura' ? 'Pintura' : 
                   service.category === 'mecanica' ? 'Mecánica' :
                   service.category === 'mantenimiento' ? 'Mantenimiento' : 'Accesorios'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.servicePriceContainer}>
            <Text style={styles.servicePrice}>L. {service.price}</Text>
          </View>
        </View>

        {/* Descripción */}
        <Text style={styles.serviceDescription} numberOfLines={2} ellipsizeMode="tail">
          {truncateText(service.description, 60)}
        </Text>

        {/* Detalles */}
        <View style={styles.serviceDetails}>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>{service.duration} min</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="car-sport-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
                {service.compatibleBrands?.join(', ') || 'Todas'}
              </Text>
            </View>
          </View>

          {/* Marcas compatibles */}
          {service.compatibleBrands && service.compatibleBrands.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.brandsScroll}
              contentContainerStyle={styles.brandsContainer}
            >
              {service.compatibleBrands.map(brand => (
                <View key={brand} style={styles.brandTag}>
                  <Text style={styles.brandTagText}>{brand}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Botón de acción */}
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => navigation.navigate('BookService', { service })}
        >
          <Text style={styles.reserveButtonText}>Reservar</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const HeaderSection = () => (
    <>
      {/* Header principal */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Nuestros Servicios</Text>
          <Text style={styles.headerSubtitle}>
            Encuentra el servicio perfecto para tu vehículo
          </Text>
        </View>
        <View style={styles.headerActions}>
          <CButton
            title="Reservar"
            onPress={() => navigation.navigate('BookService')}
            variant="primary"
            size="small"
          />
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar servicios..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros de categoría */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <View style={[
                styles.categoryIcon,
                selectedCategory === category.id && styles.categoryIconActive
              ]}>
                <Ionicons 
                  name={category.icon as any} 
                  size={22} 
                  color={selectedCategory === category.id ? colors.white : colors.primary} 
                />
              </View>
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextActive
              ]} numberOfLines={1}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filtros de marca */}
      <View style={styles.brandsSection}>
        <Text style={styles.sectionTitle}>Marcas</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandsScrollContent}
        >
          {brands.map(brand => (
            <TouchableOpacity
              key={brand}
              style={[
                styles.brandButton,
                selectedBrand === brand && styles.brandButtonActive
              ]}
              onPress={() => setSelectedBrand(brand)}
            >
              <Text style={[
                styles.brandButtonText,
                selectedBrand === brand && styles.brandButtonTextActive
              ]} numberOfLines={1}>
                {brand === 'todos' ? 'Todas' : brand}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Contador y filtros */}
      <View style={styles.resultsHeader}>
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsCount}>
            {filteredServices.length} {filteredServices.length === 1 ? 'servicio' : 'servicios'} encontrados
          </Text>
          {(selectedCategory !== 'todos' || selectedBrand !== 'todos' || searchQuery) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedCategory('todos');
                setSelectedBrand('todos');
                setSearchQuery('');
              }}
            >
              <Ionicons name="close-circle" size={16} color={colors.primary} />
              <Text style={styles.clearFiltersText}>Limpiar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Botón Plan Mantenimiento */}
      <View style={styles.maintenancePlanSection}>
        <TouchableOpacity
          style={styles.maintenancePlanButton}
          onPress={() => navigation.navigate('MaintenancePaymentPlan')}
        >
          <View style={styles.maintenancePlanIcon}>
            <Ionicons name="construct" size={24} color={colors.white} />
          </View>
          <View style={styles.maintenancePlanContent}>
            <Text style={styles.maintenancePlanTitle}>Plan de Mantenimiento</Text>
            <Text style={styles.maintenancePlanDescription} numberOfLines={2}>
              Programa mantenimientos preventivos con planes de pago flexibles
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={80} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No se encontraron servicios</Text>
      <Text style={styles.emptySubtitle} numberOfLines={2}>
        {searchQuery 
          ? `No hay resultados para "${searchQuery}"`
          : 'No hay servicios disponibles con los filtros seleccionados'
        }
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => {
          setSelectedCategory('todos');
          setSelectedBrand('todos');
          setSearchQuery('');
        }}
      >
        <Text style={styles.emptyButtonText}>Ver todos los servicios</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {filteredServices.length === 0 ? (
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <HeaderSection />
          <EmptyState />
        </ScrollView>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ServiceItem service={item} />}
          ListHeaderComponent={<HeaderSection />}
          ListEmptyComponent={<EmptyState />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          ItemSeparatorComponent={() => <View style={styles.serviceSeparator} />}
          ListFooterComponent={<View style={styles.footer} />}
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
    minHeight: height,
  },
  flatListContent: {
    paddingBottom: 100,
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  headerActions: {
    marginLeft: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.text,
  },
  clearSearchButton: {
    padding: 4,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  categoriesScrollContent: {
    paddingRight: 20,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryIconActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoryButtonTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  brandsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  brandsScrollContent: {
    paddingRight: 20,
  },
  brandButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
    alignItems: 'center',
  },
  brandButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  brandButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  brandButtonTextActive: {
    color: colors.white,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 16,
  },
  clearFiltersText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  maintenancePlanSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  maintenancePlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  maintenancePlanIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  maintenancePlanContent: {
    flex: 1,
  },
  maintenancePlanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  maintenancePlanDescription: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 16,
  },
  serviceSeparator: {
    height: 16,
  },
  serviceCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceTitleContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 24,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  servicePriceContainer: {
    marginLeft: 12,
    minWidth: 80,
  },
  servicePrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'right',
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
    minHeight: 40,
  },
  serviceDetails: {
    marginBottom: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  brandsScroll: {
    maxHeight: 40,
  },
  brandsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingRight: 10,
  },
  brandTag: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  brandTagText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  reserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  reserveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginRight: 8,
  },
  emptyState: {
    paddingHorizontal: 40,
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
    lineHeight: 28,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  footer: {
    height: 100,
  },
});