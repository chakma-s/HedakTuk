"use client";
import { AdminLayout } from '../../components/layout/AdminLayout';

export default function LiveMap() {
  return (
    <AdminLayout>
      <div className="p-6 h-full flex flex-col bg-gray-950 text-white">
        <h1 className="text-3xl font-bold mb-6 text-green-400">🌍 God Mode: Operations Radar</h1>
        
        <div className="flex gap-6 flex-1">
          {/* Radar Visualization Mock */}
          <div className="flex-1 bg-gray-900 rounded-xl relative overflow-hidden border border-gray-800 flex items-center justify-center">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             <div className="w-64 h-64 border border-green-500/30 rounded-full flex items-center justify-center animate-pulse">
               <div className="w-32 h-32 border border-green-500/50 rounded-full flex items-center justify-center">
                 <div className="w-2 h-2 bg-green-500 rounded-full" />
               </div>
             </div>
             
             {/* Mock dots */}
             <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]" title="Placed" />
             <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]" title="Preparing" />
             <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]" title="Delivery" />
          </div>

          {/* Sidebar */}
          <div className="w-96 flex flex-col gap-6">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
               <h2 className="text-xl font-bold mb-4">Active Operations</h2>
               <div className="flex justify-between items-center py-2 border-b border-gray-800">
                 <span>Active Orders</span>
                 <span className="font-bold text-yellow-400">24</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-gray-800">
                 <span>Online Drivers</span>
                 <span className="font-bold text-green-400">12</span>
               </div>
               <div className="flex justify-between items-center py-2">
                 <span>Avg Delivery</span>
                 <span className="font-bold text-blue-400">28m</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
