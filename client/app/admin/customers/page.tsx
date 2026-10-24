export default function CustomersPage() {
  const customers = [
    { id: 1, name: "Zaman", email: "zaman@example.com", phone: "01700000001", orders: 5, totalSpent: "৳150,000" },
    { id: 2, name: "Rony", email: "rony@gmail.com", phone: "01800000002", orders: 3, totalSpent: "৳90,000" },
    { id: 3, name: "Rahim", email: "rahim@example.com", phone: "01900000003", orders: 2, totalSpent: "৳30,000" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Customers Management</h1>
      
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
