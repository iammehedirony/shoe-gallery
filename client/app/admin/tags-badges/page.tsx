"use client";

import { useState, useEffect } from "react";
import { productService } from "@/src/lib/services/product.service";
import { apiClient } from "@/src/lib/api/api.client";
import DeleteConfirmModal from "@/src/components/ui/DeleteConfirmModal";

export default function TagsAndBadgesPage() {
  const [activeTab, setActiveTab] = useState<"tags" | "badges">("tags");
  
  // Tags state
  const [tags, setTags] = useState<any[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  // Badges state
  const [badges, setBadges] = useState<any[]>([]);
  const [newBadgeName, setNewBadgeName] = useState("");
  const [isLoadingBadges, setIsLoadingBadges] = useState(true);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: "tag" | "badge" } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTags();
    fetchBadges();
  }, []);

  async function fetchTags() {
    try {
      const data = await productService.getTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tags", err);
    } finally {
      setIsLoadingTags(false);
    }
  }

  async function fetchBadges() {
    try {
      const data = await productService.getBadges();
      setBadges(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load badges", err);
    } finally {
      setIsLoadingBadges(false);
    }
  }

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await apiClient.post("/admin/tags", { name: newTagName, slug });
      setNewTagName("");
      fetchTags();
    } catch (err: any) {
      alert(err.message || "Failed to create tag");
    }
  };

  const handleDeleteClick = (id: string, name: string, type: "tag" | "badge") => {
    setItemToDelete({ id, name, type });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      if (itemToDelete.type === "tag") {
        await apiClient.delete(`/admin/tags/${itemToDelete.id}`);
        fetchTags();
      } else {
        await apiClient.delete(`/admin/badges/${itemToDelete.id}`);
        fetchBadges();
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      alert(err.message || `Failed to delete ${itemToDelete.type}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadgeName.trim()) return;

    try {
      const slug = newBadgeName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await apiClient.post("/admin/badges", { name: newBadgeName, slug, color: "bg-blue-100 text-blue-700" });
      setNewBadgeName("");
      fetchBadges();
    } catch (err: any) {
      alert(err.message || "Failed to create badge");
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Tags & Badges Management</h1>
          <p className="text-sm text-ink/60">Organize product classification with database-backed tags and promotional badges.</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveTab("tags")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-md font-bold text-sm transition ${
              activeTab === "tags" ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            Tags ({tags.length})
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-md font-bold text-sm transition ${
              activeTab === "badges" ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            Badges ({badges.length})
          </button>
        </div>
      </div>

      {/* Universal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title={`Delete ${itemToDelete?.type === "tag" ? "Tag" : "Badge"}`}
        message={`Are you sure you want to delete ${itemToDelete?.type}`}
        itemName={itemToDelete?.name}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />

      {activeTab === "tags" ? (
        <div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-black/10 mb-8">
            <h2 className="font-bold mb-4">Create New Tag</h2>
            <form onSubmit={handleCreateTag} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input 
                type="text" 
                placeholder="Tag Name (e.g. Summer Edition)" 
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                className="flex-1 border border-black/15 p-3 rounded outline-none focus:border-brand text-ink text-sm" 
                required 
              />
              <button type="submit" className="bg-brand text-white px-6 py-3 rounded font-bold hover:opacity-95 transition text-sm">
                Create Tag
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
            {isLoadingTags ? (
              <div className="py-12 text-center text-sm text-ink/60">Loading tags...</div>
            ) : tags.length === 0 ? (
              <div className="py-12 text-center text-ink/60">No tags found in database.</div>
            ) : (
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-gray-50 text-ink/70 border-b text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-3 sm:p-4">Tag Name</th>
                    <th className="p-3 sm:p-4">Slug</th>
                    <th className="p-3 sm:p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 sm:p-4 font-medium text-ink">{tag.name}</td>
                      <td className="p-3 sm:p-4 text-ink/60 font-mono text-xs sm:text-sm">{tag.slug}</td>
                      <td className="p-3 sm:p-4">
                        <button 
                          onClick={() => handleDeleteClick(tag.id, tag.name, "tag")}
                          className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-black/10 mb-8">
            <h2 className="font-bold mb-4">Create New Badge</h2>
            <form onSubmit={handleCreateBadge} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input 
                type="text" 
                placeholder="Badge Name (e.g. 50% OFF, Trending)" 
                value={newBadgeName}
                onChange={e => setNewBadgeName(e.target.value)}
                className="flex-1 border border-black/15 p-3 rounded outline-none focus:border-brand text-ink text-sm" 
                required 
              />
              <button type="submit" className="bg-brand text-white px-6 py-3 rounded font-bold hover:opacity-95 transition text-sm">
                Create Badge
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
            {isLoadingBadges ? (
              <div className="py-12 text-center text-sm text-ink/60">Loading badges...</div>
            ) : badges.length === 0 ? (
              <div className="py-12 text-center text-ink/60">No badges found in database.</div>
            ) : (
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-gray-50 text-ink/70 border-b text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-3 sm:p-4">Badge Name</th>
                    <th className="p-3 sm:p-4">Slug</th>
                    <th className="p-3 sm:p-4">Preview</th>
                    <th className="p-3 sm:p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {badges.map((badge) => (
                    <tr key={badge.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 sm:p-4 font-medium text-ink">{badge.name}</td>
                      <td className="p-3 sm:p-4 text-ink/60 font-mono text-xs sm:text-sm">{badge.slug}</td>
                      <td className="p-3 sm:p-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${badge.color || "bg-blue-100 text-blue-700"}`}>
                          {badge.name}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4">
                        <button 
                          onClick={() => handleDeleteClick(badge.id, badge.name, "badge")}
                          className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
