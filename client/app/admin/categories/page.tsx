"use client";

import { useState, useEffect } from "react";
import { productService } from "@/src/lib/services/product.service";
import { apiClient } from "@/src/lib/api/api.client";
import DeleteConfirmModal from "@/src/components/ui/DeleteConfirmModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form states
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");
  
  const [subcategoryName, setSubcategoryName] = useState("");
  const [targetParentId, setTargetParentId] = useState("");

  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const data = await productService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (editingCategory) {
        await apiClient.patch(`/admin/categories/${editingCategory.id}`, {
          name: categoryName,
          slug,
          description: categoryDescription,
        });
      } else {
        await apiClient.post("/admin/categories", {
          name: categoryName,
          slug,
          description: categoryDescription,
          parentId: selectedParentId || null,
        });
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryName("");
      setCategoryDescription("");
      setSelectedParentId("");
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to save category");
    }
  };

  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subcategoryName.trim() || !targetParentId) {
      alert("Please enter subcategory name and select a parent category.");
      return;
    }

    try {
      const slug = subcategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await apiClient.post("/admin/categories", {
        name: subcategoryName,
        slug,
        parentId: targetParentId,
      });
      setIsSubcategoryModalOpen(false);
      setSubcategoryName("");
      setTargetParentId("");
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to create subcategory");
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setCategoryToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/admin/categories/${categoryToDelete.id}`);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryDescription(cat.description || "");
    setSelectedParentId(cat.parentId || "");
    setIsCategoryModalOpen(true);
  };

  const handleOpenAddSub = (parentId: string) => {
    setTargetParentId(parentId);
    setIsSubcategoryModalOpen(true);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Categories & Sub-Categories</h1>
          <p className="text-sm text-ink/65">Manage parent categories and nested subcategories dynamically from the database.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => {
              setEditingCategory(null);
              setCategoryName("");
              setCategoryDescription("");
              setSelectedParentId("");
              setIsCategoryModalOpen(true);
            }}
            className="flex-1 md:flex-none bg-brand text-white px-4 py-2.5 rounded font-bold text-xs md:text-sm hover:opacity-95 transition shadow-sm"
          >
            + Add New Category
          </button>
          <button 
            onClick={() => {
              setTargetParentId(categories[0]?.id || "");
              setIsSubcategoryModalOpen(true);
            }}
            className="flex-1 md:flex-none bg-ink text-white px-4 py-2.5 rounded font-bold text-xs md:text-sm hover:opacity-95 transition shadow-sm"
          >
            + Create Subcategory
          </button>
        </div>
      </div>

      {/* Category Modal (Add/Edit) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingCategory ? "Edit Category" : "Add New Category"}</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-xl font-bold">✕</button>
            </div>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Category Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Men Collection" 
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded text-ink outline-none focus:border-brand" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea 
                  placeholder="Optional description" 
                  value={categoryDescription}
                  onChange={e => setCategoryDescription(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded text-ink outline-none focus:border-brand h-20" 
                ></textarea>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="flex-1 border p-3 rounded font-bold text-sm">Cancel</button>
                <button type="submit" className="flex-1 bg-brand text-white p-3 rounded font-bold text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {isSubcategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Subcategory</h2>
              <button onClick={() => setIsSubcategoryModalOpen(false)} className="text-xl font-bold">✕</button>
            </div>
            <form onSubmit={handleSaveSubcategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Subcategory Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Oxford Shoes" 
                  value={subcategoryName}
                  onChange={e => setSubcategoryName(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded text-ink outline-none focus:border-brand" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Parent Category *</label>
                <select 
                  value={targetParentId}
                  onChange={e => setTargetParentId(e.target.value)}
                  className="w-full border border-black/15 p-3 rounded bg-white text-ink outline-none focus:border-brand"
                  required
                >
                  <option value="" className="bg-white text-ink">Select Parent Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-white text-ink">{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setIsSubcategoryModalOpen(false)} className="flex-1 border p-3 rounded font-bold text-sm">Cancel</button>
                <button type="submit" className="flex-1 bg-brand text-white p-3 rounded font-bold text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Category"
        message="Are you sure you want to delete category"
        itemName={categoryToDelete?.name}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />

      {isLoading ? (
        <div className="py-16 text-center text-ink/60">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="bg-white p-12 rounded-lg text-center border border-black/10">
          <p className="text-ink/60 font-medium">No categories found in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-black/10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3 gap-2">
                  <h2 className="text-sm md:text-lg font-bold text-ink truncate">{cat.name}</h2>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleOpenEdit(cat)}
                      className="text-blue-600 text-xs font-semibold bg-blue-50 px-2.5 py-1 rounded hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(cat.id, cat.name)}
                      className="text-red-600 text-xs font-semibold bg-red-50 px-2.5 py-1 rounded hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {cat.description && <p className="text-xs text-ink/60 mb-3">{cat.description}</p>}

                <div className="flex justify-between items-center mb-2 mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Sub-categories</span>
                  <button 
                    onClick={() => handleOpenAddSub(cat.id)}
                    className="text-brand text-xs font-semibold hover:underline"
                  >
                    + Add Sub-category
                  </button>
                </div>

                <ul className="space-y-2 mb-4">
                  {(!cat.children || cat.children.length === 0) ? (
                    <li className="text-xs text-ink/40 italic p-2">No subcategories yet.</li>
                  ) : (
                    cat.children.map((sub: any) => (
                      <li key={sub.id} className="flex justify-between items-center bg-gray-50 p-2.5 rounded text-xs md:text-sm">
                        <span className="truncate font-medium text-ink">{sub.name}</span>
                        <button 
                          onClick={() => handleDeleteClick(sub.id, sub.name)}
                          className="text-red-500 hover:text-red-700 text-xs ml-2 font-semibold"
                        >
                          Delete
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
