import Link from "next/link";
import { newArrivalProducts } from "@/src/data/mockProducts";

export default function ProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="bg-brand text-white px-6 py-2 rounded font-bold">Add New Product</Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-ink/70">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {newArrivalProducts.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-4 font-medium">{product.title}</td>
                <td className="p-4">{product.price}৳</td>
                <td className="p-4">10</td>
                <td className="p-4">
                  <button className="text-brand font-bold mr-4">Edit</button>
                  <button className="text-red-500 font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
