import { create } from 'zustand';

export type RiderStatus = 'offline' | 'online' | 'on_trip';

export interface DeliveryOrder {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName: string;
  customerAddress: string;
  earning: number;
  status: 'pending' | 'going_to_pickup' | 'picked_up' | 'going_to_dropoff' | 'delivered';
}

interface DeliveryState {
  status: RiderStatus;
  activeOrder: DeliveryOrder | null;
  todayEarnings: number;
  todayTrips: number;
  setStatus: (status: RiderStatus) => void;
  setActiveOrder: (order: DeliveryOrder | null) => void;
  completeOrder: () => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  status: 'offline',
  activeOrder: null,
  todayEarnings: 0,
  todayTrips: 0,
  setStatus: (status) => set({ status }),
  setActiveOrder: (order) => set({ activeOrder: order, status: order ? 'on_trip' : 'online' }),
  completeOrder: () => set((state) => ({
    activeOrder: null,
    status: 'online',
    todayEarnings: state.todayEarnings + (state.activeOrder?.earning || 0),
    todayTrips: state.todayTrips + 1,
  })),
}));
