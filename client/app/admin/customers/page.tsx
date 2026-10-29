"use client";

import { useState } from "react";
import { useCustomers } from "@/src/hooks/queries/useCustomers";
import { useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from "@/src/hooks/mutations/useCustomerMutations";
import DeleteConfirmModal from "@/src/components/ui/DeleteConfirmModal";

export default function CustomersPage() {
  const { data: customersData, isLoading, isError, error } = useCustomers();
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<{ id: string; name: string } | null>(null);

  // Form states for Add
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Form states for Edit
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const customers = customersData || [];

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCustomerMutation.mutateAsync({ name, email, password, phone });
      setIsAddModalOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
    } catch (err: any) {
      alert(err.message || "Failed to create customer");
    }
  };

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    try {
      await updateCustomerMutation.mutateAsync({
        id: editingCustomer.id,
        data: { name: editName, email: editEmail, phone: editPhone },
      });
      setIsEditModalOpen(false);
      setEditingCustomer(null);
    } catch (err: any) {
      alert(err.message || "Failed to update customer");
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setCustomerToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomerMutation.mutateAsync(customerToDelete.id);
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete customer");
    }
  };

  const openEditModal = (cust: any) => {
    setEditingCustomer(cust);
    setEditName(cust.name);
    setEditEmail(cust.email);
    setEditPhone(cust.phone || "");
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          <p className="text-sm text-ink/60">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="font-bold text-base">Failed to load customers</h3>
        <p className="mt-1 text-sm">{error?.message || "Could not connect to backend API."}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Customers Management</h1>
          <p className="text-sm text-ink/60">View registered customers, total orders, and lifetime spend.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand text-white px-6 py-2.5 rounded font-bold text-sm hover:opacity-95 transition shadow-sm"
        >
          + Add New Customer
        </button>
      </div>
      
      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-xl w-full max-w-lg max-h-[95vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6 border-b pb-3">
              <h2 className="text-lg sm:text-xl font-bold">Register New Customer</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-xl font-bold p-1">✕</button>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddCustomer}>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1">Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded-xl text-ink text-sm outline-none focus:border-brand" 
                  required 
                />
              </div>
              <div className="col-span-1 md:col-span-1">
                <label className="block text-xs font-semibold mb-1">Email Address *</label>
                <input 
                  type="email" 
                  placeholder="e.g. john@example.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded-xl text-ink text-sm outline-none focus:border-brand" 
                  required 
                />
              </div>
              <div className="col-span-1 md:col-span-1">
                <label className="block text-xs font-semibold mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 01700000000" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded-xl text-ink text-sm outline-none focus:border-brand" 
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1">Password *</label>
                <input 
                  type="password" 
                  placeholder="Secure password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded-xl text-ink text-sm outline-none focus:border-brand" 
                  required 
                />
              </div>
              <div className="col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto px-5 py-2.5 border rounded-xl font-bold text-xs sm:text-sm">Cancel</button>
                <button type="submit" disabled={createCustomerMutation.isPending} className="w-full sm:w-auto bg-brand text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm disabled:opacity-50">
                  {createCustomerMutation.isPending ? "Registering..." : "Register Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-xl w-full max-w-lg max-h-[95vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6 border-b pb-3">
              <h2 className="text-lg sm:text-xl font-bold">Edit Customer</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-xl font-bold p-1">✕</button>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleEditCustomer}>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1">Full Name *</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded-xl text-ink text-sm outline-none focus:border-brand" 
                  required 
                />
              </div>
              <div className="col-span-1 md:col-span-1">
                <label className="block text-xs font-semibold mb-1">Email Address *</label>
                <input 
                  type="email" 
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded-xl text-ink text-sm outline-none focus:border-brand" 
                  required 
                />
              </div>
              <div className="col-span-1 md:col-span-1">
                <label className="block text-xs font-semibold mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded-xl text-ink text-sm outline-none focus:border-brand" 
                />
              </div>
              <div className="col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="w-full sm:w-auto px-5 py-2.5 border rounded-xl font-bold text-xs sm:text-sm">Cancel</button>
                <button type="submit" disabled={updateCustomerMutation.isPending} className="w-full sm:w-auto bg-brand text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm disabled:opacity-50">
                  {updateCustomerMutation.isPending ? "Updating..." : "Update Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Customer"
        message="Are you sure you want to delete customer"
        itemName={customerToDelete?.name}
        isLoading={deleteCustomerMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />

      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        {customers.length === 0 ? (
          <div className="py-16 text-center text-ink/60">
            <p className="text-base font-medium">No customers found</p>
            <p className="text-xs text-ink/40 mt-1">Registered customers will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[750px]">
            <thead className="bg-gray-50 text-ink/70 border-b text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Total Spend</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {customers.map((customer) => {
                const totalSpent = customer.orders
                  ?.filter((o: any) => o.paymentStatus === "PAID")
                  .reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0) || 0;

                return (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-ink">{customer.name}</td>
                    <td className="p-4 text-ink/70">{customer.email}</td>
                    <td className="p-4 text-ink/70">{customer.phone || "N/A"}</td>
                    <td className="p-4 font-medium">{customer._count?.orders || 0}</td>
                    <td className="p-4 font-bold text-brand">৳{totalSpent.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditModal(customer)}
                          className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(customer.id, customer.name)}
                          className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
