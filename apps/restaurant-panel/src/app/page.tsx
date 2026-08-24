"use client";
import { useEffect, useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { fetchAPI } from '../lib/api';

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [prepTime, setPrepTime] = useState(0);
  
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      setOrders(current => current.map(o => {
        if (o.status === 'PLACED') {
          const elapsed = (Date.now() - new Date(o.createdAt).getTime()) / 1000;
          return { ...o, timeLeft: Math.max(0, 60 - Math.floor(elapsed)) };
        }
        return o;
      }).filter(o => o.status !== 'PLACED' || o.timeLeft > 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    // Mock fetch for now
    setOrders([
      { id: '1', status: 'PLACED', createdAt: new Date().toISOString(), total: 450, items: [] }
    ]);
  };

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.start();
      setTimeout(() => osc.stop(), 500);
    } catch(e) {}
  };

  return (
    <AppLayout>
      <div className="p-8 bg-gray-900 min-h-screen text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Kitchen Dashboard</h1>
          <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl">
            <span className="text-xl">⚠️ Slammed? Add Prep Time:</span>
            {[0, 10, 15, 20, 30].map(mins => (
              <button 
                key={mins}
                onClick={() => setPrepTime(mins)}
                className={`px-4 py-2 rounded font-bold ${prepTime === mins ? 'bg-orange-600' : 'bg-gray-700'}`}
              >
                +{mins}m
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-4 rounded-xl border-t-4 border-yellow-500">
            <h2 className="text-2xl font-bold mb-4">New Orders</h2>
            {orders.filter(o => o.status === 'PLACED').map(order => (
              <div key={order.id} className="bg-gray-700 p-6 rounded-lg mb-4 text-center border-2 border-yellow-500/30">
                <div className="text-5xl font-mono text-yellow-400 mb-4 font-bold">
                  00:{order.timeLeft?.toString().padStart(2, '0') || '60'}
                </div>
                <h3 className="text-xl mb-4">Order #{order.id.slice(0,6)} • ₹{order.total}</h3>
                <div className="flex gap-4">
                  <button className="flex-1 bg-green-600 text-white font-bold text-2xl py-4 rounded hover:bg-green-500">ACCEPT</button>
                  <button className="flex-1 bg-red-600 text-white font-bold text-2xl py-4 rounded hover:bg-red-500">REJECT</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-800 p-4 rounded-xl border-t-4 border-blue-500">
            <h2 className="text-2xl font-bold mb-4">Preparing</h2>
            {/* Preparing orders */}
          </div>
          
          <div className="bg-gray-800 p-4 rounded-xl border-t-4 border-green-500">
            <h2 className="text-2xl font-bold mb-4">Ready</h2>
            {/* Ready orders */}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
