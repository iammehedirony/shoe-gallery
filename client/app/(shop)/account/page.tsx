"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/src/lib/services/auth.service";
import { useAuthStore } from "@/src/store/authStore";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";

function AccountPageContent() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">("profile");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: authService.getMe,
    enabled: !!user,
  });

  const { data: addresses } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: authService.getAddresses,
    enabled: activeTab === "addresses" && !!user,
  });

  const handleLogout = () => {
    authService.logout();
    clearAuth();
    router.push("/");
  };

  if (isLoading) {
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
                  { key: "profile", label: "👤 Profile", icon: "👤" },
                  { key: "orders", label: "📦 Orders", icon: "📦" },
                  { key: "addresses", label: "📍 Addresses", icon: "📍" },
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
                  <h2 className="text-xl font-bold text-ink mb-6">Profile Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">Full Name</label>
                        <div className="px-4 py-3 bg-gray-50 rounded border border-gray-200">
                          {profile?.name}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">Email</label>
                        <div className="px-4 py-3 bg-gray-50 rounded border border-gray-200">
                          {profile?.email}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">Phone</label>
                        <div className="px-4 py-3 bg-gray-50 rounded border border-gray-200">
                          {profile?.phone || "Not provided"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">Role</label>
                        <div className="px-4 py-3 bg-gray-50 rounded border border-gray-200 capitalize">
                          {profile?.role}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">Member Since</label>
                        <div className="px-4 py-3 bg-gray-50 rounded border border-gray-200">
                          {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <button className="px-6 py-2 bg-brand text-white rounded hover:bg-brand-dark transition font-medium">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-bold text-ink mb-6">Order History</h2>
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
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-ink">Saved Addresses</h2>
                    <button className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-dark transition font-medium text-sm">
                      + Add New Address
                    </button>
                  </div>

                  {addresses && addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address: any) => (
                        <div
                          key={address.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-brand transition"
                        >
                          {address.isDefault && (
                            <span className="inline-block px-2 py-1 bg-brand text-white text-xs font-bold rounded mb-2">
                              DEFAULT
                            </span>
                          )}
                          <h3 className="font-semibold text-ink mb-2">{address.fullName}</h3>
                          <p className="text-sm text-muted mb-1">{address.phone}</p>
                          <p className="text-sm text-muted">
                            {address.street}, {address.city}
                          </p>
                          <p className="text-sm text-muted">
                            {address.district}, {address.country}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📍</div>
                      <p className="text-lg font-medium text-ink mb-2">No addresses saved</p>
                      <p className="text-sm text-muted">Add an address for faster checkout</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
