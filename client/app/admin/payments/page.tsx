"use client";

import { useState } from "react";

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState([
    { id: "TXN-001", orderId: "#3", customer: "Zaman", amount: "৳30,000", method: "Cash on Delivery", status: "Pending" },
    { id: "TXN-002", orderId: "#2", customer: "rony", amount: "৳30,000", method: "SSLCommerz", status: "Completed" },
    { id: "TXN-003", orderId: "#1", customer: "rahim", amount: "৳15,000", method: "Bkash", status: "Completed" },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, status: newStatus } : txn))
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Payment Management</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-gray-50 text-ink/70">
            <tr>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Method</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-b">
                <td className="p-4 font-mono text-sm">{txn.id}</td>
                <td className="p-4 font-bold">{txn.orderId}</td>
                <td className="p-4">{txn.customer}</td>
                <td className="p-4">{txn.amount}</td>
                <td className="p-4">{txn.method}</td>
                <td className="p-4">
                  <select 
                    value={txn.status}
                    onChange={(e) => updateStatus(txn.id, e.target.value)}
                    className="bg-gray-50 border rounded p-1 text-xs"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
