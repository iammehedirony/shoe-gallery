import { newArrivalProducts } from "@/src/data/mockProducts";

export default function InventoryPage() {
  // Simple mock calculations
  const totalProducts = newArrivalProducts.length;
  const outOfStock = 0; // Mock
  const lowStock = 2;   // Mock
  const totalValue = newArrivalProducts.reduce((acc, p) => acc + p.price * 10, 0); // Mock stock quantity of 10 per product

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Inventory Management</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Total Products</h3>
          <p className="text-2xl font-bold mt-2 text-ink">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Out of Stock</h3>
          <p className="text-2xl font-bold mt-2 text-red-500">{outOfStock}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Low Stock</h3>
          <p className="text-2xl font-bold mt-2 text-orange-500">{lowStock}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
          <h3 className="text-sm text-ink/60">Total Inventory Value</h3>
          <p className="text-2xl font-bold mt-2 text-brand">৳{totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-ink/70">
            <tr>
              <th className="p-4">Product Title</th>
              <th className="p-4">Current Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {newArrivalProducts.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-4 font-medium">{product.title}</td>
                <td className="p-4">10</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Healthy</span>
                </td>
                <td className="p-4">
                  <input type="number" defaultValue={10} className="border p-1 w-20 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
