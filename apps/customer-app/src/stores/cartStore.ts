import { create } from 'zustand';
import type { MockMenuItem } from '@/data/mockRestaurants';

interface CartItem {
  menuItem: MockMenuItem;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;

  addItem: (restaurantId: string, restaurantName: string, item: MockMenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: null,

  addItem: (restaurantId, restaurantName, item) => {
    const state = get();

    // If cart has items from a different restaurant, clear first
    if (state.restaurantId && state.restaurantId !== restaurantId) {
      set({ items: [], restaurantId: null, restaurantName: null });
    }

    const existing = state.items.find(i => i.menuItem.id === item.id);
    if (existing) {
      set({
        restaurantId,
        restaurantName,
        items: state.items.map(i =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({
        restaurantId,
        restaurantName,
        items: [...state.items, { menuItem: item, quantity: 1 }],
      });
    }
  },

  removeItem: (itemId) => {
    const state = get();
    const newItems = state.items.filter(i => i.menuItem.id !== itemId);
    set({
      items: newItems,
      restaurantId: newItems.length > 0 ? state.restaurantId : null,
      restaurantName: newItems.length > 0 ? state.restaurantName : null,
    });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set(state => ({
      items: state.items.map(i =>
        i.menuItem.id === itemId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

  getItemQuantity: (itemId) => {
    return get().items.find(i => i.menuItem.id === itemId)?.quantity ?? 0;
  },

  getSubtotal: () => {
    return get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  },

  getDeliveryFee: () => 25,

  getTotal: () => {
    const state = get();
    return state.getSubtotal() + state.getDeliveryFee();
  },

  getItemCount: () => {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));
