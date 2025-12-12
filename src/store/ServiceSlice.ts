import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ServiceHistory } from "../infoutils/Services/infoServices";

interface ServiceState {
  plans: any;
  history: ServiceHistory[];
  upcomingServices: ServiceHistory[];
}

const initialState: ServiceState = {
  plans: null,
  history: [],
  upcomingServices: [],
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    // Agregar servicio al historial
    addService: (state, action: PayloadAction<ServiceHistory>) => {
      state.history.unshift(action.payload);
    },
    
    // Agregar servicio próximo
    addUpcomingService: (state, action: PayloadAction<ServiceHistory>) => {
      state.upcomingServices.push(action.payload);
    },
    
    // Completar servicio
    completeService: (state, action: PayloadAction<string>) => {
      const service = state.upcomingServices.find(s => s.id === action.payload);
      if (service) {
        service.status = 'completado';
        state.history.unshift(service);
        state.upcomingServices = state.upcomingServices.filter(s => s.id !== action.payload);
      }
    },
    
    // Cancelar servicio
    cancelService: (state, action: PayloadAction<string>) => {
      state.upcomingServices = state.upcomingServices.filter(s => s.id !== action.payload);
    },
    
    // Limpiar historial
    clearHistory: (state) => {
      state.history = [];
    }
  }
});

export const {
  addService,
  addUpcomingService,
  completeService,
  cancelService,
  clearHistory
} = serviceSlice.actions;

export default serviceSlice.reducer;