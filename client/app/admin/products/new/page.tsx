export default function AddProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Add New Product</h1>
      <form className="bg-white p-8 rounded-lg shadow-sm border border-black/10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="text" placeholder="Product Title *" className="border p-3 rounded col-span-2" required />
        <input type="number" placeholder="Price *" className="border p-3 rounded" required />
        <input type="number" placeholder="Discount Price" className="border p-3 rounded" />
        <select className="border p-3 rounded">
            <option>Select Category</option>
            <option>Men</option>
            <option>Women</option>
        </select>
        <input type="number" placeholder="Stock Quantity *" className="border p-3 rounded" required />
        <textarea placeholder="Description" className="border p-3 rounded col-span-2 h-32"></textarea>
        <div className="col-span-2">
            <label className="block mb-2 font-semibold">Upload Images</label>
            <input type="file" multiple className="border p-3 rounded w-full" />
        </div>
        <button type="submit" className="bg-brand text-white font-bold py-3 rounded col-span-2">UPLOAD PRODUCT</button>
      </form>
    </div>
  );
}
