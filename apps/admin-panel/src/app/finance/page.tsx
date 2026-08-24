"use client";
import { AdminLayout } from '../../components/layout/AdminLayout';

export default function Finance() {
  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Financial Overview</h1>
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Total GMV</h3>
            <p className="text-3xl font-bold mt-2">₹1,24,500</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Platform Commission</h3>
            <p className="text-3xl font-bold mt-2 text-green-500">₹4,200</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Driver Payouts (Pending)</h3>
            <p className="text-3xl font-bold mt-2 text-orange-500">₹8,450</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Restaurant Payouts</h3>
            <p className="text-3xl font-bold mt-2">₹1,11,850</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
