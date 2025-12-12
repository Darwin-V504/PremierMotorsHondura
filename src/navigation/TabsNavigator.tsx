import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeS';
import ProfileScreen from '../screens/ProfileS';
import ServicesScreen from '../screens/services/ServicesS';
import HistoryScreen from '../screens/HistoryS';
import PlansScreen from '../screens/PlanS'; 
import { Ionicons } from '@expo/vector-icons';

export type TabsParamList = {
    Home: undefined;
    Services: undefined;
    History: undefined;
    Plans: undefined; // Nueva pestaña
    Profile: undefined;
}

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#FF0000',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopColor: '#E8E8E8',
                },
                headerStyle: {
                    backgroundColor: '#FF0000',
                },
                headerTintColor: '#FFFFFF',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Services"
                component={ServicesScreen}
                options={{
                    title: 'Servicios',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="construct" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    title: 'Historial',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Plans"
                component={PlansScreen}
                options={{
                    title: 'Planes',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}