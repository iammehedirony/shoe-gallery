"use client";

import { useState } from "react";
import Image from "next/image";
import { useBanners } from "@/src/hooks/queries/useBanners";
import { useCreateBanner, useDeleteBanner } from "@/src/hooks/mutations/useBannerMutations";
import { productService } from "@/src/lib/services/product.service";
import DeleteConfirmModal from "@/src/components/ui/DeleteConfirmModal";

export default function CMSPage() {
  const { data: bannersData, isLoading, isError, error } = useBanners(undefined, true);
  const createBannerMutation = useCreateBanner();
  const deleteBannerMutation = useDeleteBanner();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [tagline, setTagline] = useState("");
  const [type, setType] = useState<"HERO" | "SUB_BANNER" | "PROMO">("HERO");
  const [sortOrder, setSortOrder] = useState("0");
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<{ id: string; title: string } | null>(null);

  const banners = bannersData || [];
  const heroBanners = banners.filter((b) => b.type === "HERO");
  const subBanners = banners.filter((b) => b.type === "SUB_BANNER");
  const promoBanners = banners.filter((b) => b.type === "PROMO");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageFile) {
      alert("Please provide a banner title and select an image.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("images", imageFile);
      const uploadRes = await productService.uploadImages(formData);
      const imageUrl = uploadRes?.data?.images?.[0]?.url || uploadRes?.images?.[0]?.url;

      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      await createBannerMutation.mutateAsync({
        title,
        script,
        tagline,
        image: imageUrl,
        type,
        sortOrder: Number(sortOrder) || 0,
        isActive: true,
      });

      setIsModalOpen(false);
      setTitle("");
      setScript("");
      setTagline("");
      setImageFile(null);
      setImagePreview("");
    } catch (err: any) {
      alert(err.message || "Failed to create banner");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (id: string, bannerTitle: string) => {
    setBannerToDelete({ id, title: bannerTitle });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return;
    try {
      await deleteBannerMutation.mutateAsync(bannerToDelete.id);
      setDeleteModalOpen(false);
      setBannerToDelete(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete banner");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          <p className="text-sm text-ink/60">Loading CMS banners...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="font-bold text-base">Failed to load CMS banners</h3>
        <p className="mt-1 text-sm">{error?.message || "Could not connect to backend API."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">CMS & Banner Management</h1>
          <p className="text-sm text-ink/60">Manage store hero sliders, promotional banners, and sub-banners.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand text-white px-6 py-2.5 rounded font-bold text-sm hover:opacity-95 transition shadow-sm"
        >
          + Add New Banner
        </button>
      </div>

      {/* Add Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-xl font-bold">Upload New Banner</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-xl font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Banner Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Summer Collection" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded text-ink outline-none focus:border-brand" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Script / Subtitle</label>
                <input 
                  type="text" 
                  placeholder="e.g. Exclusive Edition" 
                  value={script}
                  onChange={e => setScript(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded text-ink outline-none focus:border-brand" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Tagline</label>
                <input 
                  type="text" 
                  placeholder="e.g. Step into elegance" 
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded text-ink outline-none focus:border-brand" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Banner Type *</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full border border-black/15 p-3 rounded bg-white text-ink outline-none focus:border-brand"
                >
                  <option value="HERO" className="bg-white text-ink">HERO Slider</option>
                  <option value="SUB_BANNER" className="bg-white text-ink">Sub Banner</option>
                  <option value="PROMO" className="bg-white text-ink">Promo Banner</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Sort Order</label>
                <input 
                  type="number" 
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded text-ink outline-none focus:border-brand" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Banner Image (Cloudinary) *</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-black/15 p-3 rounded bg-white text-ink file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white cursor-pointer"
                  required
                />
                {imagePreview && (
                  <div className="relative h-28 w-full mt-3 rounded border overflow-hidden bg-gray-50">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border rounded font-bold text-sm">Cancel</button>
                <button type="submit" disabled={isUploading || createBannerMutation.isPending} className="bg-brand text-white font-bold px-6 py-2.5 rounded text-sm disabled:opacity-50">
                  {isUploading ? "Uploading Image..." : createBannerMutation.isPending ? "Saving..." : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Banner"
        message="Are you sure you want to delete banner"
        itemName={bannerToDelete?.title}
        isLoading={deleteBannerMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />

      {/* Hero Banners */}
      <div>
        <h2 className="text-xl font-bold mb-6">Hero Banners ({heroBanners.length})</h2>
        {heroBanners.length === 0 ? (
          <p className="text-sm text-ink/50 italic bg-white p-6 rounded-lg border">No hero banners uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroBanners.map((banner) => (
              <div key={banner.id} className="bg-white p-4 rounded-lg shadow-sm border border-black/10 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold mb-2 truncate">{banner.title}</h3>
                  <div className="relative h-40 bg-gray-100 mb-4 rounded overflow-hidden border">
                    <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                  </div>
                  {banner.script && <p className="text-xs font-semibold text-brand mb-1">{banner.script}</p>}
                  {banner.tagline && <p className="text-xs text-ink/60 mb-3">{banner.tagline}</p>}
                </div>
                <button 
                  onClick={() => handleDeleteClick(banner.id, banner.title)}
                  className="w-full bg-red-50 text-red-600 border border-red-200 py-2 rounded font-bold text-xs hover:bg-red-100 transition mt-2"
                >
                  Delete Banner
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sub Banners */}
      <div>
        <h2 className="text-xl font-bold mb-6">Sub Banners ({subBanners.length})</h2>
        {subBanners.length === 0 ? (
          <p className="text-sm text-ink/50 italic bg-white p-6 rounded-lg border">No sub banners uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subBanners.map((banner) => (
              <div key={banner.id} className="bg-white p-4 rounded-lg shadow-sm border border-black/10 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold mb-2 truncate">{banner.title}</h3>
                  <div className="relative h-40 bg-gray-100 mb-4 rounded overflow-hidden border">
                    <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteClick(banner.id, banner.title)}
                  className="w-full bg-red-50 text-red-600 border border-red-200 py-2 rounded font-bold text-xs hover:bg-red-100 transition mt-2"
                >
                  Delete Banner
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promo Banners */}
      <div>
        <h2 className="text-xl font-bold mb-6">Promo Banners / Popups ({promoBanners.length})</h2>
        {promoBanners.length === 0 ? (
          <p className="text-sm text-ink/50 italic bg-white p-6 rounded-lg border">No promo banners uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promoBanners.map((banner) => (
              <div key={banner.id} className="bg-white p-4 rounded-lg shadow-sm border border-black/10 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold mb-2 truncate">{banner.title}</h3>
                  <div className="relative h-40 bg-gray-100 mb-4 rounded overflow-hidden border">
                    <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                  </div>
                  {banner.script && <p className="text-xs font-semibold text-brand mb-1">{banner.script}</p>}
                  {banner.tagline && <p className="text-xs text-ink/60 mb-3">{banner.tagline}</p>}
                </div>
                <button 
                  onClick={() => handleDeleteClick(banner.id, banner.title)}
                  className="w-full bg-red-50 text-red-600 border border-red-200 py-2 rounded font-bold text-xs hover:bg-red-100 transition mt-2"
                >
                  Delete Banner
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
