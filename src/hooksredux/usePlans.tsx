import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addPlan,
  cancelPlan,
  markPayment,
  deletePlan,
  updatePlan,
  clearPlans,
  MaintenancePlan
} from "../store/PlanSlice";

export const usePlans = () => {
  const dispatch = useAppDispatch();
  const plans = useAppSelector(state => state.plans?.plans || []); // Safe access

  // Agregar nuevo plan
  const addNewPlan = (planData: Omit<MaintenancePlan, 'id' | 'createdAt'>) => {
    dispatch(addPlan(planData));
  };

  // Cancelar plan
  const cancelMaintenancePlan = (id: string) => {
    dispatch(cancelPlan(id));
  };

  // Marcar pago realizado
  const markPaymentAsPaid = (id: string) => {
    dispatch(markPayment(id));
  };

  // Eliminar plan
  const deleteMaintenancePlan = (id: string) => {
    dispatch(deletePlan(id));
  };

  // Actualizar plan
  const updateMaintenancePlan = (plan: MaintenancePlan) => {
    dispatch(updatePlan(plan));
  };

  // Limpiar todos los planes
  const clearAllPlans = () => {
    dispatch(clearPlans());
  };

  // Calcular próximas fechas de pago
  const calculateNextPaymentDate = (frequency: 'semanal' | 'quincenal' | 'mensual') => {
    const today = new Date();
    const nextPayment = new Date();
    
    switch (frequency) {
      case 'semanal':
        nextPayment.setDate(today.getDate() + 7);
        break;
      case 'quincenal':
        nextPayment.setDate(today.getDate() + 15);
        break;
      case 'mensual':
        nextPayment.setMonth(today.getMonth() + 1);
        break;
    }
    
    return nextPayment.toISOString();
  };

  // Calcular monto de cuota
  const calculateInstallmentAmount = (totalAmount: number, frequency: 'semanal' | 'quincenal' | 'mensual') => {
    let installments = 0;
    
    switch (frequency) {
      case 'semanal':
        installments = 12; // 12 semanas = 3 meses
        break;
      case 'quincenal':
        installments = 6; // 6 quincenas = 3 meses
        break;
      case 'mensual':
        installments = 3; // 3 meses
        break;
    }
    
    return Math.ceil(totalAmount / installments);
  };

  // Obtener planes activos
  const getActivePlans = () => {
    if (!Array.isArray(plans)) return [];
    return plans.filter(plan => plan?.status === 'activo');
  };

  // Obtener planes completados
  const getCompletedPlans = () => {
    if (!Array.isArray(plans)) return [];
    return plans.filter(plan => plan?.status === 'completado');
  };

  // Obtener planes cancelados
  const getCanceledPlans = () => {
    if (!Array.isArray(plans)) return [];
    return plans.filter(plan => plan?.status === 'cancelado');
  };

  return {
    plans: plans || [],
    activePlans: getActivePlans(),
    completedPlans: getCompletedPlans(),
    canceledPlans: getCanceledPlans(),
    addPlan: addNewPlan,
    cancelPlan: cancelMaintenancePlan,
    markPayment: markPaymentAsPaid,
    deletePlan: deleteMaintenancePlan,
    updatePlan: updateMaintenancePlan,
    clearPlans: clearAllPlans,
    calculateNextPaymentDate,
    calculateInstallmentAmount
  };
};