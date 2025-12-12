import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ServiceHistory } from "../infoutils/Services/infoServices";
import { Ionicons } from "@expo/vector-icons";
import CButton from "./CButton";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
// c
type Props = {
  item: ServiceHistory;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
  showActions?: boolean;
};

export default function ServiceCard({ item, onCancel, onComplete, showActions = false }: Props) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const styles = getStyles(colors);

  const getStatusColor = () => {
    switch (item.status) {
      case 'completado': return colors.success;
      case 'pendiente': return colors.warning;
      case 'cancelado': return colors.error;
      default: return colors.text;
    }
  };

  return (
    <View style={[styles.card, { borderLeftColor: getStatusColor() }]}>
      <View style={styles.header}>
        <Text style={styles.serviceName}>{item.service.name}</Text>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.detailsRow}>
        <Text style={styles.vehicleInfo}>
          {item.vehicleInfo.brand} {item.vehicleInfo.model} ({item.vehicleInfo.year})
        </Text>
        <Text style={styles.price}>L. {item.total}</Text>
      </View>
      
      <View style={styles.detailsRow}>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.duration}>
          {item.service.duration} min
        </Text>
      </View>
      
      {showActions && item.status === 'pendiente' && (
        <View style={styles.actions}>
          <CButton
            title="Completar"
            variant="primary"
            onPress={() => onComplete?.(item.id)}
            size="small"
          />
          <CButton
            title="Cancelar"
            variant="secondary"
            onPress={() => onCancel?.(item.id)}
            size="small"
          />
        </View>
      )}
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vehicleInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  duration: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
});