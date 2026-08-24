import { create } from 'zustand';

interface DeliveryState {
  isOnline: boolean;
  status: 'IDLE' | 'PICKING_UP' | 'OUT_FOR_DELIVERY';
  activeOrder: any | null;
  todayEarnings: number;
  thisWeekEarnings: number;
  toggleOnline: () => void;
  setStatus: (status: 'IDLE' | 'PICKING_UP' | 'OUT_FOR_DELIVERY') => void;
  setActiveOrder: (order: any | null) => void;
  fetchEarnings: () => Promise<void>;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  isOnline: false,
  status: 'IDLE',
  activeOrder: null,
  todayEarnings: 0,
  thisWeekEarnings: 0,

  toggleOnline: () => set((state) => ({ isOnline: !state.isOnline })),
  setStatus: (status) => set({ status }),
  setActiveOrder: (order) => set({ activeOrder: order }),
  
  fetchEarnings: async () => {
    // API mock logic for now
    set({ todayEarnings: 850, thisWeekEarnings: 4200 });
  },
}));
