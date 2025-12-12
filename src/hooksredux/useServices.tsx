import { useAppDispatch, useAppSelector } from "../store/hooks";
import { 
    addService, 
    addUpcomingService, 
    completeService, 
    cancelService 
} from "../store/ServiceSlice";
import { Service, ServiceHistory } from "../infoutils/Services/infoServices";

export const useServices = () => {
    const dispatch = useAppDispatch();
    const services = useAppSelector(state => state.services);

    // Agregar servicio al historial
    const addServiceToHistory = (serviceHistory: ServiceHistory) => {
        dispatch(addService(serviceHistory));
    };

    // Agregar servicio próximo
    const addUpcomingServiceToSchedule = (serviceHistory: ServiceHistory) => {
        dispatch(addUpcomingService(serviceHistory));
    };

    // Completar servicio
    const completeScheduledService = (id: string) => {
        dispatch(completeService(id));
    };

    // Cancelar servicio
    const cancelScheduledService = (id: string) => {
        dispatch(cancelService(id));
    };

    return {
        serviceHistory: services.history,
        upcomingServices: services.upcomingServices,
        addService: addServiceToHistory,
        addUpcomingService: addUpcomingServiceToSchedule,
        completeService: completeScheduledService,
        cancelService: cancelScheduledService
    };
};