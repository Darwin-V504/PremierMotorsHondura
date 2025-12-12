import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginS from '../screens/LoginS';
import RegisterS from '../screens/RegisterS';
import HomeS from '../screens/HomeS';
import TabsNavigator from './TabsNavigator';
import IndexS from '../screens/IndexS';
import BookServiceScreen from '../screens/services/BookServiceS';
import ServiceCatalogScreen from '../screens/services/ServiceCatalog';
import VehicleInfoScreen from '../screens/services/VehicleInfoS';
import MaintenancePaymentPlanScreen from '../screens/MainteinancePaymentPlanS';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Tabs: { email: string };
    Home: undefined;
    Index: undefined;
    BookService: undefined;
    ServiceCatalog: undefined;
    VehicleInfo: undefined;
    MaintenancePaymentPlan: undefined; 
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    return (
        <Stack.Navigator initialRouteName='Index'
                         screenOptions={{
                             headerShown: false,
                             animation: 'slide_from_right'
                         }}>
            <Stack.Screen name="Index" component={IndexS} />
            <Stack.Screen name="Login" component={LoginS} />
            <Stack.Screen name="Register" component={RegisterS} />
            <Stack.Screen name="Tabs" component={TabsNavigator} />
            <Stack.Screen
                name="BookService"
                component={BookServiceScreen}
                options={{
                    headerShown: true,
                    title: 'Reservar Servicio',
                    headerStyle: { backgroundColor: '#FF0000' },
                    headerTintColor: '#FFFFFF',
                }}
            />
            <Stack.Screen
                name="ServiceCatalog"
                component={ServiceCatalogScreen}
                options={{
                    headerShown: true,
                    title: 'Catálogo de Servicios',
                    headerStyle: { backgroundColor: '#FF0000' },
                    headerTintColor: '#FFFFFF',
                }}
            />
            <Stack.Screen
                name="VehicleInfo"
                component={VehicleInfoScreen}
                options={{
                    headerShown: true,
                    title: 'Información del Vehículo',
                    headerStyle: { backgroundColor: '#FF0000' },
                    headerTintColor: '#FFFFFF',
                }}
            />
            <Stack.Screen
                name="MaintenancePaymentPlan"
                component={MaintenancePaymentPlanScreen}
                options={{
                    headerShown: true,
                    title: 'Plan de Pago Mantenimiento',
                    headerStyle: { backgroundColor: '#FF0000' },
                    headerTintColor: '#FFFFFF',
                }}
            />
        </Stack.Navigator>
    );
}