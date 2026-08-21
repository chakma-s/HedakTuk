"use client";
import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { fetchAPI } from "@/lib/api";

type OrderStatus = "PLACED" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED";

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    // In a real app, we'd use WebSockets here for live updates
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      // 1. Get my restaurant
      const myRestaurants = await fetchAPI('/restaurants');
      const myRestaurant = myRestaurants.data[0];
      if (!myRestaurant) return;

      // 2. Get orders
      const res = await fetchAPI(`/orders/restaurant/${myRestaurant.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const moveOrder = async (id: string, newStatus: OrderStatus) => {
    try {
      await fetchAPI(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      loadOrders();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const newOrders = orders.filter((o) => o.status === "PLACED" || o.status === "CONFIRMED");
  const preparingOrders = orders.filter((o) => o.status === "PREPARING");
  const readyOrders = orders.filter((o) => o.status === "READY");

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Orders</h1>
          <p className="text-muted">Manage your active orders in real-time.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface border border-border px-4 py-2 rounded-lg text-center">
            <p className="text-xs text-muted uppercase font-bold tracking-wider">Today's Orders</p>
            <p className="text-xl font-bold text-primary">24</p>
          </div>
          <div className="bg-surface border border-border px-4 py-2 rounded-lg text-center">
            <p className="text-xs text-muted uppercase font-bold tracking-wider">Revenue</p>
            <p className="text-xl font-bold text-foreground">₹8,450</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New Column */}
        <OrderColumn 
          title="New Orders" 
          icon={<ShoppingBag size={18} />}
          count={newOrders.length}
          orders={newOrders}
          onAction={(id) => moveOrder(id, "preparing")}
          actionLabel="Accept & Prepare"
          actionColor="bg-primary hover:bg-orange-600 text-white"
        />

        {/* Preparing Column */}
        <OrderColumn 
          title="Preparing" 
          icon={<Clock size={18} />}
          count={preparingOrders.length}
          orders={preparingOrders}
          onAction={(id) => moveOrder(id, "ready")}
          actionLabel="Mark as Ready"
          actionColor="bg-surface-alt border border-border text-foreground hover:bg-border"
        />

        {/* Ready Column */}
        <OrderColumn 
          title="Ready for Pickup" 
          icon={<CheckCircle2 size={18} />}
          count={readyOrders.length}
          orders={readyOrders}
          onAction={(id) => setOrders(orders.filter(o => o.id !== id))}
          actionLabel="Handed to Delivery"
          actionColor="bg-green-500 hover:bg-green-600 text-white"
        />
      </div>
    </div>
  );
}

function OrderColumn({ 
  title, icon, count, orders, onAction, actionLabel, actionColor 
}: { 
  title: string, icon: React.ReactNode, count: number, orders: Order[], 
  onAction: (id: string) => void, actionLabel: string, actionColor: string
}) {
  return (
    <div className="bg-surface border border-border rounded-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border bg-surface-alt flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-foreground">
          {icon}
          {title}
        </div>
        <span className="bg-background text-foreground text-xs font-bold px-2 py-1 rounded-full border border-border">
          {count}
        </span>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-background border border-border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-bold bg-surface-alt px-2 py-1 rounded text-muted">
                  {order.id}
                </span>
                <h3 className="font-bold text-foreground mt-2">{order.user?.name || "Customer"}</h3>
              </div>
              <span className="text-xs text-muted flex items-center gap-1">
                <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            
            <div className="border-t border-border py-2 mb-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm py-1">
                  <span className="text-foreground"><span className="text-muted mr-2">{item.quantity}x</span> {item.name}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-foreground">₹{order.total}</span>
              <button 
                onClick={() => onAction(order.id)}
                className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-md transition-colors ${actionColor}`}
              >
                {actionLabel} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center text-muted">
            <p className="text-sm">No orders here</p>
          </div>
        )}
      </div>
    </div>
  );
}
