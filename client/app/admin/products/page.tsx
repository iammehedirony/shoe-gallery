"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useProducts } from "@/src/hooks/queries/useProducts";
import { useDeleteProduct } from "@/src/hooks/mutations/useDeleteProduct";
import { useCreateProduct } from "@/src/hooks/mutations/useCreateProduct";
import { useUpdateProduct } from "@/src/hooks/mutations/useUpdateProduct";
import { productService } from "@/src/lib/services/product.service";
import DeleteConfirmModal from "@/src/components/ui/DeleteConfirmModal";

const AVAILABLE_SIZES = ["38", "39", "40", "41", "42", "43", "44"];

export default function ProductsPage() {
  const { data: responseData, isLoading, isError, error } = useProducts();
  const deleteProductMutation = useDeleteProduct();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; title: string } | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [badge, setBadge] = useState("");
  
  // Image files state
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [subCategoryId, setSubCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [flashSaleEndTime, setFlashSaleEndTime] = useState("");
  
  const [sizeStocks, setSizeStocks] = useState<Record<string, number>>({
    "39": 10,
    "40": 10,
    "41": 10,
    "42": 10,
  });

  useEffect(() => {
    if (isModalOpen) {
      async function fetchMetaData() {
        setIsLoadingMeta(true);
        try {
          const [catRes, tagRes, badgeRes] = await Promise.all([
            productService.getCategories(),
            productService.getTags(),
            productService.getBadges(),
          ]);
          setCategories(Array.isArray(catRes) ? catRes : []);
          setTags(Array.isArray(tagRes) ? tagRes : []);
          const fetchedBadges = Array.isArray(badgeRes) ? badgeRes : [];
          setBadges(fetchedBadges);
          if (fetchedBadges.length > 0 && !badge) {
            setBadge(fetchedBadges[0].name);
          }
        } catch (err) {
          console.error("Failed to load categories/tags/badges", err);
        } finally {
          setIsLoadingMeta(false);
        }
      }
      fetchMetaData();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!parentCategoryId) {
      setSubCategories([]);
      setSubCategoryId("");
    } else {
      const selectedCat = categories.find(c => c.id === parentCategoryId);
      setSubCategories(selectedCat?.children || []);
    }
  }, [parentCategoryId, categories]);

  useEffect(() => {
    if (!editingProductId && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  }, [title, editingProductId]);

  const handleStockChange = (size: string, stock: number) => {
    setSizeStocks(prev => ({
      ...prev,
      [size]: stock < 0 ? 0 : stock
    }));
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFiles(e.target.files);
      const previews = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleResetForm = () => {
    setEditingProductId(null);
    setTitle("");
    setSlug("");
    setSku("");
    setDescription("");
    setPrice("");
    setOldPrice("");
    setDiscount("");
    setBadge(badges[0]?.name || "");
    setImageFiles(null);
    setImagePreviews([]);
    setParentCategoryId("");
    setSubCategories([]);
    setSubCategoryId("");
    setSelectedTagIds([]);
    setIsFlashSale(false);
    setFlashSaleEndTime("");
    setSizeStocks({ "39": 10, "40": 10, "41": 10, "42": 10 });
  };

  const handleOpenAddModal = () => {
    handleResetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setEditingProductId(product.id || product._id);
    setTitle(product.title || "");
    setSlug(product.slug || "");
    setSku(product.sku || "");
    setDescription(product.description || "");
    setPrice(product.price !== undefined ? String(product.price) : "");
    setOldPrice(product.oldPrice !== undefined ? String(product.oldPrice) : "");
    setDiscount(product.discount !== undefined ? String(product.discount) : "");
    setBadge(product.badge || badges[0]?.name || "");
    
    const imgs = product.images && product.images.length > 0 ? product.images : [product.image].filter(Boolean);
    setImagePreviews(imgs);
    setImageFiles(null);

    const catId = product.categoryId || product.category?.id;
    let foundParent = "";
    let foundSub = "";
    if (catId) {
      const parentCat = categories.find(c => c.id === catId || c.children?.some((sub: any) => sub.id === catId));
      if (parentCat) {
        if (parentCat.id === catId) {
          foundParent = catId;
        } else {
          foundParent = parentCat.id;
          foundSub = catId;
        }
      } else {
        foundParent = catId;
      }
    }
    setParentCategoryId(foundParent);
    setSubCategoryId(foundSub);

    const tagIds = product.tags ? product.tags.map((t: any) => t.id || t._id || t) : [];
    setSelectedTagIds(tagIds);

    setIsFlashSale(product.isFlashSale || false);
    setFlashSaleEndTime(product.flashSaleEndTime ? new Date(product.flashSaleEndTime).toISOString().slice(0, 16) : "");

    const stocks: Record<string, number> = { "38": 0, "39": 0, "40": 0, "41": 0, "42": 0, "43": 0, "44": 0 };
    product.variants?.forEach((v: any) => {
      stocks[v.size] = v.stock;
    });
    setSizeStocks(stocks);

    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategoryId = subCategoryId || parentCategoryId;

    if (!title || !price || !finalCategoryId) {
      alert("Please fill in all required fields (Title, Price, Category).");
      return;
    }

    const variants = Object.entries(sizeStocks)
      .filter(([_, stock]) => stock > 0)
      .map(([size, stock]) => ({ size, stock }));

    if (variants.length === 0) {
      alert("Please add stock for at least one size.");
      return;
    }

    let primaryImageUrl = imagePreviews[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800";
    let allImageUrls = imagePreviews.length > 0 ? imagePreviews : [primaryImageUrl];

    if (imageFiles && imageFiles.length > 0) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        Array.from(imageFiles).forEach(file => formData.append("images", file));
        const uploadRes = await productService.uploadImages(formData);
        const uploadedImages = uploadRes?.data?.images || uploadRes?.images;
        if (uploadedImages && uploadedImages.length > 0) {
          primaryImageUrl = uploadedImages[0].url;
          allImageUrls = uploadedImages.map((img: any) => img.url);
        }
      } catch (uploadErr: any) {
        alert(uploadErr.message || "Failed to upload images to Cloudinary");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      sku: sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      discount: discount ? Number(discount) : undefined,
      badge,
      image: primaryImageUrl,
      images: allImageUrls,
      categoryId: finalCategoryId,
      tagIds: selectedTagIds,
      isFlashSale,
      flashSaleEndTime: flashSaleEndTime ? new Date(flashSaleEndTime).toISOString() : undefined,
      variants,
    };

    try {
      if (editingProductId) {
        await updateProductMutation.mutateAsync({ id: editingProductId, data: payload });
      } else {
        await createProductMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
      handleResetForm();
    } catch (err: any) {
      alert(err.message || (editingProductId ? "Failed to update product" : "Failed to create product"));
    }
  };

  const products = responseData?.products || [];

  const handleDeleteClick = (id: string, prodTitle: string) => {
    setProductToDelete({ id, title: prodTitle });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductMutation.mutateAsync(productToDelete.id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Products Management</h1>
          <p className="text-sm text-ink/60">Manage your store products, pricing, and inventory.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-brand text-white px-6 py-2.5 rounded font-bold text-sm hover:opacity-95 transition shadow-sm"
        >
          + Add New Product
        </button>
      </div>
      
      {/* Product Table */}
      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-ink/60">Loading products...</div>
        ) : isError ? (
          <div className="py-16 text-center text-sm text-red-600">Failed to load products: {error?.message}</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-ink/60">
            <p className="text-base font-medium">No products found</p>
            <p className="text-xs text-ink/40 mt-1">Get started by adding your first product.</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-gray-50 text-ink/70 border-b text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {products.map((product: any) => {
                const totalStock = product.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
                const imageUrl = product.image || product.images?.[0] || "/logo.png";

                return (
                  <tr key={product.id || product._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 w-16">
                      <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 border border-black/5">
                        <Image 
                          src={imageUrl} 
                          alt={product.title} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-medium text-ink">
                      <div>{product.title}</div>
                      <div className="text-xs text-ink/50 font-mono">SKU: {product.sku || "N/A"}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-brand">৳{Number(product.price).toLocaleString()}</div>
                      {product.oldPrice && Number(product.oldPrice) > Number(product.price) && (
                        <div className="text-xs text-ink/40 line-through">৳{Number(product.oldPrice).toLocaleString()}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        totalStock === 0 ? "bg-red-100 text-red-700" :
                        totalStock <= 5 ? "bg-orange-100 text-orange-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {totalStock} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button 
                          type="button"
                          onClick={() => handleOpenEditModal(product)}
                          className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition"
                        >
                          Edit
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteClick(product.id || product._id, product.title)}
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

      {/* Universal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Product"
        message="Are you sure you want to delete product"
        itemName={productToDelete?.title}
        isLoading={deleteProductMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold">{editingProductId ? "Edit Product" : "Add New Product"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-2xl font-bold text-ink/60 hover:text-ink">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block mb-1.5 font-semibold text-sm">Product Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Premium Italian Leather Oxford" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="border border-black/15 p-3 rounded w-full outline-none focus:border-brand text-ink" 
                    required 
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-semibold text-sm">Slug</label>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    className="border border-black/15 p-3 rounded w-full outline-none focus:border-brand bg-gray-50 text-ink" 
                    required 
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-semibold text-sm">SKU Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. JH-OXF-001" 
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    className="border border-black/15 p-3 rounded w-full outline-none focus:border-brand text-ink" 
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-semibold text-sm">Regular Price (৳) *</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 4500" 
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="border border-black/15 p-3 rounded w-full outline-none focus:border-brand text-ink" 
                    required 
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-semibold text-sm">Compare / Old Price (৳)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5500" 
                    value={oldPrice}
                    onChange={e => setOldPrice(e.target.value)}
                    className="border border-black/15 p-3 rounded w-full outline-none focus:border-brand text-ink" 
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-semibold text-sm">Discount (%)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 15" 
                    value={discount}
                    onChange={e => setDiscount(e.target.value)}
                    className="border border-black/15 p-3 rounded w-full outline-none focus:border-brand text-ink" 
                  />
                </div>

                {/* Database-backed Dynamic Badge Selection */}
                <div>
                  <label className="block mb-1.5 font-semibold text-sm">Badge</label>
                  <select 
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    className="border border-black/15 p-3 rounded w-full outline-none focus:border-brand bg-white text-ink"
                  >
                    {isLoadingMeta ? (
                      <option value="" className="text-ink bg-white">Loading badges...</option>
                    ) : badges.length === 0 ? (
                      <option value="" className="text-ink bg-white">No badges found</option>
                    ) : (
                      badges.map((b) => (
                        <option key={b.id} value={b.name} className="text-ink bg-white">
                          {b.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Parent Category */}
                <div>
                  <label className="block mb-1.5 font-semibold text-sm">Parent Category *</label>
                  <select 
                    value={parentCategoryId}
                    onChange={e => setParentCategoryId(e.target.value)}
                    className="border border-black/15 p-3 rounded w-full outline-none focus:border-brand bg-white text-ink"
                    required
                  >
                    <option value="" className="text-ink bg-white">{isLoadingMeta ? "Loading categories..." : "Select Category"}</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id} className="text-ink bg-white">{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sub Category */}
                <div>
                  <label className="block mb-1.5 font-semibold text-sm">Sub-Category</label>
                  <select 
                    value={subCategoryId}
                    onChange={e => setSubCategoryId(e.target.value)}
                    disabled={!parentCategoryId || subCategories.length === 0}
                    className="border border-black/15 p-3 rounded w-full outline-none focus:border-brand bg-white text-ink disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="" className="text-ink bg-white">
                      {!parentCategoryId 
                        ? "Select a parent category first" 
                        : subCategories.length === 0 
                        ? "No subcategories available" 
                        : "Select Sub-Category (Optional)"}
                    </option>
                    {subCategories.map((sub: any) => (
                      <option key={sub.id} value={sub.id} className="text-ink bg-white">{sub.name}</option>
                    ))}
                  </select>
                </div>

                {/* Cloudinary Image Upload */}
                <div className="col-span-2">
                  <label className="block mb-1.5 font-semibold text-sm">Upload Product Images (Cloudinary)</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border border-black/15 p-3 rounded w-full outline-none focus:border-brand bg-white text-ink file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:opacity-90 cursor-pointer" 
                  />
                  {imagePreviews.length > 0 && (
                    <div className="flex gap-3 mt-3 flex-wrap">
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative h-16 w-16 rounded border overflow-hidden bg-gray-50">
                          <Image src={src} alt="Preview" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block mb-1.5 font-semibold text-sm">Description</label>
                  <textarea 
                    placeholder="Write product description..." 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="border border-black/15 p-3 rounded col-span-2 h-28 w-full outline-none focus:border-brand text-ink"
                  ></textarea>
                </div>
                
                {/* Sizes & Stock */}
                <div className="col-span-2 border border-black/10 p-4 rounded-lg bg-gray-50/50">
                  <label className="block mb-2 font-semibold text-sm">Variant Sizes & Stock Quantity *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {AVAILABLE_SIZES.map(size => (
                      <div key={size} className="bg-white p-2.5 rounded border border-black/10">
                        <label className="text-xs font-bold text-ink/70 block mb-1">Size {size}</label>
                        <input 
                          type="number" 
                          min="0"
                          value={sizeStocks[size] ?? 0}
                          onChange={e => handleStockChange(size, parseInt(e.target.value) || 0)}
                          className="border border-black/15 p-2 rounded w-full text-sm outline-none focus:border-brand text-ink"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flash Sale */}
                <div className="col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-black/10 p-4 rounded-lg bg-gray-50/50">
                  <label className="flex items-center gap-2 font-semibold cursor-pointer text-sm">
                    <input 
                      type="checkbox" 
                      checked={isFlashSale}
                      onChange={e => setIsFlashSale(e.target.checked)}
                      className="w-4 h-4 text-brand accent-brand" 
                    /> 
                    Is Flash Sale Product?
                  </label>
                  {isFlashSale && (
                    <div className="flex-1 w-full sm:w-auto">
                      <label className="text-xs font-semibold block mb-1">Flash Sale End Date</label>
                      <input 
                        type="datetime-local" 
                        value={flashSaleEndTime}
                        onChange={e => setFlashSaleEndTime(e.target.value)}
                        className="border border-black/15 p-2 rounded w-full text-sm outline-none focus:border-brand bg-white text-ink" 
                      />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="col-span-2">
                  <label className="block mb-2 font-semibold text-sm">Select Tags</label>
                  <div className="flex flex-wrap gap-4">
                    {isLoadingMeta ? (
                      <p className="text-xs text-ink/60">Loading tags...</p>
                    ) : tags.length === 0 ? (
                      <p className="text-xs text-ink/50 italic">No tags found. You can add tags in the &quot;Tags & Badges&quot; section.</p>
                    ) : (
                      tags.map((tag: any) => (
                        <label key={tag.id} className="flex items-center gap-2 cursor-pointer text-sm">
                          <input 
                            type="checkbox" 
                            checked={selectedTagIds.includes(tag.id)}
                            onChange={() => handleTagToggle(tag.id)}
                            className="w-4 h-4 text-brand accent-brand" 
                          /> 
                          {tag.name}
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border border-black/20 rounded font-bold text-sm hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={createProductMutation.isPending || updateProductMutation.isPending || isUploading}
                    className="bg-brand text-white font-bold px-8 py-3 rounded text-sm transition hover:opacity-95 disabled:opacity-50 shadow-sm"
                  >
                    {isUploading ? "UPLOADING IMAGES..." : (createProductMutation.isPending || updateProductMutation.isPending) ? (editingProductId ? "UPDATING..." : "CREATING...") : (editingProductId ? "UPDATE PRODUCT" : "UPLOAD PRODUCT")}
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
