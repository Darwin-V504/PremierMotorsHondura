import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PaymentMethod = 'tarjeta' | 'app' | 'efectivo';
export type PaymentFrequency = 'semanal' | 'quincenal' | 'mensual';
export type PlanStatus = 'activo' | 'completado' | 'cancelado';

export interface MaintenancePlan {
  id: string;
  vehicleBrand: string;
  vehicleModel: string;
  year: number;
  maintenanceMileage: number;
  nextPaymentDate: string;
  paymentMethod: PaymentMethod;
  frequency: PaymentFrequency;
  installmentAmount: number;
  totalInstallments: number;
  paidInstallments: number;
  totalAmount: number;
  status: PlanStatus;
  createdAt: string;
}

interface PlanState {
  plans: MaintenancePlan[];
}

const initialState: PlanState = {
  plans: [
    {
      id: '1',
      vehicleBrand: 'CHANGAN',
      vehicleModel: 'New CS55 Plus',
      year: 2023,
      maintenanceMileage: 10000,
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      paymentMethod: 'tarjeta',
      frequency: 'mensual',
      installmentAmount: 2550,
      totalInstallments: 3,
      paidInstallments: 1,
      totalAmount: 7650,
      status: 'activo',
      createdAt: new Date().toISOString()
    },
]
};

const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    // Agregar nuevo plan
    addPlan: (state, action: PayloadAction<Omit<MaintenancePlan, 'id' | 'createdAt'>>) => {
      const newPlan: MaintenancePlan = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      state.plans.unshift(newPlan);
    },

    // Cancelar plan
    cancelPlan: (state, action: PayloadAction<string>) => {
      const plan = state.plans.find(p => p.id === action.payload);
      if (plan) {
        plan.status = 'cancelado';
      }
    },

    // Marcar pago realizado
    markPayment: (state, action: PayloadAction<string>) => {
      const plan = state.plans.find(p => p.id === action.payload);
      if (plan && plan.paidInstallments < plan.totalInstallments) {
        plan.paidInstallments += 1;
        
        // Calcular próxima fecha de pago
        const nextPayment = new Date(plan.nextPaymentDate);
        switch (plan.frequency) {
          case 'semanal':
            nextPayment.setDate(nextPayment.getDate() + 7);
            break;
          case 'quincenal':
            nextPayment.setDate(nextPayment.getDate() + 15);
            break;
          case 'mensual':
            nextPayment.setMonth(nextPayment.getMonth() + 1);
            break;
        }
        plan.nextPaymentDate = nextPayment.toISOString();

        // Si se completaron todos los pagos, marcar como completado
        if (plan.paidInstallments >= plan.totalInstallments) {
          plan.status = 'completado';
        }
      }
    },

    // Eliminar plan
    deletePlan: (state, action: PayloadAction<string>) => {
      state.plans = state.plans.filter(plan => plan.id !== action.payload);
    },

    // Actualizar plan
    updatePlan: (state, action: PayloadAction<MaintenancePlan>) => {
      const index = state.plans.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
    },

    // Limpiar todos los planes
    clearPlans: (state) => {
      state.plans = [];
    }
  }
});

export const {
  addPlan,
  cancelPlan,
  markPayment,
  deletePlan,
  updatePlan,
  clearPlans
} = planSlice.actions;

export default planSlice.reducer;