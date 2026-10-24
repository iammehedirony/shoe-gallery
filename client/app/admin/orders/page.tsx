export default function OrdersPage() {
  const orders = [
    { id: "#3", customer: "Zaman", total: "৳30,000", status: "Pending", payment: "Unpaid", date: "2026-10-23" },
    { id: "#2", customer: "rony", total: "৳30,000", status: "Delivered", payment: "Paid", date: "2026-10-23" },
    { id: "#1", customer: "rahim", total: "৳15,000", status: "Processing", payment: "Paid", date: "2026-10-22" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Orders Management</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 text-ink/70">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-4 font-bold">{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">{order.total}</td>
                <td className="p-4">
                  <select className="bg-gray-50 border rounded p-1 text-sm">
                    <option selected={order.status === "Pending"}>Pending</option>
                    <option selected={order.status === "Processing"}>Processing</option>
                    <option selected={order.status === "Delivered"}>Delivered</option>
                    <option selected={order.status === "Cancelled"}>Cancelled</option>
                  </select>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${order.payment === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {order.payment}
                  </span>
                </td>
                <td className="p-4 text-sm text-ink/60">{order.date}</td>
                <td className="p-4">
                    <button className="text-brand font-bold text-sm">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
