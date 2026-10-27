"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, AddressInput } from "@/src/lib/services/auth.service";
import { orderService, AdminOrder } from "@/src/lib/services/order.service";
import { useAuthStore } from "@/src/store/authStore";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/src/lib/format";
import DeleteConfirmModal from "@/src/components/ui/DeleteConfirmModal";

function AccountPageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, clearAuth, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">("profile");

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<{ id: string; name: string } | null>(null);
  const [addressForm, setAddressForm] = useState<AddressInput>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    district: "",
    country: "Bangladesh",
    isDefault: false,
  });

  const { data: profileResponse, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: authService.getMe,
    enabled: !!user,
  });

  const profile = profileResponse?.data || profileResponse;

  useEffect(() => {
    if (profile) {
      setEditName(profile.name || "");
      setEditPhone(profile.phone || "");
    }
  }, [profile]);

  const { data: ordersResponse, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["user-orders"],
    queryFn: orderService.getMyOrders,
    enabled: activeTab === "orders" && !!user,
  });

  const orders: AdminOrder[] = ordersResponse || [];

  const { data: addressesResponse, isLoading: isAddressesLoading } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: authService.getAddresses,
    enabled: activeTab === "addresses" && !!user,
  });

  const addresses = addressesResponse?.data || addressesResponse || [];

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string; phone: string }) => authService.updateProfile(data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      const updated = res?.data || res;
      if (updated) {
        updateUser({ name: updated.name, phone: updated.phone });
      }
      setIsEditingProfile(false);
    },
    onError: (err: any) => {
      alert(err.message || "Failed to update profile");
    },
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: AddressInput) => authService.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      closeAddressModal();
    },
    onError: (err: any) => {
      alert(err.message || "Failed to add address");
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddressInput }) => authService.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      closeAddressModal();
    },
    onError: (err: any) => {
      alert(err.message || "Failed to update address");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: string) => authService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },
    onError: (err: any) => {
      alert(err.message || "Failed to delete address");
    },
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name: editName, phone: editPhone });
  };

  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: profile?.name || "",
      phone: profile?.phone || "",
      street: "",
      city: "",
      district: "",
      country: "Bangladesh",
      isDefault: addresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      district: addr.district || "",
      country: addr.country || "Bangladesh",
      isDefault: addr.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
    setEditingAddressId(null);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddressMutation.mutate({ id: editingAddressId, data: addressForm });
    } else {
      addAddressMutation.mutate(addressForm);
    }
  };

  const handleLogout = () => {
    authService.logout();
    clearAuth();
    router.push("/");
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-muted">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-ink mb-1">My Account</h1>
              <p className="text-sm text-muted">Welcome back, {profile?.name || user?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {[
                  { key: "profile", label: "👤 Profile" },
                  { key: "orders", label: "📦 My Orders" },
                  { key: "addresses", label: "📍 Addresses" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition font-medium text-sm ${
                      activeTab === tab.key
                        ? "bg-brand text-white"
                        : "text-ink hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-ink">Profile Information</h2>
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-dark transition font-medium text-sm"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <form onSubmit={handleProfileSave} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Full Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-brand"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Email (Read-only)</label>
                          <input
                            type="email"
                            value={profile?.email || ""}
                            disabled
                            className="w-full px-4 py-3 rounded border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Phone</label>
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="e.g. 017xxxxxxxx"
                            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-brand"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Role (Read-only)</label>
                          <input
                            type="text"
                            value={profile?.role || ""}
                            disabled
                            className="w-full px-4 py-3 rounded border border-gray-200 bg-gray-100 text-gray-500 capitalize cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Member Since (Read-only)</label>
                          <input
                            type="text"
                            value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                            disabled
                            className="w-full px-4 py-3 rounded border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t">
                        <button
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          className="px-6 py-2 bg-brand text-white rounded hover:bg-brand-dark transition font-medium disabled:opacity-50"
                        >
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingProfile(false);
                            setEditName(profile?.name || "");
                            setEditPhone(profile?.phone || "");
                          }}
                          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Full Name</label>
                          <div className="px-4 py-3 bg-gray-50 rounded border border-gray-200 font-medium text-ink">
                            {profile?.name}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Email</label>
                          <div className="px-4 py-3 bg-gray-50 rounded border border-gray-200 text-ink">
                            {profile?.email}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Phone</label>
                          <div className="px-4 py-3 bg-gray-50 rounded border border-gray-200 text-ink">
                            {profile?.phone || "Not provided"}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Role</label>
                          <div className="px-4 py-3 bg-gray-50 rounded border border-gray-200 capitalize text-ink">
                            {profile?.role}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Member Since (Read-only)</label>
                          <div className="px-4 py-3 bg-gray-50 rounded border border-gray-200 text-muted">
                            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Account ID (Read-only)</label>
                          <div className="px-4 py-3 bg-gray-50 rounded border border-gray-200 font-mono text-xs text-muted truncate">
                            {profile?.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-bold text-ink mb-6">My Orders</h2>

                  {isOrdersLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-2"></div>
                      <p className="text-sm text-muted">Loading your orders...</p>
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-5 hover:border-brand transition bg-white shadow-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 mb-3">
                            <div>
                              <span className="font-bold text-ink text-base">{order.orderNumber || order.id}</span>
                              <span className="text-xs text-muted block">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase ${
                                  order.status === "DELIVERED"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "CANCELLED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {order.status}
                              </span>
                              <span
                                className={`px-2.5 py-1 text-xs font-bold rounded uppercase ${
                                  order.paymentStatus === "PAID"
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                    : "bg-orange-50 text-orange-600 border border-orange-200"
                                }`}
                              >
                                {order.paymentStatus} ({order.paymentMethod})
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                  {item.product?.image && (
                                    <img
                                      src={item.product.image}
                                      alt={item.title}
                                      className="w-12 h-12 object-cover rounded border"
                                    />
                                  )}
                                  <div>
                                    <p className="font-semibold text-ink">{item.title}</p>
                                    <p className="text-xs text-muted">Size: {item.size} | Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <span className="font-medium text-ink">{formatPrice(Number(item.totalPrice))}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm">
                            <span className="text-muted">Shipping to: {order.shippingCity}, {order.shippingAddress}</span>
                            <div className="text-right">
                              <span className="text-xs text-muted mr-2">Total Amount:</span>
                              <span className="font-bold text-lg text-brand">{formatPrice(Number(order.totalAmount))}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-lg font-medium text-ink mb-2">No orders yet</p>
                      <p className="text-sm text-muted mb-6">Start shopping to see your order history here</p>
                      <button
                        onClick={() => router.push("/shop")}
                        className="px-6 py-2 bg-brand text-white rounded hover:bg-brand-dark transition font-medium"
                      >
                        Browse Products
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-ink">Saved Addresses</h2>
                    <button
                      onClick={openAddAddressModal}
                      className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-dark transition font-medium text-sm"
                    >
                      + Add New Address
                    </button>
                  </div>

                  {isAddressesLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-2"></div>
                      <p className="text-sm text-muted">Loading addresses...</p>
                    </div>
                  ) : addresses && addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address: any) => (
                        <div
                          key={address.id}
                          className="border border-gray-200 rounded-lg p-5 hover:border-brand transition bg-white flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-ink">{address.fullName}</h3>
                              {address.isDefault && (
                                <span className="px-2 py-0.5 bg-brand text-white text-xs font-bold rounded">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted mb-1">📞 {address.phone}</p>
                            <p className="text-sm text-muted">
                              📍 {address.street}, {address.city}
                              {address.district ? `, ${address.district}` : ""}
                            </p>
                            <p className="text-sm text-muted">{address.country}</p>
                          </div>

                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => openEditAddressModal(address)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-ink rounded text-xs font-medium transition"
                            >
                              Edit Address
                            </button>
                            <button
                              onClick={() => setAddressToDelete({ id: address.id, name: address.fullName })}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-medium transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📍</div>
                      <p className="text-lg font-medium text-ink mb-2">No addresses saved</p>
                      <p className="text-sm text-muted mb-6">Add an address for faster checkout</p>
                      <button
                        onClick={openAddAddressModal}
                        className="px-6 py-2 bg-brand text-white rounded hover:bg-brand-dark transition font-medium text-sm"
                      >
                        Add New Address
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal (Add / Edit) */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <h3 className="text-lg font-bold text-ink">
                {editingAddressId ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={closeAddressModal}
                className="text-gray-400 hover:text-ink font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  placeholder="Recipient Name"
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-brand text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="017xxxxxxxx"
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-brand text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="House/Road/Area"
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-brand text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="e.g. Dhaka"
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-brand text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">District (Optional)</label>
                  <input
                    type="text"
                    value={addressForm.district}
                    onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                    placeholder="e.g. Dhaka"
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-brand text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Country</label>
                <input
                  type="text"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-brand text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="rounded text-brand focus:ring-brand"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-ink">
                  Set as default address
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                  className="px-5 py-2 bg-brand text-white rounded text-sm font-medium hover:bg-brand-dark transition disabled:opacity-50"
                >
                  {addAddressMutation.isPending || updateAddressMutation.isPending ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!addressToDelete}
        title="Delete Address"
        message="Are you sure you want to delete the address for"
        itemName={addressToDelete?.name}
        isLoading={deleteAddressMutation.isPending}
        onConfirm={() => {
          if (addressToDelete) {
            deleteAddressMutation.mutate(addressToDelete.id, {
              onSuccess: () => {
                setAddressToDelete(null);
              },
            });
          }
        }}
        onClose={() => setAddressToDelete(null)}
      />
    </div>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountPageContent />
    </ProtectedRoute>
  );
}
