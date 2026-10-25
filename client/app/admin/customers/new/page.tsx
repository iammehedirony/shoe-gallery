export default function AddCustomerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Add New Customer</h1>
      <form className="bg-white p-8 rounded-lg shadow-sm border border-black/10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="text" placeholder="Full Name *" className="border p-3 rounded" required />
        <input type="email" placeholder="Email Address *" className="border p-3 rounded" required />
        <input type="tel" placeholder="Phone Number *" className="border p-3 rounded" required />
        <input type="text" placeholder="Address" className="border p-3 rounded" />
        <button type="submit" className="bg-brand text-white font-bold py-3 rounded md:col-span-2">SAVE CUSTOMER</button>
      </form>
    </div>
  );
}
