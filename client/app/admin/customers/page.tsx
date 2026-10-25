"use client";

import { useState } from "react";

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([
    { id: 1, name: "Zaman", email: "zaman@example.com", phone: "01700000001", orders: 5, totalSpent: "৳150,000" },
    { id: 2, name: "Rony", email: "rony@gmail.com", phone: "01800000002", orders: 3, totalSpent: "৳90,000" },
    { id: 3, name: "Rahim", email: "rahim@example.com", phone: "01900000003", orders: 2, totalSpent: "৳30,000" },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Customers Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand text-white px-6 py-2 rounded font-bold"
        >
          Add New Customer
        </button>
      </div>
      
      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Customer</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-xl">✕</button>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <input type="text" placeholder="Full Name *" className="border p-3 rounded col-span-2" required />
              <input type="email" placeholder="Email Address *" className="border p-3 rounded" required />
              <input type="tel" placeholder="Phone Number *" className="border p-3 rounded" required />
              <input type="text" placeholder="Address" className="border p-3 rounded col-span-2" />
              <button type="submit" className="bg-brand text-white font-bold py-3 rounded col-span-2">SAVE CUSTOMER</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 text-ink/70">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Total Orders</th>
              <th className="p-4">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b">
                <td className="p-4 font-bold">{customer.name}</td>
                <td className="p-4">{customer.email}</td>
                <td className="p-4">{customer.phone}</td>
                <td className="p-4">{customer.orders}</td>
                <td className="p-4 font-bold text-brand">{customer.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
